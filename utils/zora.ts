import ky from "ky";
import { ZoraNFT } from "../types/collect.type";
import { CommentResponse } from "../types/comment.type";
import { MintedTypeResponse } from "../types/mint.type";

type ZoraSlug = "zora" | "base" | "eth" | "oeth" | "arb" | "pgn" | "blast";

export function chainNameToSlug(chainName: string): ZoraSlug {
  let chainString: ZoraSlug;

  switch (chainName) {
    case "ZORA-MAINNET":
      chainString = "zora";
      break;
    case "BASE-MAINNET":
      chainString = "base";
      break;
    case "ETHEREUM-MAINNET":
      chainString = "eth";
      break;
    case "OPTIMISM-MAINNET":
      chainString = "oeth";
      break;
    case "ARBITRUM-MAINNET":
      chainString = "arb";
      break;
    case "PGN-MAINNET":
      chainString = "pgn";
      break;
    case "BLAST-MAINNET":
      chainString = "blast";
      break;
    default:
      throw new Error("Invalid chain name");
  }

  return chainString;
}

export function prettifyChainName(chainName: string): string {
  switch (chainName) {
    case "ZORA-MAINNET":
      return "Zora";
    case "BASE-MAINNET":
      return "Base";
    case "ETHEREUM-MAINNET":
      return "Ethereum";
    case "OPTIMISM-MAINNET":
      return "Optimism";
    case "ARBITRUM-MAINNET":
      return "Arbitrum";
    case "PGN-MAINNET":
      return "Polygon";
    case "BLAST-MAINNET":
      return "Blast";
    default:
      return chainName;
  }
}

export function nftToFileName(nft: ZoraNFT) {
  const { chainName, name, address } = nft.collection;
  return `${chainNameToSlug(chainName)}-${name}-${address}`;
}

// we probably shouldn't have to worry about paginating since we're polling every min
export async function getCommentByDesigner(nft: ZoraNFT) {
  let resp: CommentResponse | null = null;
  let attempts = 0;
  while (!resp && attempts < 10) {
    try {
      const response = await ky(
        `https://api.zora.co/discover/mint_comments/${nft.collection.chainName}/${nft.collection.address}?limit=12&sort_direction=DESC&token_id=${nft.token.tokenId}`
      ).json<CommentResponse>();
      resp = response;
      break; // Exit the loop if the fetch is successful
    } catch (error) {
      console.error("Fetching comments failed, attempt", attempts + 1, error);
      attempts++;
      // Optional: Implement a delay here if necessary
    }
  }

  const commentByDesigner = resp?.data?.find((comment) => {
    return comment.minter.username === "0xdesigner";
  });

  if (commentByDesigner?.comment) {
    return commentByDesigner.comment;
  }
}

export async function getMintCount(nft: ZoraNFT) {
  let resp: MintedTypeResponse | null = null;
  let attempts = 0;
  while (!resp && attempts < 10) {
    try {
      const response = await ky(
        `https://api.zora.co/discover/token_mints/${nft.collection.chainName}/${nft.collection.address}?limit=12&sort_direction=DESC&token_id=${nft.token.tokenId}`
      ).json<MintedTypeResponse>();
      resp = response;
      break; // Exit the loop if the fetch is successful
    } catch (error) {
      console.error(
        "Fetching mint quantity failed, attempt",
        attempts + 1,
        error
      );
      attempts++;
      // Optional: Implement a delay here if necessary
    }
  }

  const mintByDesigner = resp?.data?.find((comment) => {
    return comment.minter.username === "0xdesigner";
  });

  const mintCount = mintByDesigner?.value;
  if (mintCount !== undefined) {
    return mintCount;
  }
}

import { ZoraNFT } from "../types/zora.types";

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

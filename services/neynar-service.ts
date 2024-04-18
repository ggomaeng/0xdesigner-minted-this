import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import {
  FARCASTER_DEVELOPER_MNEMONIC,
  FARCASTER_SIGNER_UUID,
  NEYNAR_API_KEY,
} from "../env/server-env";

export const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

export async function cast(params: {
  text: string;
  embeds: { url: string }[];
  parentHash?: string;
  channelId?: string;
}) {
  const { text, embeds, parentHash, channelId } = params;
  console.log(text, { embeds, replyTo: parentHash });

  let castRootHash = null;
  let lastHash = parentHash;

  // Improved chunking with URL preservation and dynamic byte size checking
  const createChunks = (text: string, maxBytes: number): string[] => {
    const chunks = [];
    let currentChunk = "";

    for (const char of text) {
      // Check if adding the next character exceeds the max byte size
      if (
        new Blob([currentChunk + char]).size <= maxBytes ||
        currentChunk === ""
      ) {
        currentChunk += char;
      } else {
        chunks.push(currentChunk);
        currentChunk = char;
      }
    }

    // Add the last chunk if it's not empty
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  // Use the new createChunks function with a max byte size of 320
  const chunks = createChunks(text, 320);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLastChunk = i === chunks.length - 1;
    const { hash } = await neynarClient.publishCast(
      FARCASTER_SIGNER_UUID,
      chunk,
      {
        replyTo: lastHash,
        embeds: isLastChunk ? embeds : [],
        channelId,
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 2000)); // give some room for sync
    lastHash = hash;
    if (!castRootHash) castRootHash = hash;
  }

  return castRootHash as `0x${string}`;
}

// only need to run this once, to create a signer and register the signed key
// after you confirm the url given in the console
// save the signer uuid and public key in .env
// no need to do it again until you want to create a new signer
// await init();
async function init() {
  const oneYearInSeconds = 365 * 24 * 60 * 60;
  console.log(`One year has ${oneYearInSeconds} seconds.`);
  const resp = await neynarClient.createSignerAndRegisterSignedKey(
    FARCASTER_DEVELOPER_MNEMONIC,
    {
      deadline: Math.floor(Date.now() / 1000) + oneYearInSeconds * 5,
    }
  );
  console.log(resp);
}
// check the status of the signer
// await status();
async function status() {
  const resp = await neynarClient.lookupSigner(FARCASTER_SIGNER_UUID);
  console.log(resp);
}

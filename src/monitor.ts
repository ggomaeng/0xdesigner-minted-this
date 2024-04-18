import { sleep } from "bun";
import { readFileSync, writeFileSync } from "fs";
import ky from "ky";
import cron from "node-cron";
import { cast } from "../services/neynar-service";
import { ZoraNFT } from "../types/collect.type";
import { Logger } from "../utils/Logger";
import {
  chainNameToSlug,
  getCommentByDesigner,
  getMintCount,
  nftToFileName,
  prettifyChainName,
} from "../utils/zora";

// 30 requests per min rate limit without api key
// doesn't matter tho we only track one user
// we only care about new mints
const MAX_TRIES = 30;
export async function getMints(tries = 1) {
  if (tries > MAX_TRIES) {
    throw new Error("Failed to sync and cast after 10 tries");
  }

  const json = await ky(
    "https://zora.co/api/trpc/user.collectedTokens?batch=1&input=%7B%220%22:%7B%22json%22:%7B%22limit%22:24,%22chainNames%22:%5B%22ETHEREUM-MAINNET%22,%22ZORA-MAINNET%22,%22OPTIMISM-MAINNET%22,%22BASE-MAINNET%22,%22ARBITRUM-MAINNET%22,%22PGN-MAINNET%22,%22BLAST-MAINNET%22%5D,%22userAddress%22:%220xabb485fdc925dc375b5d095a30fcae7f136fd007%22,%22sortDirection%22:%22DESC%22,%22direction%22:%22forward%22%7D%7D%7D"
  ).json<
    [
      {
        result: {
          data: {
            json: {
              data: {};
            };
          };
        };
      }
    ]
  >();
  const data = json?.[0]?.result?.data?.json?.data as ZoraNFT[];

  if (!data) {
    Logger.info(`Trying again... try: ${tries}`);
    await sleep(1000); // sleep for 1 second
    return await getMints(tries + 1);
  }

  let returnData: ZoraNFT[] = [];

  for (const nft of data) {
    // check if file exists
    // we should probably use db later on
    const filename = nftToFileName(nft);
    try {
      Logger.info(`skipping ${filename}`);
      readFileSync(`./minted/${filename}.json`, "utf-8");
    } catch (e) {
      // doesn't exist. we return it and save it in callback
      writeFileSync(
        "./minted/" + filename + ".json",
        JSON.stringify(nft, null, 2)
      );
      returnData.push(nft);
    }
  }

  return returnData;
}

export async function syncAndCast() {
  const data = await getMints();
  console.log("NEW MINTS", data.length, data);
  for (const nft of data) {
    const { token, collection } = nft;
    const { creator, name } = token;
    Logger.info(`${Date.now()} - New mint: ${name} by ${creator}`);
    const slug = chainNameToSlug(collection.chainName);
    // https://zora.co/collect/blast:0xf3a45a18363a583f43f6757ba3d2de59b3d5329a/1
    const zoraMintUrl = `https://zora.co/collect/${slug}:${collection.address}/${token.tokenId}`;

    const minted = await getMintCount(nft);
    let text = `minted x${minted} of ${name}`;

    const comment = await getCommentByDesigner(nft);
    if (comment) {
      text += `\n\ncommented: ${comment}`;
    }

    await cast({
      text,
      embeds: [{ url: zoraMintUrl }],
      channelId: "mint-that",
    })
      .catch((e) => {
        console.error(e);
      })
      .then(() => {
        // only if it succeeds we save
        const filename = nftToFileName(nft);
        writeFileSync(
          `./minted/${filename}.json`,
          JSON.stringify(nft, null, 2)
        );
      });
  }
}

Logger.info(
  "Starting cron job for 0xdesigner's mints on zora. Checking every minute"
);

cron.schedule("* * * * *", async () => {
  Logger.info("Running cron job for 0xdesigner's mints on zora");
  await syncAndCast();
});

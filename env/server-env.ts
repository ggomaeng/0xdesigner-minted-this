import dotenv from "dotenv";
import { object, parse, string } from "valibot";

dotenv.config();

const envSchema = object({
  // not required right now but maybe later for frog.fm frames
  SECRET: string("SECRET is required"),
  FARCASTER_DEVELOPER_FID: string("FARCASTER_DEVELOPER_FID is required"),
  FARCASTER_SIGNER_UUID: string("FARCASTER_SIGNER_UUID is required"),
  FARCASTER_PUBLIC_KEY: string("FARCASTER_PUBLIC_KEY is required"),
  FARCASTER_DEVELOPER_MNEMONIC: string(
    "FARCASTER_DEVELOPER_MNEMONIC is required"
  ),
  NEYNAR_API_KEY: string("NEYNAR_API_KEY is required"),
});

export const {
  SECRET,
  FARCASTER_PUBLIC_KEY,
  FARCASTER_SIGNER_UUID,
  FARCASTER_DEVELOPER_FID,
  FARCASTER_DEVELOPER_MNEMONIC,
  NEYNAR_API_KEY,
} = parse(envSchema, process.env);

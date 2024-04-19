type Minter = {
  address: string;
  username: string | null;
  display_name: string | null;
  ens_name: string | null;
  avatar: string | null;
  current_user_hide_setting: any | null;
  following_status: string;
};

type Currency = {
  name: string;
  address: string;
  decimals: number;
};

type Fee = {
  currency: Currency;
  value: string;
  decimal: number;
  raw: number;
};

type TransactionInfo = {
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
};

type MintedToken = {
  chain_name: string;
  collection_address: string;
  token_id: string;
  token_standard: string;
  originator_address: string;
  to_address: string;
  minter: Minter;
  fee: Fee;
  value: number;
  transaction_info: TransactionInfo;
  mint_type: "MINT" | "AIRDROP";
};

type Cursor = {
  first: string;
  last: string;
};

export type MintedTypeResponse = {
  data: MintedToken[];
  limit: number;
  has_more: boolean;
  cursor: Cursor;
  total: number;
};

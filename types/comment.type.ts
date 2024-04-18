type MinterInfo = {
  address: string;
  username: string;
  display_name: string | null;
  ens_name: string | null;
  avatar: string | null;
  current_user_hide_setting: any | null;
  following_status: string;
};

type TransactionInfo = {
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
};

type CommentData = {
  chain_name: string;
  collection_address: string;
  token_id: string;
  token_standard: any | null;
  comment: string;
  from_address: string;
  is_blocked: boolean;
  minter: MinterInfo;
  quantity: number;
  transaction_info: TransactionInfo;
};

type CommentCursor = {
  first: string;
  last: string;
};

export type CommentResponse = {
  data: CommentData[];
  limit: number;
  has_more: boolean;
  cursor: CommentCursor;
  total: number;
};

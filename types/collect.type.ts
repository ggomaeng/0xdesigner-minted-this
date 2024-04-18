type ImageInfo = {
  url: string;
  mimeType: string;
  resizedImage: string;
};

type MediaInfo = {
  url: string | null;
  mimeType: string | null;
};

type TokenInfo = {
  tokenId: string;
  creator: string;
  name: string;
  totalMinted: number;
  isStarted: boolean;
  image: ImageInfo;
  media: MediaInfo;
};

type CollectionInfo = {
  chainName: string;
  name: string;
  address: string;
  image: string | null;
  resizedImage: string | null;
};

export type ZoraNFT = {
  standard: string;
  mintableType: string;
  collection: CollectionInfo;
  token: TokenInfo;
};

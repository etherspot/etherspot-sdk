// Constants
import { ASSET_TYPES } from './';

// Types
import type { Chain, ChainRecord } from './';

export type Collectible = {
  tokenType: typeof ASSET_TYPES.COLLECTIBLE;
  contractAddress: string;
  id: string;
  chain: Chain;
  name: string;
  description: string;
  icon: string;
  iconUrl: string;
  image: string;
  imageUrl: string;

  /**
   * Legacy NFTs are minted pre ERC-721 (e.g. cryptokitties)
   * and require using `transfer` method instead of one inferred from ABI.
   */
  isLegacy: boolean;

  // Cooperation with AssetData/TokenData model
  token?: void;
  decimals?: void;

  // Cooperation with AssetOption model
  symbol?: void;
};

export type CollectibleTransaction = {
  assetSymbol: string;
  assetAddress: string;
  assetData: Collectible;
  blockNumber: string;
  contractAddress: string;
  createdAt: number;
  from: string;
  gasPrice?: number;
  gasUsed?: number;
  hash?: string;
  batchHash: string;
  icon: string;
  nbConfirmations?: number;
  protocol: string;
  status: string;
  to: string;
  type: string;
  value: number;
  _id: string;
};

export type CollectiblesStore = {
  [accountId: string]: ChainRecord<Collectible[]>;
};

export type CollectiblesHistoryStore = {
  [accountId: string]: ChainRecord<CollectibleTransaction[]>;
};

import { BigNumber } from 'ethers';
import { Collectible, Chain, ChainRecord } from './';

export namespace ASSET_TYPES {
  export const TOKEN = 'TOKENS';
  export const COLLECTIBLE = 'COLLECTIBLES';
}

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

export type AssetData = TokenData | Collectible;

export type TokenData = {
  tokenType?: typeof ASSET_TYPES.TOKEN;
  contractAddress: string;
  decimals: number;
  token: string;
  name?: string;
  icon?: string;
  iconColor?: string;

  // Improve cooperation with Collectible
  id?: void;
  isLegacy?: void;
};

export type Asset = {
  chain: Chain;
  address: string;
  symbol: string;
  name: string;
  iconUrl: string;
  decimals: number;
};

export type AssetByAddress = {
  [address: string]: Asset;
};

export type SyntheticAsset = Asset & {
  availableBalance: number;
  exchangeRate?: number;
};

export type KeyBasedAssetTransfer = {
  transactionHash?: string;
  assetData: AssetData;
  draftAmount?: BigNumber;
  amount?: string;
  calculatedGasLimit?: number;
  gasPrice?: number;
  signedTransaction?: Object;
  status?: string;
};

export type AssetOption = {
  // Core props
  address: string;
  balance?: AssetOptionBalance;
  decimals: number;
  name: string;
  iconUrl: string;
  symbol: string;
  tokenType?: AssetType;
  chain: Chain;
  // Additional props
  assetBalance?: string;
  contractAddress?: string;
  ethAddress?: string;
  formattedBalanceInFiat?: string;
  imageUrl?: string;
  icon?: string;
  id?: string;
  imageSource?: string;
  lastUpdateTime?: string;
  token?: string;
  tokenId?: string;
};

export type AssetOptionBalance = {
  balance?: number;
  balanceInFiat?: number;
  token?: string;
  value?: string;
  syntheticBalance?: string;
};

export type AssetDataNavigationParam = {
  id: string;
  name: string;
  token: string;
  contractAddress: string;
  icon: string;
  iconColor: string;
  imageUrl: string;
  patternIcon: string;
  decimals: number;
  chain: Chain;
};

export type AssetsPerChain = ChainRecord<Asset[]>;

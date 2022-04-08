// types
import { BigNumber } from 'ethers';
import { Chain, AssetType, AssetData, ETH } from './types';

export type Value = BigNumber | string | number;


export type GasToken = {
  address: string;
  decimals: number;
  symbol: string;
};


export type TransactionPayload = {
  gasLimit?: number;
  gasUsed?: number;
  to: string;
  receiverEnsName?: string;
  name?: string;
  contractAddress?: string;
  tokenId?: string;
  tokenType?: AssetType;
  txSpeed?: string;
  gasPrice?: number;
  txFeeInWei?: Value;
  signOnly?: boolean;
  signedHash?: string;
  note?: string;
  gasToken?: GasToken;
  amount: number | string;
  symbol: string | ETH;
  decimals: number;
  data?: string;
  tag?: string;
  extra?: Object;
  usePPN?: boolean;
  useLegacyTransferMethod?: boolean;
  sequentialTransactions?: TransactionPayload[];
  chain?: Chain;
};



export type EthereumTransaction = {
  to: string;
  value: BigNumber;
  data?: string;
};



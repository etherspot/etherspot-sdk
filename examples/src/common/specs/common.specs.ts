// types
import { BigNumber } from 'ethers';
import { LiquidityPool, Chain, AssetType, AssetData, ETH } from './types';

export type Value = BigNumber | string | number;

export type TxSettlementItem = {
  symbol: string;
  value: string | number;
  hash: string;
};

export type TxPoolTogetherExtra = {
  symbol: string;
  decimals: number;
  amount: string;
};

type TxWithdrawalExtra = {
  paymentHash: string;
};

type EnsTransactionExtra = {
  ensName: string;
};

export type SyntheticTransaction = {
  transactionId: string;
  fromAmount: number;
  toAmount: number;
  toAssetCode: string;
  toAddress: string;
  receiverEnsName?: string;
};

export type SyntheticTransactionExtra = {
  syntheticTransaction: Partial<SyntheticTransaction>;
};

export type AaveExtra = {
  symbol: string;
  decimals: number;
  amount: string;
};

export type TxSablierExtra = {
  assetAddress: string;
  amount: string;
  contactAddress: string;
  streamId: string;
};

// export type RariDepositExtra = {
//   symbol: string;
//   decimals: number;
//   amount: number;
//   rariPool: RariPool;
//   rftMinted: string;
// };

// export type RariWithdrawExtra = {
//   symbol: string;
//   decimals: number;
//   amount: number;
//   rariPool: RariPool;
//   rftBurned: string;
// };

// export type RariTransferExtra = {
//   amount: string;
//   rariPool: RariPool;
//   contactAddress: string;
// };

export type RariClaimExtra = {
  amount: string;
  rgtBurned: string;
};

// export type RariExtra = RariDepositExtra | RariWithdrawExtra | RariTransferExtra | RariClaimExtra;

export type LiquidityPoolsExtra = {
  amount: string;
  pool: LiquidityPool;
  tokenAmounts?: string[];
};

export type EtherspotTransactionExtra = {
  batchHash: string;
};

export type AllowanceTransactionExtra = {
  allowance: {
    provider: string;
    fromAssetCode: string;
    toAssetCode: string;
  };
};


export type GasToken = {
  address: string;
  decimals: number;
  symbol: string;
};

export type FeeWithGasToken = {
  feeInWei: BigNumber;
  gasToken: GasToken;
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

export type CollectibleTransactionPayload = {
  to: string;
  contractAddress: string;
  tokenId: string;
  useLegacyTransferMethod: boolean;
  gasLimit?: number;
  gasPrice?: number;
  signOnly?: boolean;
};

// export type TransactionEthers = {
//   from: string;
//   hash?: string;
//   batchHash?: string;
//   to: string;
//   value: string | Object;
//   gasPrice?: Object | number;
//   gasLimit?: Object | number;
//   gasUsed?: Object | number;
//   assetAddress: string;
//   assetSymbol: string;
//   note?: string;
//   status?: string;
//   createdAt?: number;
//   isPPNTransaction?: boolean;
//   tag?: string;
//   extra?: TransactionExtra;
//   stateInPPN?: string;
//   feeWithGasToken?: FeeWithGasToken;
//   type?: string;
// };

export type TransactionFeeInfo = {
  fee: BigNumber;
  gasToken?: GasToken;
  gasPrice?: BigNumber;
};

export type EthereumTransaction = {
  to: string;
  value: BigNumber;
  data?: string;
};

export type TransactionToEstimate = {
  to: string;
  value: Value;
  assetData?: AssetData;
  data?: string;
};

export type TransactionStatus = {
  isSuccess: boolean;
  error: string;
  noRetry?: boolean;
  hash?: string;
  batchHash?: string;
};

export type TransactionResult = {
  hash?: string;
  batchHash?: string;
};

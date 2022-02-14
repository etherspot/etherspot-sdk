// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import { BigNumber } from 'ethers';

// constants

export namespace ERC721_TRANSFER_METHODS {
  export const TRANSFER = 'transfer';
  export const TRANSFER_FROM = 'transferFrom';
  export const SAFE_TRANSFER_FROM = 'safeTransferFrom';
};


export type ERC721_TRANSFER_METHODS = typeof ERC721_TRANSFER_METHODS[keyof typeof ERC721_TRANSFER_METHODS];

// types
import type { RariPool } from './RariPool';
import type { LiquidityPool } from './LiquidityPools';
import type { BigNumber as EthersBigNumber } from '@ethersproject/bignumber/lib/bignumber';
import type { AssetData, AssetType } from './Asset';
import type { Value } from './Value';
import type { Chain } from './Chain';


export type TxSettlementItem = {
  symbol: string,
  value: string | number,
  hash: string,
};

export type TxPoolTogetherExtra = {
  symbol: string,
  decimals: number,
  amount: string,
};

type TxWithdrawalExtra = {
  paymentHash: string,
};

type EnsTransactionExtra = {
  ensName: string,
};

export type SyntheticTransaction = {
  transactionId: string,
  fromAmount: number,
  toAmount: number,
  toAssetCode: string,
  toAddress: string,
  receiverEnsName?: string,
};

export type SyntheticTransactionExtra = {
  syntheticTransaction: Partial<SyntheticTransaction>,
};

export type AaveExtra = {
  symbol: string,
  decimals: number,
  amount: string,
};

export type TxSablierExtra = {
  assetAddress: string,
  amount: string,
  contactAddress: string,
  streamId: string,
};

export type RariDepositExtra = {
  symbol: string,
  decimals: number,
  amount: number,
  rariPool: RariPool,
  rftMinted: string,
};

export type RariWithdrawExtra = {
  symbol: string,
  decimals: number,
  amount: number,
  rariPool: RariPool,
  rftBurned: string,
};

export type RariTransferExtra = {
  amount: string,
  rariPool: RariPool,
  contactAddress: string,
};

export type RariClaimExtra = {
  amount: string,
  rgtBurned: string,
};

export type RariExtra = RariDepositExtra
  | RariWithdrawExtra
  | RariTransferExtra
  | RariClaimExtra;

export type LiquidityPoolsExtra = {
  amount: string,
  pool: LiquidityPool,
  tokenAmounts?: string[],
};

export type EtherspotTransactionExtra = {
  batchHash: string,
};

export type AllowanceTransactionExtra = {
  allowance: {
    provider: string,
    fromAssetCode: string,
    toAssetCode: string,
  },
};

export type TransactionExtra = TxSettlementItem[]
  | TxWithdrawalExtra
  | SyntheticTransactionExtra
  | EnsTransactionExtra
  | AaveExtra
  | TxPoolTogetherExtra
  | TxSablierExtra
  | RariExtra
  | LiquidityPoolsExtra
  | AllowanceTransactionExtra
  | EtherspotTransactionExtra;

export type GasToken = {
  address: string,
  decimals: number,
  symbol: string,
};

export type FeeWithGasToken = {
  feeInWei: BigNumber,
  gasToken: GasToken,
};
export type Transaction = {
  _id: string,
  hash?: string,
  batchHash?: string,
  to: string,
  from: string,
  createdAt: number,
  assetSymbol: string,
  assetAddress: string,
  nbConfirmations?: number,
  gasUsed?: number,
  gasPrice?: number,
  status: string,
  value: string,
  note?: string,
  signOnly?: boolean,
  isPPNTransaction?: boolean,
  tag?: string,
  extra?: TransactionExtra,
  stateInPPN?: string,
  feeWithGasToken?: FeeWithGasToken,
  type?: string,
}

export type TransactionPayload = {
  gasLimit?: number,
  gasUsed?: number,
  to: string,
  receiverEnsName?: string,
  name?: string,
  contractAddress?: string,
  tokenId?: string,
  tokenType?: AssetType,
  txSpeed?: string,
  gasPrice?: number,
  txFeeInWei?: Value,
  signOnly?: boolean,
  signedHash?: string,
  note?: string,
  gasToken?: GasToken,
  amount: number | string,
  symbol: string,
  decimals: number,
  data?: string,
  tag?: string,
  extra?: Object,
  usePPN?: boolean,
  useLegacyTransferMethod?: boolean,
  sequentialTransactions?: TransactionPayload[],
  chain?: Chain,
};

export type Erc721TransferMethod = typeof ERC721_TRANSFER_METHODS;

export type CollectibleTransactionPayload = {
  to: string,
  contractAddress: string,
  tokenId: string,
  useLegacyTransferMethod: boolean,
  gasLimit?: number,
  gasPrice?: number,
  signOnly?: boolean,
};

export type TransactionEthers = {
  from: string,
  hash?: string,
  batchHash?: string,
  to: string,
  value: string | Object,
  gasPrice?: Object | number,
  gasLimit?: Object | number,
  gasUsed?: Object | number,
  assetAddress: string,
  assetSymbol: string,
  note?: string,
  status?: string,
  createdAt?: number,
  isPPNTransaction?: boolean,
  tag?: string,
  extra?: TransactionExtra,
  stateInPPN?: string,
  feeWithGasToken?: FeeWithGasToken,
  type?: string,
};

export type TransactionFeeInfo = {
  fee: BigNumber,
  gasToken?: GasToken,
  gasPrice?: BigNumber,
};

export type EthereumTransaction = {
  to: string,
  value: EthersBigNumber,
  data?: string,
};

export type TransactionToEstimate = {
  to: string,
  value: Value,
  assetData?: AssetData,
  data?: string,
};

export type TransactionStatus = {
  isSuccess: boolean,
  error: string,
  noRetry?: boolean,
  hash?: string,
  batchHash?: string,
};

export type TransactionResult = {
  hash?: string,
  batchHash?: string,
};

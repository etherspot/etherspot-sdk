import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { TransactionDirections, TransactionStatuses } from '../constants';
import { TransactionAsset } from './transaction-asset';
import { TransactionBatch } from './transaction-batch';
import { TransactionLog } from './transaction-log';
import { InternalTransaction } from './internal-transaction';

export class Transaction {
  // transaction
  hash: string;

  nonce: number;

  blockHash: string;

  blockNumber: number;

  timestamp: number;

  from: string;

  to: string;

  @TransformBigNumber()
  value: BigNumber;

  @TransformBigNumber()
  gasPrice: BigNumber;

  gasLimit: number;

  input: string;

  transactionIndex: number;

  gasUsed: number;

  logs: TransactionLog[];

  status: TransactionStatuses;

  @Type(() => TransactionAsset)
  asset: TransactionAsset;

  blockExplorerUrl: string;

  direction: TransactionDirections;

  mainTransactionDataFetched: boolean;

  internalTransactionsFetched: boolean;

  internalTransactions: InternalTransaction[];

  @Type(() => TransactionBatch)
  batch: TransactionBatch;
}

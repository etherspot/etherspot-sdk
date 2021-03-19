import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { TransactionStatuses } from '../constants';
import { TransactionAsset } from './transaction-asset';

export class Transaction {
  // transaction
  hash: string;

  nonce: number;

  blockHash: string;

  blockNumber: number;

  from: string;

  to: string;

  @TransformBigNumber()
  value: BigNumber;

  @TransformBigNumber()
  gasPrice: BigNumber;

  gasLimit: number;

  input: string;

  // transaction receipt

  transactionIndex: number;

  cumulativeGasUsed: number;

  gasUsed: number;

  logs: any[];

  logsBloom: string;

  status: TransactionStatuses;

  // asset

  @Type(() => TransactionAsset)
  asset: TransactionAsset;
}

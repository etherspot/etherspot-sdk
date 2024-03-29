import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { ContractEvent } from '../../contract';
import { GatewayBatchStates } from '../constants';
import { GatewayTransaction } from './gateway-transaction';
import { GatewaySubmittedBatchLog } from './gateway-submitted-batch-log';

export class GatewaySubmittedBatch {
  @Type(() => GatewayTransaction)
  transaction: Partial<GatewayTransaction>;

  hash: string;

  state: GatewayBatchStates;

  account: string;

  nonce: number;

  to: string[];

  data: string[];

  @Type(() => GatewaySubmittedBatchLog)
  logs: GatewaySubmittedBatchLog[];

  events?: ContractEvent[];

  senderSignature: string;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedGasPrice: BigNumber;

  feeToken: string;

  @TransformBigNumber()
  feeAmount: BigNumber;

  feeData: string;

  @Type(() => Date)
  delayedUntil?: Date;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { GatewayBatchStates } from '../constants';
import { GatewayTransaction } from './gateway-transaction';

export class GatewaySubmittedBatch {
  @Type(() => GatewayTransaction)
  transaction: Partial<GatewayTransaction>;

  hash: string;

  state: GatewayBatchStates;

  account: string;

  nonce: number;

  to: string[];

  data: string[];

  senderSignature: string;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedGasPrice: BigNumber;

  refundToken: string;

  @TransformBigNumber()
  refundAmount: BigNumber;

  refundData: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

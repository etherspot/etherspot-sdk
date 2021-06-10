import { TransformBigNumber } from '../../common';
import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';

export class GatewayEstimatedBatch {
  @TransformBigNumber()
  feeAmount: BigNumber;

  feeTokenReceiver: string;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedGasPrice: BigNumber;

  signature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  expiredAt: Date;
}

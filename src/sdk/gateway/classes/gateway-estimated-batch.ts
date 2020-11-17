import { TransformBigNumber, WithTypename } from '../../common';
import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';

export class GatewayEstimatedBatch extends WithTypename {
  @TransformBigNumber()
  refundAmount: BigNumber;

  refundTokenPayee: string;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedGasPrice: BigNumber;

  signature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  expiredAt: Date;
}

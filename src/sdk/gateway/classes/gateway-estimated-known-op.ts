import { TransformBigNumber } from '../../common';
import { BigNumber } from 'ethers';

export class GatewayEstimatedKnownOp {
  @TransformBigNumber()
  refundAmount: BigNumber;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedGasPrice: BigNumber;
}

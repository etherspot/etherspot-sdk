import { TransformBigNumber } from '../../common';
import { BigNumber } from 'ethers';

export class GatewayEstimatedKnownOp {
  @TransformBigNumber()
  feeAmount: BigNumber;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedGasPrice: BigNumber;
}

import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class GatewayGasInfo {
  @TransformBigNumber()
  standard: BigNumber;

  @TransformBigNumber()
  fast: BigNumber;

  @TransformBigNumber()
  instant: BigNumber;
}

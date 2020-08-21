import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class EstimatedRelayedTransaction {
  gasLimit: number;

  @TransformBigNumber()
  gasPrice: BigNumber;

  @TransformBigNumber()
  totalCost: BigNumber;

  refundToken: string;

  @TransformBigNumber()
  refundAmount: BigNumber;
}

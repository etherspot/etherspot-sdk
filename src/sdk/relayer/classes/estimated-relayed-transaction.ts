import { BigNumber } from 'ethers';
import { TransformBigNumber, WithTypename } from '../../common';

export class EstimatedRelayedTransaction extends WithTypename {
  gasLimit: number;

  @TransformBigNumber()
  gasPrice: BigNumber;

  @TransformBigNumber()
  totalCost: BigNumber;

  refundToken: string;

  @TransformBigNumber()
  refundAmount: BigNumber;
}

import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class TransactionBatch {
  from: string;

  to: string[];

  data: string[];

  @TransformBigNumber()
  feeAmount: BigNumber;

  feeToken: string;
}

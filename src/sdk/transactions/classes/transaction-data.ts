import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class TransactionData {
  to: string;

  data: string;

  @TransformBigNumber()
  value: BigNumber;
}

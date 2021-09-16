import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class InternalTransaction {
  from: string;

  to: string;

  @TransformBigNumber()
  value: BigNumber;
}

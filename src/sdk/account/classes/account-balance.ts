import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class AccountBalance {
  token: string;

  @TransformBigNumber()
  balance: BigNumber;

  @TransformBigNumber()
  superBalance: BigNumber;
}

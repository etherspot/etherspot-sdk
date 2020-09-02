import { BigNumber } from 'ethers';
import { TransformBigNumber, WithTypename } from '../../common';

export class AccountBalance extends WithTypename {
  token: string;

  @TransformBigNumber()
  balance: BigNumber;
}

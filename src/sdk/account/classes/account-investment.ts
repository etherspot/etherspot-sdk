import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class AccountInvestment {
  name: string;

  network: string;

  @TransformBigNumber()
  balance: BigNumber;

  position: number;

  logoURI: string;
}

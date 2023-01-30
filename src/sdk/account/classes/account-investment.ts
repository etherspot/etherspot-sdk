import { Type } from 'class-transformer'
import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { AccountInvestmentPositionsInfo } from './account-investment-positions-info';

export class AccountInvestment {
  name: string;

  network: string;

  @TransformBigNumber()
  balance: BigNumber;

  position: number;

  logoURI: string;

  @Type(() => AccountInvestmentPositionsInfo)
  positionsInfo?: [AccountInvestmentPositionsInfo[]]
}

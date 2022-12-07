import { Type } from 'class-transformer';
import { AccountInvestment } from './account-investment';

export class AccountInvestments {
  @Type(() => AccountInvestment)
  items: AccountInvestment[];
}

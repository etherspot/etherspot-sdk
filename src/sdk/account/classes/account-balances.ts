import { Type } from 'class-transformer';
import { AccountBalance } from './account-balance';

export class AccountBalances {
  @Type(() => AccountBalance)
  items: AccountBalance[];
}

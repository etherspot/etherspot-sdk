import { Type } from 'class-transformer';
import { AccountTotalBalancesItem } from './account-total-balances-item';

export class AccountTotalBalances {
  @Type(() => AccountTotalBalancesItem)
  totalBalances: AccountTotalBalancesItem[];
}

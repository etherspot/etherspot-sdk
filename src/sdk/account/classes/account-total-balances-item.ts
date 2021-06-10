import { Type } from 'class-transformer';
import { AccountTotalBalancesMetadata } from './account-total-balances-metadata';

export class AccountTotalBalancesItem {
  chainId: number;

  protocol: string;

  service: string;

  category: string;

  balance: number;

  @Type(() => AccountTotalBalancesMetadata)
  balances: AccountTotalBalancesMetadata[];
}

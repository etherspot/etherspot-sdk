import { Type } from 'class-transformer';
import { AccountDashboardProtocols } from '../constants';
import { AccountTotalBalancesMetadata } from './account-total-balances-metadata';

export class AccountTotalBalancesItem {
  chainId: number;

  protocol: string;

  service: string;

  category: AccountDashboardProtocols;

  balance: number;

  @Type(() => AccountTotalBalancesMetadata)
  balances: AccountTotalBalancesMetadata[];
}

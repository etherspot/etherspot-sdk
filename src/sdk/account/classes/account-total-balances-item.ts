import { Type } from 'class-transformer';
import { AccountDashboardProtocols } from '../constants';
import { AccountTotalBalancesMetadata } from './account-total-balances-metadata';

export class AccountTotalBalancesItem {
  chainId: number;

  protocol: string;

  serviceTitle: string;

  category: AccountDashboardProtocols;

  totalBalance: number;

  @Type(() => AccountTotalBalancesMetadata)
  balances: AccountTotalBalancesMetadata[];
}

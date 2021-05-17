import { Type } from 'class-transformer';
import { AccountDashboardChange } from './account-dashboard-change';
import { AccountDashboardDataPoint } from './account-dashboard-datapoint';

export class AccountDashboard {
  @Type(() => AccountDashboardDataPoint)
  history: AccountDashboardDataPoint[];

  @Type(() => AccountDashboardChange)
  wallet: AccountDashboardChange;
}

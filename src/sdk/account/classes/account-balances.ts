import { Type } from 'class-transformer';
import { WithTypename } from '../../common';
import { AccountBalance } from './account-balance';

export class AccountBalances extends WithTypename {
  @Type(() => AccountBalance)
  items: AccountBalance[];
}

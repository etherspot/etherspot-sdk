import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { AccountMember } from './account-member';

export class AccountMembers extends PaginationResult<AccountMember> {
  @Type(() => AccountMember)
  items: AccountMember[];
}

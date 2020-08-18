import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { Account } from './account';

export class Accounts extends PaginationResult<Account> {
  @Type(() => Account)
  items: Account[];
}

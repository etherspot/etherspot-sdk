import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { AccountProof } from './account-proof';

export class AccountProofs extends PaginationResult<AccountProof> {
  @Type(() => AccountProof)
  items: AccountProof[];
}

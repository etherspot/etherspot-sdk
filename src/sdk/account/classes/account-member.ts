import { plainToClass, Type } from 'class-transformer';
import { Synchronized } from '../../common';
import { Account } from './account';
import { AccountMemberTypes, AccountMemberStates, AccountMemberStores } from '../constants';

export class AccountMember extends Synchronized {
  static fromPlain(plain: Partial<AccountMember>): AccountMember {
    return plainToClass(AccountMember, plain);
  }

  @Type(() => Account)
  account?: Account;

  @Type(() => Account)
  member?: Account;

  type: AccountMemberTypes;

  state: AccountMemberStates;

  store: AccountMemberStores;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

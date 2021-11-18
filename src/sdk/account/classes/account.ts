import { plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { Synchronized } from '../../common';
import { ENSNode } from '../../ens';
import { AccountTypes, AccountStates, AccountStores } from '../constants';
import { AccountSettings } from './account-settings';

export class Account extends Synchronized {
  static fromPlain(plain: Partial<Account>): Account {
    return plainToClass(Account, plain);
  }

  address: string;

  type: AccountTypes;

  state: AccountStates;

  store: AccountStores;

  @Type(() => ENSNode)
  ensNode?: ENSNode;

  @Type(() => AccountSettings)
  settings?: AccountSettings;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

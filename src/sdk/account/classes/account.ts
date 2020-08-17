import { Synchronized } from '../../common';
import { AccountTypes } from '../constants';

export class Account extends Synchronized {
  address: string;

  type: AccountTypes;
}

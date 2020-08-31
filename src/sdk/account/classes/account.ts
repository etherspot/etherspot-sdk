import { plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { Synchronized } from '../../common';
import { ENSNode } from '../../ens';
import { PaymentChannels } from '../../payment';
import { AccountTypes, AccountStates, AccountStores } from '../constants';
import { AccountMember } from './account-member';
import { AccountMembers } from './account-members';
import { AccountProof } from './account-proof';
import { AccountProofs } from './account-proofs';

export class Account extends Synchronized {
  static fromPlain(plain: Partial<Account>): Account {
    return plainToClass(Account, plain);
  }

  address: string;

  type: AccountTypes;

  state: AccountStates;

  store: AccountStores;

  @Type(() => AccountMember)
  member?: AccountMember;

  @Type(() => AccountMembers)
  members?: AccountMembers;

  @Type(() => AccountProof)
  proof?: AccountProof;

  @Type(() => AccountProofs)
  proofs?: AccountProofs;

  @Type(() => ENSNode)
  ensNode?: ENSNode;

  @Type(() => PaymentChannels)
  paymentChannels?: PaymentChannels;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

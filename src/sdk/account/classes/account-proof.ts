import { Type } from 'class-transformer';
import { AccountProofStates } from '../constants';

export class AccountProof {
  hash: string;

  state: AccountProofStates;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

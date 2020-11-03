import { Type } from 'class-transformer';
import { Account, AccountMember } from '../../account';
import { Session } from '../../auth';
import { Batch } from '../../batch';
import { Network } from '../../network';
import { Wallet } from '../../wallet';

export class State {
  wallet: Wallet;

  @Type(() => Account)
  account: Account;

  @Type(() => AccountMember)
  accountMember: AccountMember;

  p2pPaymentDepositAddress: string;

  @Type(() => Session)
  session: Session;

  batch: Batch;

  network: Network;
}

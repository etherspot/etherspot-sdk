import { Type } from 'class-transformer';
import { Account, AccountMember } from '../../account';
import { Session } from '../../auth';
import { GatewayBatch } from '../../gateway';
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

  gatewayBatch: GatewayBatch;

  network: Network;
}

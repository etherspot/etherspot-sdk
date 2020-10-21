import { Account, AccountMember } from '../account/classes';
import { Session } from '../auth/classes';
import { Batch } from '../batch';
import { Network, NetworkNames } from '../network';
import { Wallet } from '../wallet';

export interface State {
  wallet: Wallet;
  account: Account;
  accountMember: AccountMember;
  p2pPaymentDepositAddress: string;
  session: Session;
  batch: Batch;
  network: Network;
}

export interface StateStorage {
  setState(walletAddress: string, networkName: NetworkNames, state: State): Promise<void>;
  getState(walletAddress: string, networkName: NetworkNames): Promise<State>;
}

export interface StateOptions {
  storage?: StateStorage;
}

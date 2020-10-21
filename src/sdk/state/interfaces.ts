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

export type StateStorageState = Omit<State, 'wallet' | 'network'>;

export interface StateStorage {
  setState(walletAddress: string, networkName: NetworkNames, state: StateStorageState): Promise<void>;
  getState(walletAddress: string, networkName: NetworkNames): Promise<StateStorageState>;
}

export interface StateOptions {
  storage?: StateStorage;
}

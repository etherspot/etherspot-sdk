import { NetworkNames } from '../network';
import { State } from './classes';

export type StateStorageState = Omit<State, 'wallet' | 'network' | 'batch'>;

export interface StateStorage {
  setState(walletAddress: string, networkName: NetworkNames, state: StateStorageState): Promise<void>;
  getState(walletAddress: string, networkName: NetworkNames): Promise<StateStorageState>;
}

export interface StateOptions {
  storage?: StateStorage;
}

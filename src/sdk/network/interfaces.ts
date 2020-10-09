import { NetworkNames } from './constants';

export interface Network {
  name: NetworkNames;
  chainId: number;
}

export interface NetworkOptions {
  supportedNetworkNames: NetworkNames[];
}

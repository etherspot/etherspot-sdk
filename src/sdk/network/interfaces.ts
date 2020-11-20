import { NetworkNames } from './constants';

export interface Network {
  name: NetworkNames;
  chainId: number;
}

export interface NetworkOptions {
  supportedNetworkNames: NetworkNames[];
  contracts?: {
    [key: string]: {
      addresses?: { [key: string]: string };
      accountByteCodeHash?: string;
    };
  };
}

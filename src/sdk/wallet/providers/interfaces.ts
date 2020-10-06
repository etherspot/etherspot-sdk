import { NetworkNames } from '../../network';

export interface KeyWalletProviderOptions {
  privateKey: string;
  networkName?: NetworkNames;
}

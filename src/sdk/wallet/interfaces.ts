import { WalletProviderTypes } from './constants';
import { KeyWalletProviderOptions, WalletProvider } from './providers';

export interface Wallet {
  address: string;
  providerType: WalletProviderTypes;
}

export type WalletOptions = string | KeyWalletProviderOptions | WalletProvider;

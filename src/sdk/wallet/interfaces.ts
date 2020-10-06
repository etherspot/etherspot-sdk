import { WalletProviderTypes } from './constants';
import { KeyWalletProviderOptions } from './providers';

export interface Wallet {
  address: string;
  providerType: WalletProviderTypes;
}

export type WalletOptions =
  | WalletProviderTypes.MetaMask
  | WalletProviderTypes.Torus
  | WalletProviderTypes.WalletConnect
  | KeyWalletProviderOptions;

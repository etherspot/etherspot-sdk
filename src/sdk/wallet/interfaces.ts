import { KeyWalletProviderOptions, WalletProviderLike } from './providers';

export interface Wallet {
  address: string;
  providerType: string;
}

export type WalletOptions = string | KeyWalletProviderOptions | WalletProviderLike;

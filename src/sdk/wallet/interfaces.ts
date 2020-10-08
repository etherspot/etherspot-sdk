import { KeyWalletProviderOptions, WalletProviderLike } from '../wallet-providers';

export interface Wallet {
  address: string;
  providerType: string;
}

export type WalletOptions = string | KeyWalletProviderOptions | WalletProviderLike;

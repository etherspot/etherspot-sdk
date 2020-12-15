export interface Wallet {
  address: string;
  providerType: string;
}

export interface WalletOptions {
  omitProviderNetworkCheck: boolean;
}

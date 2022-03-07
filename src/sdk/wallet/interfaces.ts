
import { Wallet as WalletEthers } from 'ethers';
export interface Wallet extends WalletEthers {
  address: string;
  providerType: string;
}

export interface WalletOptions {
  omitProviderNetworkCheck: boolean;
}

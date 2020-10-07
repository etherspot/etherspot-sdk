import { NetworkNames } from '../../network';

export interface WalletProviderLike {
  personalSignMessage(message: any): Promise<string>;

  signMessage(message: any): Promise<string>;

  signTypedData(typedData: any): Promise<string>;
}

export interface KeyWalletProviderOptions {
  privateKey: string;
  networkName?: NetworkNames;
}

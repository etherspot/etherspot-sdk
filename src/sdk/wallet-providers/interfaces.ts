import { NetworkNames } from '../network';

export interface WalletProviderLike {
  type: string;

  personalSignMessage(message: any): Promise<string>;

  signMessage(message: any): Promise<string>;

  signTypedData(typedData: any): Promise<string>;
}

export interface KeyWalletProviderOptions {
  privateKey: string;
  networkName?: NetworkNames;
}

export interface Web3Provider {
  send(payload: any, callback: (err: any, response?: any) => any): any;
}

export interface WalletConnectConnector {
  accounts: string[];
  chainId: number;
  signMessage(params: any[]): Promise<any>;
  signPersonalMessage(params: any[]): Promise<any>;
  signTypedData(params: any[]): Promise<any>;
  on(event: string, callback: (error: Error | null, payload: any | null) => void): void;
}

import { BytesLike, Wallet } from 'ethers';
import type UniversalProvider from '@walletconnect/universal-provider';
import { UniqueSubject } from '../../common';
import { NetworkNames } from '../../network';

export interface WalletProvider {
  readonly type?: string;
  readonly wallet?: Wallet;
  readonly address: string;
  readonly address$?: UniqueSubject<string>;
  readonly networkName?: NetworkNames;
  readonly networkName$?: UniqueSubject<NetworkNames>;

  signMessage(message: BytesLike): Promise<string>;
}

export interface Web3Provider {
  send(payload: any, callback: (err: any, response?: any) => any): any;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
export interface Web3eip1193Provider {
  request(args: RequestArguments): any;
}

export declare class EthereumProvider {
  accounts: string[];
  signer: InstanceType<typeof UniversalProvider>;
  chainId: number;
  request<T = unknown>(args: RequestArguments): Promise<T>;
  sendAsync(args: RequestArguments, callback: (error: Error | null, response: any) => void): void;
  disconnect(): Promise<void>;
  on(event: string, callback: (error: Error | null, payload: any | null) => void): void;
  once(event: string, callback: (error: Error | null, payload: any | null) => void): void;
  removeListener(event: string, callback: (error: Error | null, payload: any | null) => void): void;
  off(event: string, callback: (error: Error | null, payload: any | null) => void): void;
  readonly isWalletConnect?: boolean;
}

export interface WalletConnectConnector {
  accounts: string[];
  chainId: number;
  signPersonalMessage(params: any[]): Promise<any>;
  on(event: string, callback: (error: Error | null, payload: any | null) => void): void;
}

export interface WalletLike {
  privateKey: string;
}

export type WalletProviderLike = string | WalletLike | WalletProvider | EthereumProvider;

// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import { REQUEST_TYPE } from 'constants/walletConnectConstants';

export type WalletConnectConnector = {|
  bridge: string,
  key: string,
  clientId: string,
  peerId: string,
  clientMeta: WalletConnectClientMeta | null,
  peerMeta: WalletConnectClientMeta | null,
  handshakeTopic: string,
  handshakeId: number,
  uri: string,
  chainId: number,
  networkId: number,
  accounts: string[],
  rpcUrl: string,
  connected: boolean,
  pending: boolean,
  session: WalletConnectSession,
  _transport: { close: () => void },
  on(event: string, callback: (error: Error | null, payload: ?any) => void): void,
  connect(options?: WalletConnectCreateSessionOptions): Promise<WalletConnectSessionStatus>,
  createSession(options?: WalletConnectCreateSessionOptions): Promise<void>,
  approveSession(sessionStatus: WalletConnectSessionStatus): void,
  rejectSession(sessionError?: WalletConnectSessionError): void,
  updateSession(sessionStatus: WalletConnectSessionStatus): void,
  killSession(sessionError?: WalletConnectSessionError): Promise<void>,
  sendTransaction(tx: WalletConnectTransactionData): Promise<any>,
  signTransaction(tx: WalletConnectTransactionData): Promise<any>,
  signMessage(params: any[]): Promise<any>,
  signPersonalMessage(params: any[]): Promise<any>,
  signTypedData(params: any[]): Promise<any>,
  updateChain(chainParams: WalletConnectUpdateChain): Promise<any>,
  approveRequest(response: WalletConnectRequestApprove): void,
  rejectRequest(response: WalletConnectRequestReject): void,
|};

export type WalletConnectClientMeta = {|
  description: string;
  url: string;
  icons: string[];
  name: string;
|};

export type WalletConnectSession = {|
  connected: boolean;
  accounts: string[];
  chainId: number;
  bridge: string;
  key: string;
  clientId: string;
  clientMeta: WalletConnectClientMeta | null;
  peerId: string;
  peerMeta: WalletConnectClientMeta | null;
  handshakeId: number;
  handshakeTopic: string;
|};

type WalletConnectCreateSessionOptions = {|
  chainId?: number,
|};

export type WalletConnectSessionStatus = {|
  chainId: number,
  accounts: string[],
  networkId?: number,
  rpcUrl?: string,
|};

type WalletConnectSessionError = {|
  message?: string,
|};

type WalletConnectSessionStorage = {|
  getSession: () => WalletConnectSession | null,
  setSession: (session: WalletConnectSession) => WalletConnectSession,
  removeSession: () => void;
|}

export type WalletConnectOptions = {|
  bridge?: string,
  uri?: string,
  session?: WalletConnectSession,
  storage?: WalletConnectSessionStorage;
  clientMeta?: WalletConnectClientMeta,
  qrcodeModal?: {
    open(uri: string, callback: any, options?: any): void,
    close(): void,
  },
  qrcodeModalOptions?: { mobileLinks?: string[] },
|};

type WalletConnectUpdateChain = {|
  chainId: number,
  networkId: number,
  rpcUrl: string,
  nativeCurrency: {
    name: string,
    symbol: string,
  },
|};

export type WalletConnectCallRequest = {|
  peerId: string,
  chainId: number,
  callId: number,
  method: string,
  icon: ?string,
  name: string,
  url: string,
  params: any[],
|};

type WalletConnectTransactionData = {|
  to?: string,
  value?: number | string,
  gas?: number | string,
  gasLimit?: number | string,
  gasPrice?: number | string,
  nonce?: number | string,
  from: string,
|};

type WalletConnectRequestApprove = {|
  id: number,
  result: any,
|};

type WalletConnectRequestReject = {|
  id: number,
  error?: Error,
|};

export type WalletConnectCallRequestType = $Values<typeof REQUEST_TYPE>;

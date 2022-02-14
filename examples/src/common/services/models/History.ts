// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2021 Stiftung Pillar Project

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

// types
import  { FiatValue, TokenValue } from './Value';
import  { Transaction } from './Transaction';
import  { ChainRecord } from './Chain';

/**
 * Enum of all supported event types.
 */
export namespace EVENT_TYPE {
  export const TOKEN_RECEIVED = "tokenReceived"; 
  export const TOKEN_SENT = "tokenSent";  
  export const COLLECTIBLE_RECEIVED = "collectibleReceived";  
  export const COLLECTIBLE_SENT = "collectibleSent"; 
  export const TOKEN_EXCHANGE = "tokenExchange";  
  export const EXCHANGE_FROM_FIAT = "exchangeFromFiat";  
  export const WALLET_CREATED = "walletCreated";  
  export const WALLET_BACKED_UP = "walletBackedUp"; 
  export const WALLET_ACTIVATED = "walletActivated";  
  export const ENS_NAME_REGISTERED = "ensNameRegistered"; 
  export const PPN_INITIALIZED = "ppnInitialized";  
};

export type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

/**
 * Transaction status for events that relate to transactions.
 */
export namespace TRANSACTION_STATUS {
  export const CONFIRMED = "confirmed"; 
  export const FAILED = "failed";  
  export const PENDING = "pending";  
  export const TIMEDOUT = "timedout";  
};


export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

/**
 * Union type describing all supported event types.
 */
export type Event =
  | TokenTransactionEvent
  | CollectibleTransactionEvent
  | TokenExchangeEvent
  | ExchangeFromFiatEvent
  | WalletEvent
  | EnsNameRegisteredEvent;

/**
 * Common fields in all events.
 */
type EventCommon = {
  date: Date,
  id: string,
};

export type TokenTransactionEvent = TokenReceivedEvent | TokenSentEvent;

export type TokenReceivedEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.TOKEN_RECEIVED,
  hash: string,
  fromAddress: string,
  toAddress: string,
  value: TokenValue,
  status: TransactionStatus,
};

export type TokenSentEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.TOKEN_SENT,
  hash: string,
  batchHash?: string,
  fromAddress: string,
  toAddress: string,
  value: TokenValue,
  fee: TokenValue,
  status: TransactionStatus,
};


export type CollectibleTransactionEvent = CollectibleReceivedEvent | CollectibleSentEvent;

export type CollectibleReceivedEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.COLLECTIBLE_RECEIVED,
  hash: string,
  fromAddress: string,
  toAddress: string,
  title: string,
  imageUrl: string,
  status: TransactionStatus,
};

export type CollectibleSentEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.COLLECTIBLE_SENT,
  hash: string,
  batchHash?: string,
  fromAddress: string,
  toAddress: string,
  title: string,
  imageUrl: string,
  fee: TokenValue,
  status: TransactionStatus,
};

export type TokenExchangeEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.TOKEN_EXCHANGE,
  hash: string,
  batchHash?: string,
  fromAddress: string,
  toAddress: string,
  fromValue: TokenValue,
  toValue: TokenValue,
  fee: TokenValue,
  status: TransactionStatus,
};

export type ExchangeFromFiatEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.EXCHANGE_FROM_FIAT,
  hash: string,
  batchHash?: string,
  fromAddress: string,
  toAddress: string,
  fromValue: FiatValue,
  toValue: TokenValue,
  fee: TokenValue,
  status: TransactionStatus,
};

export type WalletEvent = WalletCreated | WalletActivated | WalletBackedUp;

export type WalletCreated = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.WALLET_CREATED,
};

export type WalletActivated = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.WALLET_ACTIVATED,
  hash: string,
  fee: TokenValue,
  status: TransactionStatus,
};

export type WalletBackedUp = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.WALLET_BACKED_UP,
};

export type EnsNameRegisteredEvent = {
  date: Date,
  id: string,
  type: typeof EVENT_TYPE.ENS_NAME_REGISTERED,
  ensName: string,
  hash: string,
  fee: TokenValue,
};

export type TransactionsStore = {
  [accountId: string]: ChainRecord<Transaction[]>,
};

export type HistoryLastSyncIds = {
  [accountId: string]: string,
};

export type AccountWalletEvents = { [accountId: string]: ChainRecord<WalletEvent[]> };

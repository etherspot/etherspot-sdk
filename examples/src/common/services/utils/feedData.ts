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

import { BigNumber } from 'ethers';
import {orderBy} from 'lodash';
import {get} from 'lodash';

import type { Account } from '../models/Account';
import type { Transaction } from '../models/Transaction';

import { TX_FAILED_STATUS, TX_PENDING_STATUS, TX_TIMEDOUT_STATUS, TRANSACTION_EVENT } from '../constants/historyConstants';
import { PAYMENT_NETWORK_ACCOUNT_TOPUP } from '../constants/paymentNetworkConstants';
import { COLLECTIBLE_TRANSACTION } from '../constants/collectiblesConstants';

import {
  findAccountByAddress,
  isSmartWalletAccount,
  getInactiveUserAccounts,
  getAccountAddress,
  getAccountTypeByAddress,
  isArchanovaAccount,
} from './accounts';
import { addressesEqual } from './assets';


export function mapTransactionsHistory(
  history: Object[],
  accounts: Account[],
  eventType: string,
  keepHashDuplicatesIfBetweenAccounts?: boolean,
  duplicatePPN?: boolean,
) {
  const concatedHistory = history
    .map(({ type, ...rest }:any) => {
      if (eventType === TRANSACTION_EVENT) {
        return { ...rest, transactionType: type };
      }
      return rest;
    })
    .map(({ ...rest }) => ({ ...rest, type: eventType }))
    .map(({ to, from, ...rest }) => {
      // apply to wallet accounts only if received from other account address
      const account = eventType !== COLLECTIBLE_TRANSACTION
        && (findAccountByAddress(from, getInactiveUserAccounts(accounts))
          || findAccountByAddress(to, getInactiveUserAccounts(accounts))
        );

      const accountType = account ? account.type : null;

      return {
        to,
        from,
        accountType,
        ...rest,
      };
    });

  if (!keepHashDuplicatesIfBetweenAccounts) return orderBy(concatedHistory, ['createdAt'], ['desc']);

  const accountsAddresses = accounts.map((acc) => getAccountAddress(acc));
  const ascendingHistory = orderBy(concatedHistory, ['createdAt'], ['asc']);

  const historyWithTrxBetweenAcc = ascendingHistory.reduce((alteredHistory, historyItem) => {
    const { from: fromAddress, to: toAddress, hash } = historyItem;
    const isTransactionFromUsersAccount = accountsAddresses
      .some((userAddress) => addressesEqual(fromAddress, userAddress));
    const isTransactionToUsersAccount = accountsAddresses
      .some((userAddress) => addressesEqual(toAddress, userAddress));
    const eventWithSameHashExists = alteredHistory.some((item) => item.hash === hash);

    if (eventWithSameHashExists) {
      if (isTransactionFromUsersAccount && isTransactionToUsersAccount) {
        return [...alteredHistory, {
          ...historyItem,
          accountType: getAccountTypeByAddress(toAddress, accounts),
          isReceived: true,
          betweenAccTrxDuplicate: true,
          _id: `${historyItem._id}_duplicate`,
          createdAt: historyItem.createdAt + 1,
        }];
      }
      return alteredHistory;
    } else if (duplicatePPN) {
      const itemTag = get(historyItem, 'tag');
      if (itemTag && itemTag === PAYMENT_NETWORK_ACCOUNT_TOPUP) {
        const duplicate = {
          ...historyItem,
          smartWalletEvent: true,
          _id: `${historyItem._id}_duplicate`,
          createdAt: historyItem.createdAt - 1,
        };
        return [...alteredHistory, duplicate, historyItem];
      }
      return [...alteredHistory, historyItem];
    }
    return [...alteredHistory, historyItem];
  }, []);

  return orderBy(historyWithTrxBetweenAcc, ['createdAt'], ['desc']);
}

export type TransactionsGroup = {
  transactions: Transaction[],
  symbol: string,
  value: BigNumber,
};

export function groupPPNTransactions(ppnTransactions: Object[]): TransactionsGroup[] {
  const transactionsByAsset: {[key:string]: TransactionsGroup} = {};
  if (!ppnTransactions.length) return [];

  ppnTransactions.forEach((trx) => {
    const { symbol: _symbol, assetSymbol, value: rawValue } = <any>trx;
    const symbol = _symbol || assetSymbol;


    const value =  BigNumber.from(rawValue);
    if (!transactionsByAsset[symbol]) {
      transactionsByAsset[symbol] = <any>{ transactions: [trx], value, symbol };
    } else {
      transactionsByAsset[symbol].transactions.push(<Transaction>trx);
      const currentValue = transactionsByAsset[symbol].value;
      transactionsByAsset[symbol].value = currentValue.add(value);
    }
  });

  return (Object.values(transactionsByAsset));
}

export const isPendingTransaction = ({ status }: any) => {
  return status === TX_PENDING_STATUS;
};

export const isFailedTransaction = ({ status }: any) => {
  return status === TX_FAILED_STATUS;
};

export const isTimedOutTransaction = ({ status }: any) => {
  return status === TX_TIMEDOUT_STATUS;
};

export const isArchanovaAccountAddress = (address: string, accounts: Account[]) => {
  const account = findAccountByAddress(address, accounts);
  return !!account && isArchanovaAccount(account);
};

export const isSmartWalletAccountAddress = (address: string, accounts: Account[]) => {
  const account = findAccountByAddress(address, accounts);
  return !!account && isSmartWalletAccount(account);
};

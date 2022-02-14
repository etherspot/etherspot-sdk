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
import { isEmpty, mapValues, orderBy } from 'lodash';

// constants
import {
  TRANSACTION_CONFIRMATION_EVENT,
  TRANSACTION_CONFIRMATION_SENDER_EVENT,
  TRANSACTION_PENDING_EVENT,
  TX_PENDING_STATUS,
  TRANSACTION_EVENT,
} from '../constants/historyConstants';
import { PAYMENT_NETWORK_TX_SETTLEMENT, PAYMENT_NETWORK_ACCOUNT_DEPLOYMENT } from '../constants/paymentNetworkConstants';
import { EVENT_TYPE, TRANSACTION_STATUS } from '../models/History';
import { ETHERSPOT_WALLET_DEPLOYMENT_GAS_AMOUNT } from '../constants/etherspotConstants';

// types
import type {
  FeeWithGasToken,
  GasToken,
  Transaction,
  TransactionEthers,
} from '../models/Transaction';
import type { Account } from '../models/Account';
import type { Value, TokenValue } from '../models/Value';
import type { Event, TransactionsStore } from '../models/History';
import type { Asset } from '../models/Asset';
import type { Chain, ChainRecord } from '../models/Chain';
import type { CollectibleTransaction, CollectiblesHistoryStore } from '../models/Collectible';

// utils
import { mapTransactionsHistory } from '../utils/feedData';
import { formatUnits, isCaseInsensitiveMatch } from '../utils/common';
import { wrapBigNumber } from '../utils/bigNumber';
import { addressesEqual, findAssetByAddress } from '../utils/assets';
import { nativeAssetPerChain } from '../utils/chains';

export const buildHistoryTransaction = ({
  from,
  hash,
  batchHash,
  to,
  value,
  gasPrice,
  gasUsed,
  assetSymbol,
  assetAddress,
  note,
  status,
  createdAt,
  isPPNTransaction,
  tag,
  extra,
  stateInPPN,
  feeWithGasToken,
  type,
}: TransactionEthers): Transaction => ({
  status: status || TX_PENDING_STATUS,
  gasUsed: gasUsed ? Number(gasUsed) : 0,
  gasPrice: gasPrice ? Number(gasPrice) : 0,
  value: typeof value === 'object' ? value.toString() : value,
  from,
  hash,
  batchHash,
  to,
  // $FlowFixMe: either will be present for _id
  _id: hash || batchHash,
  assetSymbol,
  assetAddress,
  createdAt: createdAt || Math.round(+new Date() / 1000), // seconds
  nbConfirmations: 0,
  note,
  isPPNTransaction: !!isPPNTransaction,
  tag,
  extra,
  stateInPPN,
  feeWithGasToken,
  type,
});

export const isTransactionEvent = (eventType: string) => {
  return [
    TRANSACTION_PENDING_EVENT,
    TRANSACTION_CONFIRMATION_EVENT,
    TRANSACTION_CONFIRMATION_SENDER_EVENT,
  ].includes(eventType);
};

export const updateAccountHistoryForChain = (
  history: TransactionsStore,
  accountId: string,
  chain: string,
  transactions: Transaction[],
): TransactionsStore => ({
  ...history,
  [accountId]: {
    ...(history[accountId] ?? {}),
    [chain]: transactions,
  },
});

type UpdateHistoryRecordResult = {
  updatedHistory: TransactionsStore,
  txUpdated: Transaction,
};

export function updateHistoryRecord(
  allHistory: TransactionsStore,
  hashToUpdate: string,
  modifier: Function,
): UpdateHistoryRecordResult {
  hashToUpdate = hashToUpdate.toLowerCase();

  let txUpdated = null;
  const accounts = Object.keys(allHistory);
  const updatedHistory = accounts.reduce((history, accountId) => {
    const accountHistory = mapValues(
      allHistory[accountId],
      (transactions = [], chain) => transactions.map((transaction) => {
        if (!isCaseInsensitiveMatch(transaction.hash, hashToUpdate)) {
          return transaction;
        }

        txUpdated = modifier(transaction, chain);

        return txUpdated;
      }),
    );

    return { ...history, [accountId]: accountHistory };
  }, {});

  return {
    updatedHistory,
    txUpdated,
  };
}

export const parseFeeWithGasToken = (
  gasToken: GasToken,
  fee: Value,
): FeeWithGasToken | null => {
  if (!gasToken || isEmpty(gasToken) || !fee) return null;
  return { feeInWei: wrapBigNumber(fee), gasToken };
};

// export const findTransactionAcrossAccounts = (
//   history: TransactionsStore,
//   hash: ?string,
//   batchHash: ?string,
// ): ?Transaction => {
//   if (!hash && !batchHash) return {};

//   return Object.keys(history)
//     .flatMap((accountId) => getCrossChainAccountHistory(history[accountId]))
//     .find((transaction) => isCaseInsensitiveMatch(hash ?? '', transaction?.hash)
//       || isCaseInsensitiveMatch(batchHash ?? '', transaction?.batchHash));
// };

// export const findCollectibleTransactionAcrossAccounts = (
//   history: CollectiblesHistoryStore,
//   hash: string,
//   batchHash: string,
// ): CollectibleTransaction => {
//   if (!hash && !batchHash) return {};

//   return Object.keys(history)
//     .flatMap((accountId) => getCrossChainAccountCollectiblesHistory(history[accountId]))
//     .find((transaction) => isCaseInsensitiveMatch(hash ?? '', transaction?.hash)
//       || isCaseInsensitiveMatch(batchHash ?? '', transaction?.batchHash));
// };

export const getTokenTransactionsFromHistory = (
  history: Transaction[],
  accounts: Account[],
  tokenAddress: string,
): Transaction[] => {
  const mappedTransactions = mapTransactionsHistory(history, accounts, TRANSACTION_EVENT);
  return mappedTransactions.filter(
    ({ assetAddress, tag = '', extra = [] }) =>
      (addressesEqual(assetAddress, tokenAddress) && tag !== PAYMENT_NETWORK_ACCOUNT_DEPLOYMENT) ||
      (tag === PAYMENT_NETWORK_TX_SETTLEMENT && extra.find(({ address }) => addressesEqual(address, tokenAddress))),
  );
};

export const parseHistoryEventFee = (
  chain: Chain,
  feeWithGasToken: FeeWithGasToken,
  gasUsed: number,
  gasPrice: number,
): TokenValue => {
  if (feeWithGasToken?.feeInWei) {
    const {
      feeInWei,
      gasToken: { decimals, symbol, address },
    } = feeWithGasToken;
    return {
      value: wrapBigNumber(formatUnits(feeInWei, decimals)),
      address,
      symbol,
    };
  }

  if (gasUsed && gasPrice) {
    const feeValue = wrapBigNumber(gasUsed).mul(gasPrice);
    const { decimals, address, symbol } = nativeAssetPerChain[chain];
    return {
      value: wrapBigNumber(formatUnits(feeValue, decimals)),
      address,
      symbol,
    };
  }

  return null;
};

export const getHistoryEventsFromTransactions = (
  transactions: Transaction[],
  chain: Chain,
  activeAccountAddress: string,
  supportedAssets: Asset[],
): Event[] => {
  let successfulOrPendingDeploymentEventAdded = false;

  return orderBy(transactions, ['createdAt'], ['asc']).reduce((
    historyEvents,
    {
      _id,
      hash,
      batchHash,
      value: rawValue,
      assetAddress,
      createdAt,
      from: fromAddress,
      to: toAddress,
      extra,
      gasUsed,
      gasPrice,
      feeWithGasToken,
      status,
    },
  ) => {
    const fee = parseHistoryEventFee(chain, feeWithGasToken, gasUsed, gasPrice);
    const asset = findAssetByAddress(supportedAssets, assetAddress);

    const { decimals: nativeAssetDecimals, symbol: nativeAssetSymbol } = nativeAssetPerChain[chain];
    const { decimals = nativeAssetDecimals, symbol = nativeAssetSymbol } = asset ?? {};

    const value = {
      value: wrapBigNumber(formatUnits(rawValue, decimals)),
      address: assetAddress,
      symbol,
    };

    let historyEvent = <any>{
      id: _id,
      value,
      date: new Date(+createdAt * 1000),
      fromAddress,
      toAddress,
      status,
      batchHash,
      hash,
      fee
    };

    let eventType = addressesEqual(fromAddress, activeAccountAddress)
      ? EVENT_TYPE.TOKEN_SENT
      : EVENT_TYPE.TOKEN_RECEIVED;

    if (extra["ensName"]) {
      eventType = EVENT_TYPE.ENS_NAME_REGISTERED;
      historyEvent = { ...historyEvent, ensName: extra["ensName"] };
    }

    historyEvent = { ...historyEvent, type: eventType };

    if (!successfulOrPendingDeploymentEventAdded && addressesEqual(fromAddress, activeAccountAddress)) {
      const deploymentFee = gasPrice && addressesEqual(fee?.address, nativeAssetPerChain.ethereum.address)
        ? wrapBigNumber(gasPrice).mul(ETHERSPOT_WALLET_DEPLOYMENT_GAS_AMOUNT)
        : null;

      const deploymentHistoryEvent = {
        ...historyEvent,
        date: new Date((+createdAt - 1) * 1000), // -1 to make it earlier than followed transaction
        id: `${historyEvent.id}-deployment`,
        type: EVENT_TYPE.WALLET_ACTIVATED,
        fee: deploymentFee,
      };

      successfulOrPendingDeploymentEventAdded = [
        TRANSACTION_STATUS.CONFIRMED,
        TRANSACTION_STATUS.PENDING,
      ].includes(historyEvent.status);

      // $FlowFixMe: TODO: fix return for different event types
      return [...historyEvents, historyEvent, deploymentHistoryEvent];
    }

    // $FlowFixMe: TODO: fix return for different event types
    return [...historyEvents, historyEvent];
  }, []);
};

export const getHistoryEventsFromCollectiblesTransactions = (
  transactions: CollectibleTransaction[],
  chain: Chain,
  activeAccountAddress: string,
): Event[] => transactions.map(({
  _id,
  hash,
  batchHash,
  createdAt,
  from: fromAddress,
  to: toAddress,
  gasUsed,
  gasPrice,
  status,
  assetData,
}) => {
  const fee = parseHistoryEventFee(chain, null, gasUsed, gasPrice);

  const { name: title, image: imageUrl } = assetData;

  const historyEvent = {
    id: _id,
    date: new Date(+createdAt * 1000),
    fromAddress,
    toAddress,
    status,
    batchHash,
    hash,
    imageUrl,
    title,
    fee,
  };

  const eventType = addressesEqual(fromAddress, activeAccountAddress)
    ? EVENT_TYPE.COLLECTIBLE_SENT
    : EVENT_TYPE.COLLECTIBLE_RECEIVED;

  // $FlowFixMe: TODO: fix return for different event types
  return { ...historyEvent, type: eventType };
});

// could be just Object.values(accountHistory).flat(), but flow fails
export const getCrossChainAccountHistory = (
  accountHistory: ChainRecord<Transaction[]>,
): Transaction[] => Object.keys(accountHistory ?? {}).flatMap((chain) => accountHistory?.[chain] ?? []);

export const getCrossChainAccountCollectiblesHistory = (
  accountHistory: ChainRecord<CollectibleTransaction[]>,
): CollectibleTransaction[] => Object.keys(accountHistory ?? {}).flatMap((chain) => accountHistory?.[chain] ?? []);

export const transactionStoreHasOldStructure = (
  transactionStore: TransactionsStore | CollectiblesHistoryStore,
) => Object.values(transactionStore).some((history) => history && Array.isArray(history));

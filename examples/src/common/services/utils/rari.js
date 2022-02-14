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
/* eslint-disable no-continue, no-await-in-loop */
import { keccak256 } from 'js-sha3';
import { ZERO_ADDRESS } from '@netgum/utils';
import { callSubgraph } from 'services/theGraph';
import { getEnv, getRariPoolsEnv } from 'configs/envConfig';
import {
  RARI_DEPOSIT_TRANSACTION,
  RARI_WITHDRAW_TRANSACTION,
  RARI_CLAIM_TRANSACTION,
  RARI_TRANSFER_TRANSACTION,
  RARI_POOLS_ARRAY,
} from 'constants/rariConstants';
import { addressesEqual } from 'utils/assets';
import type { Asset } from 'models/Asset';
import type { RariPool } from 'models/RariPool';
import type { Transaction } from 'models/Transaction';

const buildRariTransaction = (accountAddress, transaction, rariTransactions, hashes, supportedAssets): Transaction => {
  if (!transaction.hash) return transaction;

  const { transfersOut = [], transfersIn = [], deposits = [], withdrawals = [], claims = [] } = rariTransactions;

  const txHash = transaction.hash.toLowerCase();

  const findRariPool = ({ tokenAddress }): ?RariPool =>
    RARI_POOLS_ARRAY.find((pool) => addressesEqual(getRariPoolsEnv(pool).RARI_FUND_TOKEN_ADDRESS, tokenAddress));

  let rariTransaction = deposits.find(({ id }) => id === txHash) || withdrawals.find(({ id }) => id === txHash);

  if (rariTransaction) {
    const currencyCode = hashes.find(({ hash }) => hash === rariTransaction?.currencyCode);
    return {
      ...transaction,
      tag: rariTransaction.rftMinted ? RARI_DEPOSIT_TRANSACTION : RARI_WITHDRAW_TRANSACTION,
      extra: {
        symbol: currencyCode?.symbol || '',
        decimals: supportedAssets.find(({ symbol }) => symbol === currencyCode?.symbol)?.decimals || 18,
        amount: rariTransaction.amount,
        rariPool: findRariPool(rariTransaction),
        rftMinted: rariTransaction.rftMinted || rariTransaction.rftBurned,
      },
    };
  }

  rariTransaction = transfersIn
    .concat(transfersOut)
    .find(({ id, from, to }) => id === txHash && from !== ZERO_ADDRESS && to !== ZERO_ADDRESS);

  if (rariTransaction) {
    const { to, from, amount } = rariTransaction;
    return {
      ...transaction,
      tag: RARI_TRANSFER_TRANSACTION,
      extra: {
        contactAddress: addressesEqual(from, accountAddress) ? to : from,
        amount,
        rariPool: findRariPool(rariTransaction),
      },
    };
  }
  rariTransaction = claims.find(({ id }) => id === txHash);
  if (rariTransaction) {
    const { claimed, burned } = rariTransaction;
    return {
      ...transaction,
      tag: RARI_CLAIM_TRANSACTION,
      extra: {
        amount: claimed,
        rgtBurned: burned,
      },
    };
  }

  return transaction;
};

export const mapTransactionsHistoryWithRari = async (
  accountAddress: string,
  transactionHistory: Transaction[],
  supportedAssets: Asset[],
): Promise<Transaction[]> => {
  /* eslint-disable i18next/no-literal-string */
  const query = `{
    transfersOut: transfers(where: {
      from: "${accountAddress}",
    }) {
      id
      amount
      tokenAddress
      from
      to
    }
    transfersIn: transfers(where: {
      to: "${accountAddress}", 
    }) {
      id
      amount
      tokenAddress
      from
      to
    }
    deposits(where: {
      payee: "${accountAddress}",
    }) {
      id
      amount
      rftMinted
      tokenAddress
      currencyCode
    }
    withdrawals(where: {
      payee: "${accountAddress}",
    }) {
      id
      amount
      rftBurned
      tokenAddress
      currencyCode
    }
    claims(where: {
      holder: "${accountAddress}",
    }) {
      id
      claimed
      burned
    }
  }
  `;
  /* eslint-enable i18next/no-literal-string */
  const response = (await callSubgraph(getEnv().RARI_SUBGRAPH_NAME, query)) || {};

  // currencyToken gotcha: currencyToken has an indexed string type in Rari abi
  // eslint-disable-next-line max-len
  // that means according to solidity docs (https://docs.soliditylang.org/en/develop/abi-spec.html#encoding-of-indexed-event-parameters)
  // "Indexed event parameters that are not value types, i.e. arrays and structs
  // are not stored directly but instead a keccak256-hash of an encoding is stored."
  // That applies also to indexed strings, so we have just a hash of a string :(
  // But hey, we know it's a hash of a currency code and we have all supported currency codes
  // So we calculate the hash out of every currency code and compare by hash
  const hashes = supportedAssets.map(({ symbol }) => ({
    hash: `0x${keccak256(symbol)}`, // eslint-disable-line i18next/no-literal-string
    symbol, // eslint-disable-line i18next/no-literal-string
  }));

  const rariContracts = RARI_POOLS_ARRAY.reduce((contracts, pool) => {
    return [...contracts, ...(Object.values(getRariPoolsEnv(pool)): any)];
  }, []);
  rariContracts.push(getEnv().RARI_RGT_DISTRIBUTOR_CONTRACT_ADDRESS);

  const mappedHistory = transactionHistory.reduce((transactions, transaction, transactionIndex) => {
    const { to } = transaction;
    if (rariContracts.find((contract) => addressesEqual(contract, to))) {
      transactions[transactionIndex] = buildRariTransaction(
        accountAddress,
        transaction,
        response,
        hashes,
        supportedAssets,
      );
    }
    return transactions;
  }, transactionHistory);
  return mappedHistory;
};

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

import { BigNumber } from 'bignumber.js';
import { pickBy } from 'lodash';

// Utils
import { addressesEqual } from 'utils/assets';
import { mapChainRecordValues } from 'utils/chains';
import { valueForAddress } from 'utils/common';

// Configs
import { getPlrAddressForChain } from 'configs/assetsConfig';

// Types
import type {
  AccountAssetBalances,
  WalletAssetBalance,
  WalletAssetsBalances,
  ServiceAssetBalance,
  CategoryAssetsBalances,
} from 'models/Balances';
import type { ChainRecord, Chain } from 'models/Chain';


export const getChainWalletAssetsBalances = (
  assetsBalances: ?AccountAssetBalances,
): ChainRecord<WalletAssetsBalances> =>
  mapChainRecordValues(assetsBalances ?? {}, (categoryBalances) =>
    filterNonZeroAssetBalances(categoryBalances?.wallet ?? {}),
  );

export const getChainDepositAssetsBalances = (
  assetsBalances: ?AccountAssetBalances,
): ChainRecord<ServiceAssetBalance[]> =>
  mapChainRecordValues(assetsBalances ?? {}, (categoryBalances) => categoryBalances?.deposits ?? []);

export const getChainLiquidityPoolAssetsBalances = (
  assetsBalances: ?AccountAssetBalances,
): ChainRecord<ServiceAssetBalance[]> =>
  mapChainRecordValues(assetsBalances ?? {}, (categoryBalances) => categoryBalances?.liquidityPools ?? []);

export const getChainInvestmentAssetsBalances = (
  assetsBalances: ?AccountAssetBalances,
): ChainRecord<ServiceAssetBalance[]> =>
  mapChainRecordValues(assetsBalances ?? {}, (categoryBalances) => categoryBalances?.investments ?? []);

export const filterNonZeroAssetBalances = (balances: WalletAssetsBalances): WalletAssetsBalances => {
  return pickBy(balances, ({ balance }: WalletAssetBalance) => !!balance && !BigNumber(balance).isZero());
};

export const findServiceAssetBalance = (
  balances: ?(ServiceAssetBalance[]),
  addressToFind: string,
): ServiceAssetBalance | void => {
  return balances?.find((asset) => addressesEqual(asset.address, addressToFind));
};

// Check if user has service asset balances for given asset address.
export const hasServiceAssetBalanceForAddress = (
  assetBalances: CategoryAssetsBalances,
  assetAddress: string,
): boolean => !!(
  findServiceAssetBalance(assetBalances.deposits, assetAddress)
    ?? findServiceAssetBalance(assetBalances.investments, assetAddress)
    ?? findServiceAssetBalance(assetBalances.liquidityPools, assetAddress)
);

export const getWalletBalanceForAsset = (balances: ?WalletAssetsBalances, assetAddress: ?string): BigNumber => {
  if (!balances || !assetAddress) return BigNumber(0);

  const balance = valueForAddress(balances, assetAddress)?.balance;
  return BigNumber(balance ?? 0);
};

export const getWalletPlrBalance = (balances: ?AccountAssetBalances, chains: ?Chain[]): Array<BigNumber> => {
  if (!balances || !chains) return [];
  const plrBalance = chains.map(chain => {
    const walletBalances = balances[chain]?.wallet;
    return getWalletBalanceForAsset(walletBalances, getPlrAddressForChain(chain));
  });
  return plrBalance;
};

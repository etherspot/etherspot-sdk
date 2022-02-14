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

import { BigNumber } from 'ethers';

// types
import type { ChainRecord } from './Chain';

export type AssetBalancesPerAccount = {
  [accountId: string]: AccountAssetBalances,
};

export type AccountAssetBalances = ChainRecord<CategoryAssetsBalances>;

export type CategoryAssetsBalances = {
  wallet?: WalletAssetsBalances,
  deposits?: ServiceAssetBalance[],
  investments?: ServiceAssetBalance[],
  liquidityPools?: ServiceAssetBalance[],
  rewards?: ServiceAssetBalance[],
};

export type WalletAssetsBalances = {
  [assetAddress: string]: WalletAssetBalance,
};

export type WalletAssetBalance = {
  address: string,
  balance: string,
};

export type ServiceAssetBalance = {
  key: string,
  service: string,
  title: string,
  valueInUsd: BigNumber,
  changeInUsd?: BigNumber,
  iconUrl: string,
  share?: BigNumber,
  currentApy?: BigNumber,
  address: string,
};

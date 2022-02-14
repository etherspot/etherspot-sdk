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

// Constants
import { AssetType, ASSET_TYPES } from '../constants/assetsConstants';

export  { AssetType } from '../constants/assetsConstants';
// Types
import type { Chain, ChainRecord } from './Chain';
import type { Collectible } from './Collectible';



export type AssetCore = {
  address: string,
  symbol: string,
  decimals: number,
};

export type AssetData = TokenData | Collectible;

export type TokenData = {
  tokenType?: typeof ASSET_TYPES.TOKEN,
  contractAddress: string,
  decimals: number,
  token: string,
  name?: string,
  icon?: string,
  iconColor?: string,

  // Improve cooperation with Collectible
  id?: void,
  isLegacy?: void,
};

export type Asset = {
  chain: Chain,
  address: string,
  symbol: string,
  name: string,
  iconUrl: string,
  decimals: number,
};

export type AssetByAddress = {
  [address: string]: Asset,
};

export type SyntheticAsset = Asset & {
  availableBalance: number,
  exchangeRate?: number,
};

export type KeyBasedAssetTransfer = {
  transactionHash?: string,
  assetData: AssetData,
  draftAmount?: BigNumber,
  amount?: string,
  calculatedGasLimit?: number,
  gasPrice?: number,
  signedTransaction?: Object,
  status?: string,
};

export type AssetOption = {
  // Core props
  address: string,
  balance?: AssetOptionBalance,
  decimals: number,
  name: string,
  iconUrl: string,
  symbol: string,
  tokenType?: AssetType,
  chain: Chain,

  // Additional props
  assetBalance?: string,
  contractAddress?: string,
  ethAddress?: string,
  formattedBalanceInFiat?: string,
  icon?: string,
  id?: string,
  imageSource?: string,
  imageUrl?: string,
  lastUpdateTime?: string,
  token?: string,
  tokenId?: string,
};

export type AssetOptionBalance = {
  balance?: number,
  balanceInFiat?: number,
  token?: string,
  value?: string,
  syntheticBalance?: string,
};

export type AssetDataNavigationParam = {
  id: string,
  name: string,
  token: string,
  contractAddress: string,
  icon: string,
  iconColor: string,
  imageUrl: string,
  patternIcon: string,
  decimals: number,
  chain: Chain,
}

export type AssetsPerChain = ChainRecord<Asset[]>

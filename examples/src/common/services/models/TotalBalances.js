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

// Types
import type { AccountRecord } from 'models/Account';
import type { AssetCategoryRecord } from 'models/AssetCategory';
import type { ChainRecord } from 'models/Chain';

/**
 * Total balances are represented in top-down nesting:
 *  - level 1. Account
 *  - level 2. Asset Category
 *  - level 3. Chain
 *
 * This hierarchy represents the order in which they are most frequently used.
 */

/** Generic helper type for Account -> Category -> Chain nesting. */
export type AccountCategoryChainRecord<T> = AccountRecord<AssetCategoryRecord<ChainRecord<T>>>;

/** Generic helper type for Category -> Chain nesting. */
export type CategoryChainRecord<T> = AssetCategoryRecord<ChainRecord<T>>;

/**
 * Total balances for all accounts, as returned from selectors &  used by app components.
 *
 * Nesting: Account -> Category -> Chain
 * Values expressed in user's fiat currency.
 */
export type TotalBalancesPerAccount = AccountCategoryChainRecord<BigNumber>;

/**
 * Total balances for given account, as returned from selectors & used by app components.
 *
 * Nesting: Category -> Chain
 * Values expressed in user's fiat currency.
 */
export type TotalBalances = CategoryChainRecord<BigNumber>;

/**
 * Wallet total for all accounts, as returned by selectors.
 *
 * Nesting: Account -> Chain
 * Values expressed in user's fiat currency.
 */
export type WalletTotalBalancesPerAccount = AccountRecord<ChainRecord<BigNumber>>;

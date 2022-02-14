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

import { BigNumber } from 'bignumber.js';

export type Value = BigNumber | string | number;

/**
 * TODO: add chain and remove symbol?
 * This comes of thinking that neither symbol nor address alone can have a meaning without chain.
 * Currently TokenValue and similar types share the idea that chain comes from higher level, but MAYBE
 * we want to change this so TokenValue and other similar types (i.e. Transaction) can contain chain
 * and could be scaffolded without having chain at higher levels regardless of method, screen or component.
 */
export type TokenValue = {|
  value: BigNumber,
  symbol: string,
  address: string,
|};

export type FiatValue = {|
  value: BigNumber,
  currency: string,
|};

export type FiatBalance = {|
  value: BigNumber,
  change?: ?BigNumber,
|};

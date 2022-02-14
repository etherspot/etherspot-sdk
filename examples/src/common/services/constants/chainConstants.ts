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


export namespace CHAIN  {
  export const ETHEREUM = 'ethereum';
  export const POLYGON = 'polygon';
  export const BINANCE = 'binance';
  export const XDAI = 'xdai';
  export const AVALANCHE = 'avalanche';
};

export type Chain = typeof CHAIN[keyof typeof CHAIN];

export const CHAIN_NAMES = {
  ETHEREUM: 'ethereum',
  POLYGON: 'polygon',
  BINANCE: 'binance',
  XDAI: 'xdai',
  AVALANCHE: 'avalanche',
};

export const CHAIN_SHORT = {
  ETHEREUM: 'Mainnet',
  POLYGON: 'Polygon',
  BINANCE: 'BSC',
  XDAI: 'xDai',
  AVALANCHE: 'AVAX',
};

// Based on: https://chainid.network/
export const CHAIN_ID = {
  ETHEREUM_MAINNET: 1,
  ETHEREUM_KOVAN: 42,
  POLYGON: 137,
  BINANCE: 56,
  XDAI: 100,
  AVALANCHE: 43114,
  FUJI: 43113,
};



export type ChainRecord<T> = {
polygon?: T,
binance?: T,
xdai?: T,
ethereum?: T,
avalanche?: T,
};

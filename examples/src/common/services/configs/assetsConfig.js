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

// constants
import {
  PLR,
  PLR_ADDRESS_BSC,
  PLR_ADDRESS_ETHEREUM_KOVAN_TESTNET,
  PLR_ADDRESS_ETHEREUM_MAINNET,
  PLR_ADDRESS_POLYGON,
  PLR_ADDRESS_XDAI,
  PLR_ADDRESS_AVALANCHE,
} from 'constants/assetsConstants';
import { CHAIN } from 'constants/chainConstants';

// utils
import { isProdEnv } from 'utils/environment';

// types
import type { Chain } from 'models/Chain';


export default {
  ICX: {
    listed: false,
    send: false,
    receive: false,
    disclaimer: 'Unsupported',
  },
  CMT: {
    listed: false,
    send: false,
    receive: false,
    disclaimer: 'Unsupported',
  },
};

export const PPN_TOKEN = PLR;

/* eslint-disable i18next/no-literal-string */
export const getPlrAddressForChain = (chain: Chain): string => {
  if (chain === CHAIN.BINANCE) return PLR_ADDRESS_BSC;
  if (chain === CHAIN.POLYGON) return PLR_ADDRESS_POLYGON;
  if (chain === CHAIN.XDAI) return PLR_ADDRESS_XDAI;
  if (chain === CHAIN.AVALANCHE) return PLR_ADDRESS_AVALANCHE;

  // Ethereum
  return isProdEnv()
    ? PLR_ADDRESS_ETHEREUM_MAINNET
    : PLR_ADDRESS_ETHEREUM_KOVAN_TESTNET;
};
/* eslint-enable i18next/no-literal-string */

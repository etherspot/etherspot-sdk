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
import { getRariPoolsEnv, getEnv } from 'configs/envConfig';

export const RARI_DEPOSIT_TRANSACTION = 'RARI_DEPOSIT';
export const RARI_WITHDRAW_TRANSACTION = 'RARI_WITHDRAW';
export const RARI_TRANSFER_TRANSACTION = 'RARI_TRANSFER';
export const RARI_CLAIM_TRANSACTION = 'RARI_CLAIM';

export const RARI_POOLS = {
  STABLE_POOL: ('STABLE_POOL': 'STABLE_POOL'),
  YIELD_POOL: ('YIELD_POOL': 'YIELD_POOL'),
  ETH_POOL: ('ETH_POOL': 'ETH_POOL'),
};

export const RARI_POOLS_ARRAY: $Values<typeof RARI_POOLS>[] = Object.keys(RARI_POOLS);

const rariLogo = require('assets/images/rari_logo.png');

export const RARI_TOKENS_DATA = {
  [RARI_POOLS.STABLE_POOL]: {
    symbol: 'RSPT',
    name: 'Rari Stable Pool Token',
    decimals: 18,
    contractAddress: getRariPoolsEnv(RARI_POOLS.STABLE_POOL).RARI_FUND_TOKEN_ADDRESS,
    imageUrl: rariLogo,
  },
  [RARI_POOLS.YIELD_POOL]: {
    symbol: 'RYPT',
    name: 'Rari Yield Pool Token',
    decimals: 18,
    contractAddress: getRariPoolsEnv(RARI_POOLS.YIELD_POOL).RARI_FUND_TOKEN_ADDRESS,
    imageUrl: rariLogo,
  },
  [RARI_POOLS.ETH_POOL]: {
    symbol: 'REPT',
    name: 'Rari ETH Pool Token',
    decimals: 18,
    contractAddress: getRariPoolsEnv(RARI_POOLS.ETH_POOL).RARI_FUND_TOKEN_ADDRESS,
    imageUrl: rariLogo,
  },
};

export const RARI_GOVERNANCE_TOKEN_DATA = {
  symbol: 'RGT',
  name: 'Rari Governance Token',
  decimals: 18,
  contractAddress: getEnv().RARI_GOVERNANCE_TOKEN_CONTRACT_ADDRESS,
  address: getEnv().RARI_GOVERNANCE_TOKEN_CONTRACT_ADDRESS,
  imageUrl: rariLogo,
  iconUrl: rariLogo,
};

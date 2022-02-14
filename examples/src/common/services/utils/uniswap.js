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
import { ChainId } from '@uniswap/sdk';

// Config
import { isProdEnv } from 'utils/environment';

type UniswapChainId = ChainId.MAINNET | ChainId.KOVAN;

export const getUniswapChainId = (): UniswapChainId => isProdEnv() ? ChainId.MAINNET : ChainId.KOVAN;

const DEADLINE_FROM_NOW = 60 * 15; // seconds

export const getDeadline = (): number => {
  return Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;
};

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

import { CHAIN } from 'constants/chainConstants';

import { shouldTriggerSearch } from 'screens/Exchange/Exchange/utils';

const assetEth = {
  symbol: 'ETH',
  address: '0x0000',
  assetBalance: '42.42',
  name: 'Ethereum',
  chain: CHAIN.ETHEREUM,
  decimals: 18,
  iconUrl: '',
};
const assetPlr = {
  symbol: 'PLR',
  address: '0xbeef',
  assetBalance: '0.001',
  name: 'Pillar',
  chain: CHAIN.ETHEREUM,
  decimals: 18,
  iconUrl: '',
};

describe('Exchange Utility function tests', () => {
  it('Should trigger search under certain conditions', () => {
    expect(shouldTriggerSearch(assetEth, assetPlr, '10')).toBeTruthy();
    expect(shouldTriggerSearch(assetEth, assetEth, '10')).toBeFalsy();
    expect(shouldTriggerSearch(assetPlr, assetEth, '10')).toBeFalsy();
    expect(shouldTriggerSearch(assetEth, assetPlr, '42.42')).toBeTruthy();
    expect(shouldTriggerSearch(assetEth, assetPlr, '0')).toBeFalsy();
    expect(shouldTriggerSearch(assetEth, assetPlr, '10.')).toBeFalsy();
    expect(shouldTriggerSearch(assetEth, assetPlr, 'test')).toBeFalsy();
    expect(shouldTriggerSearch(null, assetPlr, '10')).toBeFalsy();
  });
});

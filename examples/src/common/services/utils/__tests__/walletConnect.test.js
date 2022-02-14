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

import { parsePeerName, pickPeerIcon } from '../walletConnect';

describe('parsePeerName', () => {
  it('handles PancakeSwap name', () => {
    // eslint-disable-next-line max-len
    const result = parsePeerName('🥞 PancakeSwap - A next evolution DeFi exchange on Binance Smart Chain (BSC)');
    expect(result).toEqual('PancakeSwap');
  });

  it('handles Aave name', () => {
    const result = parsePeerName('Aave - Open Source Liquidity Protocol');
    expect(result).toEqual('Aave');
  });

  it('handles OpenSea name', () => {
    const result = parsePeerName('OpenSea: Buy NFTs, Crypto...');
    expect(result).toEqual('OpenSea');
  });

  it('handles long names of Iceland vulcanoes', () => {
    const result = parsePeerName('Eyjafjallajökull Brennisteinsfjöll Loki-Fögrufjöll');
    expect(result).toEqual('Eyjafjallajökull Brenn…');
  });
});

describe('pickPeerIcon', () => {
  it('handles Aave icons', () => {
    const icons = [
      'https://app.aave.com/favicon32.ico',
      'https://app.aave.com/favicon.png',
      'https://app.aave.com/favicon32.png',
      'https://app.aave.com/favicon64.png',
    ];
    const result = pickPeerIcon(icons);
    expect(result).toEqual('https://app.aave.com/favicon64.png');
  });

  it('handles Uniswap icons', () => {
    const icons = [
      'https://app.uniswap.org/./favicon.png',
      'https://app.uniswap.org/./images/192x192_App_Icon.png',
      'https://app.uniswap.org/./images/512x512_App_Icon.png',
    ];
    const result = pickPeerIcon(icons);
    expect(result).toEqual('https://app.uniswap.org/./images/512x512_App_Icon.png');
  });

  it('handles SushiSwap icons', () => {
    const icons = [
      'https://app.sushi.com/images/favicon-32x32.png',
      'https://app.sushi.com/images/apple-touch-icon.png',
      'https://app.sushi.com/images/favicon-32x32.png',
      'https://app.sushi.com/images/favicon-16x16.png',
    ];
    const result = pickPeerIcon(icons);
    expect(result).toEqual('https://app.sushi.com/images/apple-touch-icon.png');
  });
});

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
import { getEnv } from '../configs/envConfig';
import { STAGING } from '../constants/envConstants';
import { ETH, DAI, PLR, USDC, USDT, SNX, WBTC } from '../constants/assetsConstants';
import { LIQUIDITY_POOL_TYPES } from '../models/LiquidityPools';

import type { LiquidityPool, UniswapLiquidityPool, UnipoolLiquidityPool } from '../models/LiquidityPools';
import { nativeAssetPerChain } from '../utils/chains';

export const SET_FETCHING_LIQUIDITY_POOLS_DATA = 'SET_FETCHING_LIQUIDITY_POOLS_DATA';
export const SET_UNIPOOL_DATA = 'SET_UNIPOOL_DATA';
export const SET_UNISWAP_POOL_DATA = 'SET_UNISWAP_POOL_DATA';
export const SET_LIQUIDITY_POOLS_GRAPH_QUERY_ERROR = 'SET_LIQUIDITY_POOLS_GRAPH_QUERY_ERROR';
export const SET_SHOWN_STAKING_ENABLED_MODAL = 'SET_SHOWN_STAKING_ENABLED_MODAL';

export const LIQUIDITY_POOLS_ADD_LIQUIDITY_TRANSACTION = 'LIQUIDITY_POOLS_ADD_LIQUIDITY_TRANSACTION';
export const LIQUIDITY_POOLS_REMOVE_LIQUIDITY_TRANSACTION = 'LIQUIDITY_POOLS_REMOVE_LIQUIDITY_TRANSACTION';
export const LIQUIDITY_POOLS_STAKE_TRANSACTION = 'LIQUIDITY_POOLS_STAKE_TRANSACTION';
export const LIQUIDITY_POOLS_UNSTAKE_TRANSACTION = 'LIQUIDITY_POOLS_UNSTAKE_TRANSACTION';
export const LIQUIDITY_POOLS_REWARDS_CLAIM_TRANSACTION = 'LIQUIDITY_POOLS_REWARDS_CLAIM_TRANSACTION';

export const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

export const UNIPOOL_LIQUIDITY_POOLS = (): UnipoolLiquidityPool[] => {
  if (getEnv().ENVIRONMENT === STAGING) {
    return [
      {
        name: 'Uniswap v2 ETH-PLR',
        type: LIQUIDITY_POOL_TYPES.UNIPOOL,
        symbol: 'UNI-V2',
        tokensProportions: [
          {
            symbol: ETH,
            address: nativeAssetPerChain.ethereum.address,
            proportion: 0.5,
            progressBarColor: '#497391',
          },
          {
            symbol: PLR,
            address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
            proportion: 0.5,
            progressBarColor: '#00ff24',
          },
        ],
        rewards: [{ symbol: PLR, amount: 49999 }],
        uniswapPairAddress: '0xddA2eCA2c9cB356ECd9b0135951ffBf5d577401D',
        unipoolAddress: '0xFfD8C07309d3A3ce473Feb1d98ebF1F3171A83d9',
        unipoolSubgraphName: 'graszka22/unipool-plr-eth-kovan',
        iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/ethplruniColor.png',
        rewardsEnabled: true,
      },
    ];
  }

  return [
    {
      name: 'Uniswap v2 ETH-PLR',
      type: LIQUIDITY_POOL_TYPES.UNIPOOL,
      symbol: 'UNI-V2',
      tokensProportions: [
        {
          symbol: ETH,
          address: nativeAssetPerChain.ethereum.address,
          proportion: 0.5,
          progressBarColor: '#497391',
        },
        {
          symbol: PLR,
          address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
          proportion: 0.5,
          progressBarColor: '#00ff24',
        },
      ],
      rewards: [{ symbol: PLR, amount: 49999 }],
      uniswapPairAddress: '0xae2d4004241254aed3f93873604d39883c8259f0',
      unipoolAddress: '0x32105017918Cb9CD9A5f21fd6984Ee7DC82B9E7E',
      unipoolSubgraphName: 'graszka22/unipool-plr-eth',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/ethplruniColor.png',
      rewardsEnabled: true,
    },
    {
      name: 'Uniswap v2 DAI-PLR',
      type: LIQUIDITY_POOL_TYPES.UNIPOOL,
      symbol: 'UNIv2',
      tokensProportions: [
        {
          symbol: DAI,
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          proportion: 0.5,
          progressBarColor: '#FABA34',
        },
        {
          symbol: PLR,
          address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
          proportion: 0.5,
          progressBarColor: '#00ff24',
        },
      ],
      rewards: [{ symbol: 'PLR', amount: 0 }],
      uniswapPairAddress: '0x025d34acfd5c65cfd5a73209f99608c9e13338f3',
      unipoolAddress: '0x71B4A17E4254F85420B06bC55f431A5EEb97E7fB',
      unipoolSubgraphName: 'graszka22/unipool-plr-dai',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/daiplrColor.png',
      rewardsEnabled: false,
    },
  ];
};

export const UNISWAP_LIQUIDITY_POOLS = (): UniswapLiquidityPool[] => {
  if (getEnv().ENVIRONMENT === STAGING) {
    return [];
  }

  return [
    {
      name: 'Uniswap v2 USDC-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'USDC-ETH UNI-V2',
      tokensProportions: [
        { symbol: USDC, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 ETH-USDT',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'ETH-USDT UNI-V2',
      tokensProportions: [
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
        { symbol: USDT, address: '0xdac17f958d2ee523a2206206994597c13d831ec7', proportion: 0.5 },
      ],
      uniswapPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 DAI-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'DAI-ETH UNI-V2',
      tokensProportions: [
        { symbol: DAI, address: '0x6b175474e89094c44da98b954eedeac495271d0f', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 WBTC-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'WBTC-ETH UNI-V2',
      tokensProportions: [
        { symbol: WBTC, address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xbb2b8038a1640196fbe3e38816f3e67cba72d940',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 UNI-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'UNI-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'UNI', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xd3d2e2692501a5c9ca623199d38826e513033a17',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 YFI-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'YFI-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'YFI', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 ETH-AMPL',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'ETH-AMPL UNI-V2',
      tokensProportions: [
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
        { symbol: 'AMPL', address: '0xd46ba6d942050d489dbd938a2c909a5d5039a161', proportion: 0.5 },
      ],
      uniswapPairAddress: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 LINK-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'LINK-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'LINK', address: '0x514910771af9ca656af840dff83e8264ecf986ca', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 SUSHI-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'SUSHI-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'SUSHI', address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xce84867c3c02b05dc570d0135103d3fb9cc19433',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 TEND-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'TEND-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'TEND', address: '0x1453dbb8a29551ade11d89825ca812e05317eaeb', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xcfb8cf118b4f0abb2e8ce6dbeb90d6bc0a62693d',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 CORE-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'CORE-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'CORE', address: '0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0x32ce7e48debdccbfe0cd037cc89526e4382cb81b',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 KP3R-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'KP3R-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'KP3R', address: '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0x87febfb3ac5791034fd5ef1a615e9d9627c2665d',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 DAI-BAS',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'DAI-BAS UNI-V2',
      tokensProportions: [
        { symbol: DAI, address: '0x6b175474e89094c44da98b954eedeac495271d0f', proportion: 0.5 },
        { symbol: 'BAS', address: '0xa7ed29b253d8b4e3109ce07c80fc570f81b63696', proportion: 0.5 },
      ],
      uniswapPairAddress: '0x0379da7a5895d13037b6937b109fa8607a659adf',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 BAC-DAI',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'BAC-DAI UNI-V2',
      tokensProportions: [
        { symbol: 'BAC', address: '0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a', proportion: 0.5 },
        { symbol: DAI, address: '0x6b175474e89094c44da98b954eedeac495271d0f', proportion: 0.5 },
      ],
      uniswapPairAddress: '0xd4405f0704621dbe9d4dea60e128e0c3b26bddbd',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 ESD-USDC',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'ESD-USDC UNI-V2',
      tokensProportions: [
        { symbol: 'ESD', address: '0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723', proportion: 0.5 },
        { symbol: USDC, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', proportion: 0.5 },
      ],
      uniswapPairAddress: '0x88ff79eb2bc5850f27315415da8685282c7610f9',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 USDC-DSD',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'USDC-DSD UNI-V2',
      tokensProportions: [
        { symbol: USDC, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', proportion: 0.5 },
        { symbol: 'DSD', address: '0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3', proportion: 0.5 },
      ],
      uniswapPairAddress: '0x66e33d2605c5fb25ebb7cd7528e7997b0afa55e8',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 SNX-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'SNX-ETH UNI-V2',
      tokensProportions: [
        { symbol: SNX, address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0x43ae24960e5534731fc831386c07755a2dc33d47',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 PICKLE-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'PICKLE-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'PICKLE', address: '0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xdc98556ce24f007a5ef6dc1ce96322d65832a819',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 AAVE-ETH',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'AAVE-ETH UNI-V2',
      tokensProportions: [
        { symbol: 'AAVE', address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', proportion: 0.5 },
        { symbol: ETH, address: nativeAssetPerChain.ethereum.address, proportion: 0.5 },
      ],
      uniswapPairAddress: '0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
    {
      name: 'Uniswap v2 USDC-USDT',
      type: LIQUIDITY_POOL_TYPES.UNISWAP,
      symbol: 'USDC-USDT UNI-V2',
      tokensProportions: [
        { symbol: USDC, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', proportion: 0.5 },
        { symbol: USDT, address: '0xdac17f958d2ee523a2206206994597c13d831ec7', proportion: 0.5 },
      ],
      uniswapPairAddress: '0x3041cbd36888becc7bbcbc0045e3b1f144466f5f',
      iconUrl: 'https://api-core.pillarproject.io/asset/images/tokens/icons/uniColor.png',
    },
  ];
};

export const LIQUIDITY_POOLS = (): LiquidityPool[] => {
  return [...UNIPOOL_LIQUIDITY_POOLS(), ...UNISWAP_LIQUIDITY_POOLS()];
};

export const UNISWAP_FEE_RATE = 0.003;

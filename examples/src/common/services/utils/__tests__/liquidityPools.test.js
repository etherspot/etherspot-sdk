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
import {
  getPoolStats,
  getShareOfPool,
  calculateProportionalAssetValues,
  calculateProportionalAssetAmountsForRemoval,
} from 'utils/liquidityPools';
import { UNIPOOL_LIQUIDITY_POOLS } from 'constants/liquidityPoolsConstants';

const unipoolPool = UNIPOOL_LIQUIDITY_POOLS()[0];

const liquidityPoolsReducerMock = {
  unipoolData: {
    // $FlowFixMe: flow update to 0.122
    [unipoolPool.unipoolAddress]: {
      stakedAmount: 10,
      earnedAmount: 1000,
    },
  },
  poolsData: {
    // $FlowFixMe: flow update to 0.122
    [unipoolPool.uniswapPairAddress]: {
      pair: {
        id: [unipoolPool.uniswapPairAddress],
        token0: {
          id: '0x000',
          name: 'Ethereum',
          symbol: 'ETH',
        },
        token1: {
          id: '0x111',
          name: 'Pillar',
          symbol: 'PLR',
        },
        reserve0: '10000',
        reserve1: '20000',
        totalSupply: '1000',
        reserveETH: '300',
        reserveUSD: '4000',
        token0Price: '0.1',
        token1Price: '10',
        volumeToken0: '100',
        volumeToken1: '200',
        volumeUSD: '500',
      },
      pairDayDatas: [
        {
          date: 1609367442,
          reserveUSD: '3200',
          totalSupply: '1000',
          dailyVolumeUSD: '10',
        },
        {
          date: 1509367442,
          reserveUSD: '1600',
          totalSupply: '800',
          dailyVolumeUSD: '10',
        },
      ],
      pairHourDatas: [
        {
          hourlyVolumeUSD: '5',
        },
        {
          hourlyVolumeUSD: '5',
        },
      ],
      liquidityPosition: {
        liquidityTokenBalance: '0.123',
      },
    },
  },
  isFetchingLiquidityPoolsData: false,
  poolDataGraphQueryFailed: false,
  shownStakingEnabledModal: {},
};

describe('Liquidity pools utils', () => {
  describe('getPoolStats', () => {
    it('should calculate unipool pool stats correctly', () => {
      const historyDates = {};
      historyDates[1509367442000] = new Date(1509367442 * 1000);
      historyDates[1609367442000] = new Date(1609367442 * 1000);
      const now = new Date();

      const spy = jest
        .spyOn(global, 'Date')
        .mockImplementation((date) => historyDates[date] || now);
      const stats = getPoolStats(unipoolPool, liquidityPoolsReducerMock);
      spy.mockRestore();

      expect(stats).toEqual({
        currentPrice: 4,
        dailyVolume: 10,
        dailyFees: 0.03,
        dayPriceChange: 100,
        monthPriceChange: undefined,
        weekPriceChange: undefined,
        rewardsToClaim: 1000,
        stakedAmount: BigNumber(10),
        tokensLiquidity: {
          ETH: 10000,
          PLR: 20000,
        },
        tokensPerLiquidityToken: {
          ETH: 10,
          PLR: 20,
        },
        tokensPrices: {
          ETH: 0.1,
          PLR: 10,
        },
        tokensPricesUSD: {
          ETH: 0.2,
          PLR: 0.1,
        },
        totalLiquidity: 4000,
        totalSupply: 1000,
        volume: 500,
        history: [
          {
            date: new Date(1509367442 * 1000),
            value: 2,
          },
          {
            date: new Date(1609367442 * 1000),
            value: 3.2,
          },
          {
            date: now,
            value: 4,
          },
        ],
        userLiquidityTokenBalance: BigNumber('0.123'),
      });
    });
  });

  describe('getShareOfPool', () => {
    it('should calculate share of unipool pool correctly', () => {
      const share = getShareOfPool(unipoolPool, [5000, 10000], liquidityPoolsReducerMock);
      expect(share).toEqual(50);
    });
  });

  describe('calculateProportionalAssetValues', () => {
    it('should calculate assets proportions in unipool pool', () => {
      const assetsValues = calculateProportionalAssetValues(
        unipoolPool,
        1000,
        0,
        liquidityPoolsReducerMock,
      );
      expect(assetsValues).toEqual([1000, 2000, 100]);
    });
  });

  describe('calculateProportionalAssetAmountsForRemoval', () => {
    it('should calculate for pair token input', () => {
      expect(calculateProportionalAssetAmountsForRemoval(unipoolPool, '1000', 0, liquidityPoolsReducerMock)).toEqual({
        pairTokens: [BigNumber(1000), BigNumber(2000)],
        poolToken: BigNumber(100),
      });
      expect(calculateProportionalAssetAmountsForRemoval(unipoolPool, '2000', 1, liquidityPoolsReducerMock)).toEqual({
        pairTokens: [BigNumber(1000), BigNumber(2000)],
        poolToken: BigNumber(100),
      });
    });

    it('should calculate for pool token input', () => {
      expect(calculateProportionalAssetAmountsForRemoval(unipoolPool, '100', null, liquidityPoolsReducerMock)).toEqual({
        pairTokens: [BigNumber(1000), BigNumber(2000)],
        poolToken: BigNumber(100),
      });
    });
  });
});

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

import { useTranslation } from 'translations/translate';

// Constants
import {
  ETH,
  MATIC,
  BNB,
  XDAI,
  AVAX,
  ASSET_CATEGORY,
} from 'constants/assetsConstants';
import { CHAIN } from 'constants/chainConstants';

// Utils
import { useThemeColors } from 'utils/themes';

// Types
import type { IconName } from 'components/core/Icon';
import type { AssetCategory } from 'models/AssetCategory';
import type { Chain } from 'models/Chain';


type ChainConfig = {|
  title: string,
  titleShort: string,
  iconName: IconName,
  color: string,
  gasSymbol: string,
  iconUrl: string,
|};

/**
 * Returns common UI aspects (texts, icons, color) for displaying main Ethereum chain and side chains.
 */
export function useChainsConfig(): { [key: Chain]: ChainConfig} {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return {
    [CHAIN.POLYGON]: {
      title: t('chains.polygon'),
      titleShort: t('chainsShort.polygon'),
      iconName: 'polygon',
      color: colors.polygon,
      gasSymbol: MATIC,
      iconUrl: 'https://tokens.1inch.exchange/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
    },
    [CHAIN.BINANCE]: {
      title: t('chains.binance'),
      titleShort: t('chainsShort.binance'),
      iconName: 'binance',
      color: colors.binance,
      gasSymbol: BNB,
      iconUrl: 'https://tokens.1inch.exchange/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
    },
    [CHAIN.XDAI]: {
      title: t('chains.xdai'),
      titleShort: t('chainsShort.xdai'),
      iconName: 'xdai',
      color: colors.xdai,
      gasSymbol: XDAI,
      iconUrl: 'https://tokens.1inch.exchange/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    },
    [CHAIN.ETHEREUM]: {
      title: t('chains.ethereum'),
      titleShort: t('chainsShort.ethereum'),
      iconName: 'ethereum',
      color: colors.ethereum,
      gasSymbol: ETH,
      iconUrl: 'https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    },
    [CHAIN.AVALANCHE]: {
      title: t('chains.avalanche'),
      titleShort: t('chainsShort.avalanche'),
      iconName: 'avalanche',
      color: colors.ethereum,
      gasSymbol: AVAX,
      iconUrl:
        'https://firebasestorage.googleapis.com/v0/b/pillar-project-1506420699556.appspot.com/o/app%2Fchains%2Favalanche%2Fassets%2Fassets%2FAvalanche_AVAX_RedWhite.png?alt=media&token=8e3bb7ba-76ac-4e64-a56e-d8623ab7a657',
    },
  };
}

export function useChainConfig(chain: Chain): ChainConfig {
  const configs = useChainsConfig();
  return configs[chain];
}

type AssetCategoryConfig = {|
  title: string,
  titleShort: string,
  iconName: IconName,
  chartColor: string,
|};

/**
 * Returns common UI aspects (texts, icons, color) for displaying asset categories.
 */
export function useAssetCategoriesConfig(): { [key: AssetCategory]: AssetCategoryConfig } {
  const { t } = useTranslation();

  return {
    [ASSET_CATEGORY.WALLET]: {
      title: t('assetCategories.wallet'),
      titleShort: t('assetCategoriesShort.wallet'),
      iconName: 'wallet',
      chartColor: '#e91e63',
    },
    [ASSET_CATEGORY.DEPOSITS]: {
      title: t('assetCategories.deposits'),
      titleShort: t('assetCategoriesShort.deposits'),
      iconName: 'deposit',
      chartColor: '#9c27b0',
    },
    [ASSET_CATEGORY.INVESTMENTS]: {
      title: t('assetCategories.investments'),
      titleShort: t('assetCategoriesShort.investments'),
      iconName: 'investment',
      chartColor: '#5727b0',
    },
    [ASSET_CATEGORY.LIQUIDITY_POOLS]: {
      title: t('assetCategories.liquidityPools'),
      titleShort: t('assetCategoriesShort.liquidityPools'),
      iconName: 'liquidity-pool',
      chartColor: '#276bb0',
    },
    [ASSET_CATEGORY.COLLECTIBLES]: {
      title: t('assetCategories.collectibles'),
      titleShort: t('assetCategoriesShort.collectibles'),
      iconName: 'collectible',
      chartColor: '#e91e63',
    },
    [ASSET_CATEGORY.REWARDS]: {
      title: t('assetCategories.rewards'),
      titleShort: t('assetCategoriesShort.rewards'),
      iconName: 'reward',
      chartColor: '#57acdc',
    },
  };
}

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
import { BigNumber } from 'ethers';
// import { useTranslation } from 'translations/translate';

// services
// import { firebaseRemoteConfig } from 'services/firebase';

// Constants
import { EXCHANGE_PROVIDER as PROVIDER } from '../constants/exchangeConstants';
import { ASSET_TYPES } from '../constants/assetsConstants';
import { CHAIN } from '../constants/chainConstants';
import { REMOTE_CONFIG } from '../constants/remoteConfigConstants';

// Utils
import { useIsDarkTheme } from '../utils/themes';
import { buildEthereumTransaction } from '../utils/transactions';

// Types
import type { ImageSource } from '../utils/types/react-native';
import type { AssetOption } from '../models/Asset';
import type { ExchangeOffer, ExchangeProvider } from '../models/Exchange';
import type { Chain } from '../models/Chain';


// Images
// const uniswapLightVertical = require('assets/images/exchangeProviders/uniswapLightVertical.png');
// const uniswapLightHorizontal = require('assets/images/exchangeProviders/uniswapLightHorizontal.png');
// const uniswapLightMonochrome = require('assets/images/exchangeProviders/uniswapLightMonochrome.png');
// const uniswapDarkVertical = require('assets/images/exchangeProviders/uniswapDarkVertical.png');
// const uniswapDarkHorizontal = require('assets/images/exchangeProviders/uniswapDarkHorizontal.png');
// const uniswapDarkMonochrome = require('assets/images/exchangeProviders/uniswapDarkMonochrome.png');
// const oneInchLightVertical = require('assets/images/exchangeProviders/oneinchLightVertical.png');
// const oneInchLightHorizontal = require('assets/images/exchangeProviders/oneinchLightHorizontal.png');
// const oneInchLightMonochrome = require('assets/images/exchangeProviders/oneinchLightMonochrome.png');
// const oneInchDarkVertical = require('assets/images/exchangeProviders/oneinchDarkVertical.png');
// const oneInchDarkHorizontal = require('assets/images/exchangeProviders/oneinchDarkHorizontal.png');
// const oneInchDarkMonochrome = require('assets/images/exchangeProviders/oneinchDarkMonochrome.png');
// const synthetixLightVertical = require('assets/images/exchangeProviders/synthetixLightVertical.png');
// const synthetixLightHorizontal = require('assets/images/exchangeProviders/synthetixLightHorizontal.png');
// const synthetixLightMonochrome = require('assets/images/exchangeProviders/synthetixLightMonochrome.png');
// const synthetixDarkVertical = require('assets/images/exchangeProviders/synthetixDarkVertical.png');
// const synthetixDarkHorizontal = require('assets/images/exchangeProviders/synthetixDarkHorizontal.png');
// const synthetixDarkMonochrome = require('assets/images/exchangeProviders/synthetixDarkMonochrome.png');
// const sushiswapLightHorizontal = require('assets/images/exchangeProviders/sushiswapLightHorizontal.png');
// const sushiswapLightVertical = require('assets/images/exchangeProviders/sushiswapLightVertical.png');
// const sushiswapLightMonochrome = require('assets/images/exchangeProviders/sushiswapLightMonochrome.png');
// const sushiswapDarkVertical = require('assets/images/exchangeProviders/sushiswapDarkVertical.png');
// const sushiswapDarkHorizontal = require('assets/images/exchangeProviders/sushiswapDarkHorizontal.png');
// const sushiswapDarkMonochrome = require('assets/images/exchangeProviders/sushiswapDarkMonochrome.png');
// const honeyswapLightHorizontal = require('assets/images/exchangeProviders/honeyswapLightHorizontal.png');
// const honeyswapLightVertical = require('assets/images/exchangeProviders/honeyswapLightVertical.png');
// const honeyswapLightMonochrome = require('assets/images/exchangeProviders/honeyswapLightMonochrome.png');
// const honeyswapDarkVertical = require('assets/images/exchangeProviders/honeyswapDarkVertical.png');
// const honeyswapDarkHorizontal = require('assets/images/exchangeProviders/honeyswapDarkHorizontal.png');
// const honeyswapDarkMonochrome = require('assets/images/exchangeProviders/honeyswapDarkMonochrome.png');
// const paraswapLightHorizontal = require('assets/images/exchangeProviders/paraswapLightHorizontal.png');
// const paraswapLightVertical = require('assets/images/exchangeProviders/paraswapLightVertical.png');
// const paraswapLightMonochrome = require('assets/images/exchangeProviders/paraswapLightMonochrome.png');
// const paraswapDarkVertical = require('assets/images/exchangeProviders/paraswapDarkVertical.png');
// const paraswapDarkHorizontal = require('assets/images/exchangeProviders/paraswapDarkHorizontal.png');
// const paraswapDarkMonochrome = require('assets/images/exchangeProviders/paraswapDarkMonochrome.png');

export type ExchangeOptions = {
  fromOptions: AssetOption[],
  toOptions: AssetOption[],
};

type ProviderConfig = {
  title: string,
  iconVertical: ImageSource,
  iconHorizontal: ImageSource,
  iconMonochrome: ImageSource,
};

/**
//  * Returns common UI aspects (texts, icons, color) for displaying main Ethereum chain and side chains.
//  */
// export function useProvidersConfig(): { [key: ExchangeProvider]: ProviderConfig } {
//   // const { t } = useTranslation();
//   const isDarkTheme = useIsDarkTheme();

//   return {
//     [PROVIDER.UNISWAP]: {
//       title: t('exchangeContent.providers.uniswap'),
//       iconVertical: isDarkTheme ? uniswapDarkVertical : uniswapLightVertical,
//       iconHorizontal: isDarkTheme ? uniswapDarkHorizontal : uniswapLightHorizontal,
//       iconMonochrome: isDarkTheme ? uniswapDarkMonochrome : uniswapLightMonochrome,
//     },
//     [PROVIDER.ONE_INCH]: {
//       title: t('exchangeContent.providers.oneInch'),
//       iconVertical: isDarkTheme ? oneInchDarkVertical : oneInchLightVertical,
//       iconHorizontal: isDarkTheme ? oneInchDarkHorizontal : oneInchLightHorizontal,
//       iconMonochrome: isDarkTheme ? oneInchDarkMonochrome : oneInchLightMonochrome,
//     },
//     [PROVIDER.SYNTHETIX]: {
//       title: t('exchangeContent.providers.synthetix'),
//       iconVertical: isDarkTheme ? synthetixDarkVertical : synthetixLightVertical,
//       iconHorizontal: isDarkTheme ? synthetixDarkHorizontal : synthetixLightHorizontal,
//       iconMonochrome: isDarkTheme ? synthetixDarkMonochrome : synthetixLightMonochrome,
//     },
//     [PROVIDER.SUSHISWAP]: {
//       title: t('exchangeContent.providers.sushiswap'),
//       iconVertical: isDarkTheme ? sushiswapDarkVertical : sushiswapLightVertical,
//       iconHorizontal: isDarkTheme ? sushiswapDarkHorizontal : sushiswapLightHorizontal,
//       iconMonochrome: isDarkTheme ? sushiswapDarkMonochrome : sushiswapLightMonochrome,
//     },
//     [PROVIDER.HONEYSWAP]: {
//       title: t('exchangeContent.providers.honeyswap'),
//       iconVertical: isDarkTheme ? honeyswapDarkVertical : honeyswapLightVertical,
//       iconHorizontal: isDarkTheme ? honeyswapDarkHorizontal : honeyswapLightHorizontal,
//       iconMonochrome: isDarkTheme ? honeyswapDarkMonochrome : honeyswapLightMonochrome,
//     },
//     [PROVIDER.PARASWAP]: {
//       title: t('exchangeContent.providers.paraswap'),
//       iconVertical: isDarkTheme ? paraswapDarkVertical : paraswapLightVertical,
//       iconHorizontal: isDarkTheme ? paraswapDarkHorizontal : paraswapLightHorizontal,
//       iconMonochrome: isDarkTheme ? paraswapDarkMonochrome : paraswapLightMonochrome,
//     },
//   };
// }

// export function useProviderConfig(provider: ExchangeProvider): ProviderConfig {
//   const configs = useProvidersConfig();
//   return provider ? configs[provider] : undefined;
// }

export const getCaptureFee = (fromAmount: BigNumber): BigNumber => {
  // if (firebaseRemoteConfig.getBoolean(REMOTE_CONFIG.FEATURE_EXCHANGE_FEE_CAPTURE)) {
  //   const feePrecentage = firebaseRemoteConfig.getNumber(REMOTE_CONFIG.EXCHANGE_FEE_CAPTURE_PERCENTAGE);
  //   return fromAmount.times(feePrecentage / 100);
  // }

  return  BigNumber.from(0);
};

export const getCaptureFeeDestinationAddress = (chain: Chain): string => {
  if (chain === CHAIN.ETHEREUM) {
    return "";//firebaseRemoteConfig.getString(REMOTE_CONFIG.EXCHANGE_FEE_MAINNET_CAPTURE_ADDRESS);
  }

  if (chain === CHAIN.XDAI) {
    return "";//firebaseRemoteConfig.getString(REMOTE_CONFIG.EXCHANGE_FEE_XDAI_CAPTURE_ADDRESS);
  }

  if (chain === CHAIN.POLYGON) {
    return "";//firebaseRemoteConfig.getString(REMOTE_CONFIG.EXCHANGE_FEE_POLYGON_CAPTURE_ADDRESS);
  }

  if (chain === CHAIN.BINANCE) {
    return "";//firebaseRemoteConfig.getString(REMOTE_CONFIG.EXCHANGE_FEE_BSC_CAPTURE_ADDRESS);
  }

  return null;
};

export const appendFeeCaptureTransactionIfNeeded = async (
  offer: ExchangeOffer,
  accountAddress: string,
): Promise<ExchangeOffer> => {
  const { fromAsset, captureFee, chain } = offer;
  const captureFeeDestinationAddress = getCaptureFeeDestinationAddress(chain);

  if (!captureFee.gt(0) || !captureFeeDestinationAddress) return offer;

  const captureFeeTransaction = await buildEthereumTransaction(
    captureFeeDestinationAddress,
    accountAddress,
    null,
    captureFee.toString(),
    fromAsset.symbol,
    fromAsset.decimals,
    ASSET_TYPES.TOKEN,
    fromAsset.address,
    null,
    chain,
  );

  const offerTransactionsWithFeeCapture = offer.transactions.concat(captureFeeTransaction);

  return { ...offer, transactions: offerTransactionsWithFeeCapture };
};

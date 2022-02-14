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
import { BigNumber as EthersBigNumber, utils } from 'ethers';
import { BigNumber } from 'ethers';
import { get, mapValues, orderBy } from 'lodash';
import { formatAmount} from './common';
// constants
import { defaultFiatCurrency, ETH, PLR, ASSET_TYPES } from '../constants/assetsConstants';
import { CHAIN } from '../constants/chainConstants';

// utils
import {
  isCaseInsensitiveMatch,
  addressAsKey,
  valueForAddress,
} from '../utils/common';
import { nativeAssetPerChain } from '../utils/chains';
import { getAssetRateInFiat } from '../utils/rates';
// import { caseInsensitiveIncludes } from '../utils/strings';
import { getGasAddress } from '../utils/transactions';

// types
import type {
  Asset,
  AssetByAddress,
  AssetData,
  AssetOption,
  AssetOptionBalance,
  AssetsPerChain,
  TokenData,
} from '../models/Asset';
import type { GasToken } from '../models/Transaction';
import type { WalletAssetBalance, WalletAssetsBalances } from '../models/Balances';
import type { Chain } from '../models/Chain';
import type { Currency, RatesByAssetAddress } from '../models/Rates';
import type { Value } from '../models/Value';
// import { omitNilProps } from './object';


const sortAssetsFn = (a: Asset, b: Asset): number => {
  return a.symbol.localeCompare(b.symbol);
};

export const sortAssetsArray = (assets: Asset[]): Asset[] => {
  return assets.sort(sortAssetsFn);
};

export const transformBalancesToObject = (
  balancesArray: WalletAssetBalance[] = [],
): WalletAssetsBalances => balancesArray.reduce((memo, balance) => ({
  ...memo,
  [addressAsKey(balance.address)]: balance,
}), {});

export const getAssetsAsList = (assetsObject: AssetByAddress): Asset[] => {
  return Object.keys(assetsObject).map(id => assetsObject[id]);
};

export const sortAssets = (assets: AssetByAddress): Asset[] => {
  const assetsList = getAssetsAsList(assets);

  return sortAssetsArray(assetsList);
};

// export const getBalanceBN = (balances: WalletAssetsBalances, assetAddress: string): BigNumber => {
//   if (!balances || !assetAddress) return BigNumber('0');
//   return BigNumber(valueForAddress(balances, assetAddress)?.balance ?? '0');
// };

/**
 * @deprecated: do not use because of rounding issues
 */
export const getBalance = (balances: WalletAssetsBalances, assetAddress: string): number => {
  if (!balances) return 0;

  const assetBalance = valueForAddress(balances, assetAddress);
  if (!assetBalance) {
    return 0;
  }

  const number = BigNumber.from(assetBalance.balance);

  return parseInt(formatAmount(number.toString()));
};

// export const calculateMaxAmount = (
//   token: string,
//   balance: number | string,
//   txFeeInWei: Value,
//   gasToken: GasToken = {},
// ): string => {
//   if (!txFeeInWei) txFeeInWei = new BigNumber(0);
//   if (!balance) balance = 0;

//   if (typeof balance !== 'string') {
//     balance = balance.toString();
//   }

//   const feeSymbol = get(gasToken, 'symbol', ETH);

//   if (token !== feeSymbol) {
//     return balance;
//   }

//   // we need to convert txFeeInWei to EthersBigNumber as ethers.js utils use different library for Big Numbers
//   const decimals = get(gasToken, 'decimals', 'ether');
//   const maxAmount = utils.parseUnits(balance, decimals).sub(EthersBigNumber.from(txFeeInWei.toString()));
//   if (maxAmount.lt(0)) return '0';

//   return utils.formatUnits(maxAmount, decimals).toString();
// };

// export const isEnoughBalanceForTransactionFee = (
//   balances: WalletAssetsBalances,
//   transaction: {
//     txFeeInWei: Value,
//     gasToken?: GasToken,
//     amount?: any,
//     decimals?: number,
//     symbol?: string,
//   },
//   chain: Chain,
// ): boolean => {
//   const {
//     txFeeInWei,
//     gasToken,
//     decimals: transactionDecimals,
//     amount: transactionAmount,
//     symbol: transactionSymbol,
//   } = transaction;

//   const gasAddress = getGasAddress(chain, gasToken);
//   const feeSymbol = gasToken?.symbol || nativeAssetPerChain[chain].symbol;
//   const feeDecimals = gasToken?.decimals || nativeAssetPerChain[chain].decimals;

//   if (!valueForAddress(balances, gasAddress)) return false;

//   const balance = getBalance(balances, gasAddress);

//   // we need to convert balanceInWei to BigNumber as ethers.js utils use different library for Big Numbers
//   let balanceInWei = new BigNumber(utils.parseUnits(balance.toString(), feeDecimals));

//   // subtract from balance if transaction asset matches fee asset, not suitable for collectibles
//   if (transactionAmount && feeSymbol === transactionSymbol) {
//     try {
//       const amountInWei = new BigNumber(utils.parseUnits(transactionAmount.toString(), transactionDecimals));
//       balanceInWei = balanceInWei.minus(amountInWei);
//     } catch (e) {
//       reportOrWarn('Error parsing asset balance', e, 'error');
//     }
//   }

//   const txFeeInWeiBN = new BigNumber(txFeeInWei?.toString() ?? 0); // compatibility

//   return balanceInWei.gte(txFeeInWeiBN);
// };

export const addressesEqual = (address1: string, address2: string): boolean => {
  if (address1 === address2) return true;
  if (!address1 || !address2) return false;

  return isCaseInsensitiveMatch(address1, address2);
};

/** Checks if address list contains given address. Similar to `Array.includes`.  */
export const addressesInclude = (addresses: string[], addressToFind: string): boolean => {
  return addresses.some(item => isCaseInsensitiveMatch(item, addressToFind));
};

export const isSupportedAssetAddress = (supportedAssets: Asset[], addressToCheck: string): boolean => {
  return supportedAssets.some((asset: Asset) => addressesEqual(asset.address, addressToCheck));
};

export const findAssetByAddress = (assets: (Asset[]), addressToFind: string): Asset =>
  assets?.find((asset) => addressesEqual(asset.address, addressToFind));

export const mapAssetToAssetData = ({
  symbol: token,
  address: contractAddress,
  name,
  decimals,
  iconUrl,
}: Asset): AssetData => ({
  token,
  contractAddress,
  name,
  decimals,
  tokenType: ASSET_TYPES.TOKEN,
  icon: iconUrl,
});

export const getBalanceInFiat = (
  baseFiatCurrency: Currency,
  assetBalance: Value,
  rates: RatesByAssetAddress,
  assetAddress: string,
): number => {
  const fiatCurrency = baseFiatCurrency || defaultFiatCurrency;
  const assetBalanceInFiat = assetBalance ?
    parseFloat(assetBalance.toString()) * getAssetRateInFiat(rates, assetAddress, fiatCurrency) : 0;
  return assetBalanceInFiat;
};

// export const getFormattedBalanceInFiat = (
//   baseFiatCurrency: Currency,
//   assetBalance: Value,
//   rates: RatesByAssetAddress,
//   assetAddress: string,
// ): string => {
//   const assetBalanceInFiat = getBalanceInFiat(baseFiatCurrency, assetBalance, rates, assetAddress);
//   if (!assetBalanceInFiat) return '';
//   const fiatCurrency = baseFiatCurrency || defaultFiatCurrency;
//   return assetBalanceInFiat ? formatFiat(assetBalanceInFiat, fiatCurrency) : '';
// };

// const getAssetOptionBalance = (
//   symbol: string,
//   address: string,
//   balances: WalletAssetsBalances,
//   rates: RatesByAssetAddress,
//   fiatCurrency: Currency,
// ): AssetOptionBalance => {
//   if (!balances) return null;

//   const balance = getBalance(balances, address);
//   const balanceInFiat = rates ? getBalanceInFiat(fiatCurrency, balance, rates, address) : undefined;
//   const value = rates ? getFormattedBalanceInFiat(fiatCurrency, balance, rates, address) : undefined;

//   return {
//     token: symbol,
//     balance,
//     balanceInFiat,
//     value,
//   };
// };

// export const getAssetOption = (
//   asset: Asset,
//   balances: WalletAssetsBalances,
//   rates: RatesByAssetAddress,
//   baseFiatCurrency: Currency,
//   chain: Chain,
// ): AssetOption => {
//   const { symbol, iconUrl, address } = asset;

//   const assetBalance = getBalance(balances, address);
//   const formattedAssetBalance = assetBalance ? formatAmount(assetBalance) : '';
//   const formattedBalanceInFiat = rates ? getFormattedBalanceInFiat(baseFiatCurrency, assetBalance, rates, address) : '';

//   return {
//     ...asset,
//     imageUrl: iconUrl,
//     formattedBalanceInFiat,
//     icon: iconUrl,
//     assetBalance: formattedAssetBalance,
//     balance: getAssetOptionBalance(symbol, address, balances, rates, baseFiatCurrency),
//     chain,
//   };
// };

export const getAssetOptionKey = (option: AssetOption) => {
  if (!option) return '';
  return `${option.chain}-${option.address ?? option.contractAddress}`;
};

// export const isAssetOptionMatchedByQuery = (option: AssetOption, query: string) => {
//   if (!query) return true;
//   return caseInsensitiveIncludes(option.name, query) || caseInsensitiveIncludes(option.symbol, query);
// };

export const mapAssetDataToAsset = (assetData: TokenData, chain: Chain): Asset => {
  return {
    chain,
    address: assetData.contractAddress,
    symbol: assetData.token,
    decimals: assetData.decimals,
    name: assetData.name ?? assetData.token ?? '',
    iconUrl: assetData?.icon ?? '',
  };
};

// export const mapAssetDataToAssetOption = (
//   assetData: TokenData,
//   balances?: WalletAssetsBalances,
//   rates?: RatesByAssetAddress,
//   fiatCurrency?: Currency,
// ): AssetOption => {
//   return {
//     symbol: assetData.token,
//     address: assetData.contractAddress,
//     decimals: assetData.decimals,
//     name: assetData.name ?? '',
//     imageUrl: assetData.icon,
//     tokenType: assetData.tokenType ?? ASSET_TYPES.TOKEN,
//     balance: getAssetOptionBalance(assetData.token, assetData.contractAddress, balances, rates, fiatCurrency),
//     chain: CHAIN.ETHEREUM,
//     iconUrl: assetData?.icon ?? '',
//   };
// };

/**
 * Sort asset options with default priority
 */
export const defaultSortAssetOptions = (options: AssetOption[]): AssetOption[] => {
  return orderBy(
    options,
    [
      (option: AssetOption) => getAssetOptionSortPriority(option),
      (option: AssetOption) => option.balance?.balanceInFiat ?? 0,
      (option: AssetOption) => option.name?.trim().toLowerCase(),
    ],
    ['desc', 'desc', 'asc'],
  );
};

export const getAssetOptionSortPriority = ({ symbol, balance, imageUrl }: AssetOption) => {
  if (balance?.balance && symbol === ETH) return 4;
  if (balance?.balance && symbol === PLR) return 3;
  if (balance?.balance) return 2;
  if (imageUrl) return 1;
  return 0;
};

type CollectibleMatch = { contractAddress: string, id: string };

export const isMatchingCollectible = (
  a: CollectibleMatch,
  b: CollectibleMatch,
) => a.contractAddress
  && addressesEqual(a.contractAddress, b.contractAddress)
  && a.id
  && a.id === b.id;

// export const mapWalletAssetsBalancesIntoAssetsByAddress = (
//   walletAssetsBalances: WalletAssetsBalances,
//   chainSupportedAssets: Asset[],
// ): AssetByAddress => {
//   const assetsByAddress = mapValues(
//     walletAssetsBalances,
//     ({ address }: WalletAssetBalance) => findAssetByAddress(chainSupportedAssets, address),
//   );

//   // removes assets that were not found / no longer supported
//   return omitNilProps(assetsByAddress);
// };

export const sortSupportedAssets = (
  supportedChainAssets: AssetsPerChain,
) => mapValues(supportedChainAssets, sortAssetsArray);

export const isNativeAsset = (chain: Chain, assetAddress: string) => {
  if (!chain || !assetAddress) return false;

  const nativeAsset = nativeAssetPerChain[chain];
  return addressesEqual(assetAddress, nativeAsset?.address);
};

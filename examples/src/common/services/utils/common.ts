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

// import * as Sentry from '@sentry/react-native';
import {isEmpty} from 'lodash';
import {orderBy} from 'lodash';
import { BigNumber, FixedNumber } from 'ethers';
import { providers, utils, BigNumber as EthersBigNumber } from 'ethers';
import { getEnv } from '../configs/envConfig';

// constants
import {
  defaultFiatCurrency,
  CURRENCY_SYMBOLS,
  ETHEREUM_ADDRESS_PREFIX,
  ETH,
  HIGH_VALUE_TOKENS,
} from '../constants/assetsConstants';
import { REMOTE_CONFIG } from '../constants/remoteConfigConstants';

// services
import etherspotService from '../etherspot';
// import { firebaseRemoteConfig } from 'services/firebase';

// utils
// import { wrapBigNumber } from './bigNumber';
import { nativeAssetPerChain } from './chains';

// types
import type { Chain } from '../models/Chain';
import type { GasToken } from '../models/Transaction';
import type { Value } from '../models/Value';
import type { Record } from '../utils/object';

// local
import { humanizeDateString, formatDate } from './date';
import { isProdEnv, isTest } from './environment';

export { BigNumber } from 'ethers';

export const wrapBigNumber = (value: BigNumber | number | string): BigNumber => {
  if (value instanceof BigNumber) return value;
  return BigNumber.from(value);
};
/**
 * Empty object with stable reference.
 *
 * Can be used as a return value in non-memoized selectors instead of `{}` to prevent unnecessary re-renders.
 */
export const EMPTY_OBJECT: {} = Object.freeze({});

/**
 * Empty array with stable reference.
 *
 * Can be used as a return value in non-memoized selectors instead of `[]` to prevent unnecessary re-renders.
 */
export const EMPTY_ARRAY = Object.freeze([]);



// export const reportLog = (message: string, extra?: Object, level: Sentry.Severity = Sentry.Severity.Info) => {
//   Sentry.withScope((scope) => {
//     scope.setExtras({ extra, level });
//     if (level === Sentry.Severity.Info) {
//       Sentry.captureMessage(message, Sentry.Severity.Info);
//     } else {
//       Sentry.captureException(new Error(message));
//     }
//   });
//   printLog(`${level}: ${message}`, extra);
// };


// export const reportOrWarn = (message: string, extra?: Object, level: Sentry.Severity = Sentry.Severity.Info) => {
//   if (__DEV__) {
//     console.error(message, extra); // eslint-disable-line no-console
//     return;
//   }
//   reportLog(message, extra, level);
// };

// export const delay = async (ms: number) => {
//   return new Promise((resolve) => {
//     const timeout = setTimeout(() => {
//       clearTimeout(timeout);
//       resolve();
//     }, ms);
//   });
// };

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
};

/**
 * Extracts the address part from a string on the form of '[prefix]:[address]'
 *
 * Examples:
 *   decodeAddress('ethereum', 'ethereum:0xaddress') -> 0xaddress
 *
 * @param prefix         String the prefix part
 * @param encodedAddress String the '[prefx]:[address]' string
 *
 * @return String the address part
 */
const decodeAddress = (prefix: string, encodedAddress: string): string => {
  if (isEmpty(encodedAddress)) return '';

  const len = prefix.length + 1;

  if (encodedAddress.startsWith(`${prefix}:`)) {
    return encodedAddress.substr(len);
  }

  return encodedAddress;
};

export const decodeETHAddress = (encodedAddress: string): string => {
  return decodeAddress(ETHEREUM_ADDRESS_PREFIX, encodedAddress);
};

// export const decodeSupportedAddress = (encodedAddress: string): string => {
//   return encodedAddress.replace(supportedAddressPrefixes, '');
// };

export const pipe = (...fns: Function[]) => {
  return fns.reduceRight((a, b) => (...args) => a(b(...args)));
};

export const noop = () => {};




export const parseNumber = (amount: Value = '0') => {
  let strg = amount.toString();
  let decimal = '.';
  strg = strg.replace(/[^0-9$.,]/g, '');
  if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
  if ((strg.match(new RegExp(`\\${decimal}`, 'g')) || []).length > 1) decimal = '';
  strg = strg.replace(new RegExp(`[^0-9$${decimal}]`, 'g'), '');
  strg = strg.replace(',', '.');

  return parseFloat(strg);
};

export const isValidNumber = (amount: Value = '0') => {
  const strg = amount.toString();
  const numericalSymbols = strg.replace(/[^0-9$.,]/g, '');

  if (numericalSymbols.includes(',.') || numericalSymbols.includes('.,')) return false;
  if (numericalSymbols.length !== strg.length) return false;
  if ((strg.match(new RegExp('\\.', 'g')) || []).length > 1) return false;
  if ((strg.match(new RegExp(',', 'g')) || []).length > 1) return false;

  return true;
};

export const getDecimalPlaces = (assetSymbol: string): number => {
  if (assetSymbol === ETH) return 4;
  if (HIGH_VALUE_TOKENS.includes(assetSymbol)) return 8;

  return 2; //firebaseRemoteConfig.getNumber(REMOTE_CONFIG.EXCHANGE_AMOUNT_DECIMAL_PLACES);
};

export const formatAmount = (amount: Value, precision: number = 6): string => {
  const roundedNumber = wrapBigNumber(amount);//.toFixed(precision, 1); // 1 = ROUND_DOWN
  return  FixedNumber.from(roundedNumber,1).toString(); // strip trailing zeros
};

/**
 * Truncate amount if needed, preserves trailing zeros.
 */
// export const truncateAmount = (amount: Value, precision: number): string => {
//   const amountBN = wrapBigNumber(amount);

//   return precision != null && amountBN.decimalPlaces() > precision
//     ? amountBN.toFixed(precision, 1) // 1 = ROUND_DOWN
//     : amountBN.toString();
// };

/**
 * Checks if given value has too much decimal places for available precission.
 * It also rejects NaNs & infinite values.
 */
// export const hasTooMuchDecimals = (value: Value, decimals: number): boolean => {
//   const valueBN = wrapBigNumber(value);

//   if (!valueBN.isFinite()) return false;

//   if (decimals == null) return true;

//   return valueBN.decimalPlaces() > decimals;
// };

// export const formatTokenAmount = (amount: Value, assetSymbol: string): string =>
//   formatAmount(amount, getDecimalPlaces(assetSymbol));

// export const formatFullAmount = (amount: string | number): string => {
//   return FixedNumber.from(amount).toString(); // strip trailing zeros
// };

export const parseTokenBigNumberAmount = (amount: number | string, decimals: number): BigNumber => {
  let formatted = amount.toString();
  const [whole, fraction] = formatted.split('.');
  if (decimals != null && decimals > 0) {
    if (fraction && fraction.length > decimals) {
      formatted = `${whole}.${fraction.substring(0, decimals)}`;
    }
    return utils.parseUnits(formatted, decimals);
  }
  return EthersBigNumber.from(formatted);
};

export const parseTokenAmount = (amount: number | string, decimals: number): number => {
  const parsed = parseTokenBigNumberAmount(amount, decimals);
  return Math.floor(+parsed.toString());
};

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || '';
};

// export const commify = (src: Value, options?: { skipCents?: boolean }): string => {
//   const REGEX = '\\d(?=(\\d{3})+\\D)';
//   const num = wrapBigNumber(src).toFixed(2);
//   let formatedValue = num.replace(new RegExp(REGEX, 'g'), '$&,');
//   if (options?.skipCents) {
//     formatedValue = formatedValue.substring(0, formatedValue.length - 3);
//   }
//   return formatedValue;
// };

// export const formatFiatValue = (value: Value, options?: { skipCents?: boolean }): string => {
//   const formatedValue = commify(value, options);
//   return `${parseFloat(formatedValue) > 0 ? formatedValue : 0}`;
// };


export const partial = (fn: Function, ...fixedArgs: any) => {
  return (...rest: any) => {
    return fn.apply(null, [...fixedArgs, ...rest]);
  };
};

export const uniqBy = (collection: Object[] = [], key: string): Object[] => {
  return collection.filter((item, i, arr) => {
    return arr.map((it) => it[key]).indexOf(item[key]) === i;
  });
};





export const getEthereumProvider = (network: string) => {
  // Connect to INFURA
  const infuraProjectId = ''; //firebaseRemoteConfig.getString(REMOTE_CONFIG.INFURA_PROJECT_ID) || getEnv().INFURA_PROJECT_ID;
  const infuraProvider = new providers.InfuraProvider(network, infuraProjectId);

  // Connect to Etherscan
  const etherscanProvider = new providers.EtherscanProvider(network);

  // Creating a provider to automatically fallback onto Etherscan
  // if INFURA is down
  return new providers.FallbackProvider([infuraProvider, etherscanProvider]);
};

export const resolveEnsName = async (ensName: string): Promise<string> => {
  const resolved = await etherspotService.getEnsNode(ensName);

  return resolved?.address;
};

export const lookupAddress = async (address: string): Promise<string> => {
  const resolved = await etherspotService.getEnsNode(address);

  return resolved?.name;
};

export const formatUnits = (val: Value = '0', decimals: number): string => {
  let formattedUnits = decimals === 0 ? '0' : '0.0';
  let preparedValue = null; // null for sentry reports
  let valueWithoutDecimals: string | null = null; // null for sentry reports
  try {
    // check if val is exact number or other format (might be hex, exponential, etc.)
    preparedValue = isValidNumber(val) ? Math.floor(+val) : val;
    // parse number as BigNumber and get as string expresion without decimals
    valueWithoutDecimals = FixedNumber.from(preparedValue.toString()).toString();
    if (decimals === 0) {
      // check additionally if string contains decimal pointer
      // because converting exponential numbers back to number will result as exponential expression again
      if (valueWithoutDecimals.includes('.')) return Math.floor(+valueWithoutDecimals).toFixed();
      // else return as it is
      return valueWithoutDecimals;
    }
    formattedUnits = utils.formatUnits(valueWithoutDecimals, decimals);
  } catch (e) {
    console.log(e.message, {
      sourceFunction: 'formatUnits(value,decimals)',
      inputValue: val,
      preparedValue,
      valueWithoutDecimals,
      decimals,
    });
  }
  return formattedUnits;
};

type SectionData = {
  title: string,
  data: any[],
};


export const isCaseInsensitiveMatch = (a: string, b: string): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
};





// export const findEnsNameCaseInsensitive = (ensRegistry: EnsRegistry, address: string): ?string => {
//   const addressMixedCase = Object.keys(ensRegistry).find((key) => isCaseInsensitiveMatch(key, address));
//   if (!addressMixedCase) return null;
//   return ensRegistry[addressMixedCase];
// };

export const getEnsPrefix = () =>
  isProdEnv()
    ? '.pillar.eth' // eslint-disable-line i18next/no-literal-string
    : '.pillar'; // eslint-disable-line i18next/no-literal-string

export const hitSlop10 = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

export const hitSlop20 = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

export const hitSlop50w20h = {
  top: 20,
  bottom: 20,
  left: 50,
  right: 50,
};

// export const formatBigAmount = (value: Value) => {
//   const _value = wrapBigNumber(value);

//   if (_value.gte(1e12)) {
//     // eslint-disable-next-line i18next/no-literal-string
//     return `${_value.dividedBy(1e12).toFixed(2)}T`;
//   }

//   if (_value.gte(1e9)) {
//     // eslint-disable-next-line i18next/no-literal-string
//     return `${_value.dividedBy(1e9).toFixed(2)}B`;
//   }

//   if (_value.gte(1e6)) {
//     // eslint-disable-next-line i18next/no-literal-string
//     return `${_value.dividedBy(1e6).toFixed(2)}M`;
//   }

//   if (_value.gte(1e3)) {
//     // eslint-disable-next-line i18next/no-literal-string
//     return `${_value.dividedBy(1e3).toFixed(2)}K`;
//   }

//   return _value.toFixed(2);
// };

// export const formatBigFiatAmount = (value: Value, fiatCurrency: string) => {
//   const currencySymbol = getCurrencySymbol(fiatCurrency);
//   return `${currencySymbol}${formatBigAmount(value)}`;
// };

export const getEnsName = (username: string) => `${username}${getEnsPrefix()}`;

export const extractUsernameFromEnsName = (ensName: string) => ensName.replace(getEnsPrefix(), '');

export const addressAsKey = (address: string): string => address?.toLowerCase() ?? '';

export const valueForAddress = <V>(record: Record<V>, address: string): V => record?.[addressAsKey(address)];

export const setValueForAddress = <V>(record: Record<V>, address: string, value: V) => {
  record[addressAsKey(address)] = value;
};

export const parseTimestamp = (date: Date | string | number): number => new Date(date).getTime();

export const reportErrorLog = (msg,data={}) => {
  console.log(msg);
  console.log(data);
}

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

import { BigNumber } from 'bignumber.js';
import t from 'translations/translate';

import { wrapBigNumberOrNil } from 'utils/bigNumber';
import { getCurrencySymbol, getDecimalPlaces } from 'utils/common';

/**
 * Modern formatting functions.
 *
 * Common assumptions:
 * - output user-facing strings
 * - numeric input as BigNumber or number
 * - accepts null and undefined values but returns null instead of formatted value as well as NaNs and ininity
 */

type FormatValueOptions = {|
  decimalPlaces?: number, // default: undefined -> full precision
  stripTrailingZeros?: boolean, // default: false
|};

/**
 * Generic formattting function.
 *
 * Does not make assumption about formatted output.
 */
export function formatValue(value: ?BigNumber | number, options?: FormatValueOptions) {
  value = wrapBigNumberOrNil(value);
  if (!value || !value.isFinite()) return null;

  const stripTrailingZeros = options?.stripTrailingZeros ?? false;

  if (options?.decimalPlaces != null) {
    value = value.decimalPlaces(options?.decimalPlaces, BigNumber.ROUND_DOWN);
  }

  return stripTrailingZeros ? value.toFormat() : value.toFormat(options?.decimalPlaces, BigNumber.ROUND_DOWN);
}

/**
 * Format percent value.
 * By defaults outputs 1 decimal places, without stripping zeros.
 *
 * Examples:
 *   0.5 => '50.0%'
 *   -0.01234 => '-1.2%'
 *
 */
export function formatPercentValue(value: ?BigNumber, options?: FormatValueOptions) {
  if (!value || !value.isFinite()) return null;

  return t('percentValue', { value: formatValue(value.multipliedBy(100), { decimalPlaces: 1, ...options }) });
}

/**
 * Format percent change with +/- sign.
 * By defaults outputs 2 decimal places, without stripping zeros.
 *
 * Examples:
 *   0.5 => '+50.00%'
 *   -0.01234 => '-1.23%'
 *
 */
export function formatPercentChange(value: ?BigNumber, options?: FormatValueOptions) {
  if (!value || !value.isFinite()) return null;

  return value.gte(0)
    ? t('positivePercentValue', { value: formatValue(value.multipliedBy(100), { decimalPlaces: 2, ...options }) })
    : t('percentValue', { value: formatValue(value.multipliedBy(100), { decimalPlaces: 2, ...options }) });
}

/**
 * Format value with K, M, B units if needed.
 * By defaults outputs 2 decimal places, without stripping zeros.
 *
 * Examples:
 *   1000 => '1.00K'
 *   1234000 => '1.23M'
 *
 */
export function formatValueWithUnit(value: ?BigNumber | number, options?: FormatValueOptions) {
  value = wrapBigNumberOrNil(value);

  if (!value || !value.isFinite()) return null;

  const threshold = 0.85;

  if (value.gte(threshold * 1e12)) {
    return t('units.1e12', { value: formatValue(value.dividedBy(1e12), { decimalPlaces: 2, ...options }) });
  }

  if (value.gte(threshold * 1e9)) {
    return t('units.1e9', { value: formatValue(value.dividedBy(1e9), { decimalPlaces: 2, ...options }) });
  }

  if (value.gte(threshold * 1e6)) {
    return t('units.1e6', { value: formatValue(value.dividedBy(1e6), { decimalPlaces: 2, ...options }) });
  }

  if (value.gte(threshold * 1e3)) {
    return t('units.1e3', { value: formatValue(value.dividedBy(1e3), { decimalPlaces: 2, ...options }) });
  }

  return formatValue(value, { decimalPlaces: 2, ...options });
}

/**
 * Format fiat value, for use cases such as balance.
 */
export function formatFiatValue(value: ?BigNumber | number, currency?: string, options?: FormatValueOptions) {
  const formattedValue = formatValue(value, { decimalPlaces: 2, ...options });
  if (!formattedValue) return null;

  if (!currency) return formattedValue;

  const currencyValue = t('fiatValue', { value: formattedValue, symbol: getCurrencySymbol(currency) });

  return BigNumber(formattedValue).lt(0.01) && BigNumber(formattedValue).gt(0)
    ? '< '.concat(currencyValue)
    : currencyValue;
}

/**
 * Formats fiat change as `+ $100.00`.
 * Format fiat value with plus or minus sign, for use cases such as change in balance.
 */
export function formatFiatChange(change: ?BigNumber, currency?: string, options?: FormatValueOptions) {
  const formattedAbsValue = formatFiatValue(change?.abs(), currency, options);
  if (!formattedAbsValue) return null;

  return change?.gte(0)
    ? t('positiveValue', { value: formattedAbsValue })
    : t('negativeValue', { value: formattedAbsValue });
}

/**
 * Formats profit as `+10.00% ($100.00)`.
 *
 * Handles edge cases of missing change and/or balance values.
 */
export function formatFiatChangeExtended(change: ?BigNumber, initialBalance: ?BigNumber, currency: string) {
  if (!change || !change.isFinite()) return null;

  // Special case zero change.
  if (change.isZero()) return formatPercentChange(BigNumber(0));

  const formattedChangeInFiat = formatFiatValue(change, currency);

  // Special case missing/incorrect/negative balance.
  if (!initialBalance || !initialBalance.isFinite() || !initialBalance.gte(0)) return formattedChangeInFiat;

  const formattedChangeInPercent = formatPercentChange(change.dividedBy(initialBalance), { stripTrailingZeros: true });

  if (formattedChangeInFiat && formattedChangeInPercent) {
    return `${formattedChangeInPercent} (${formattedChangeInFiat})`;
  }

  if (formattedChangeInFiat) return formattedChangeInFiat;

  return null;
}

/**
 * Format token value without symbol change without + sign.
 * Default number of decimal places depends on token symbol and trailing zeroes are stripped.
 */
export function formatTokenValueWithoutSymbol(value: ?BigNumber, symbol?: string, options?: FormatValueOptions) {
  if (!value || !value.isFinite()) return null;

  const decimalPlaces = getDecimalPlaces(symbol);
  const formattedValue = formatValue(value.abs(), { decimalPlaces, ...options });

  return value.gte(0) ? formattedValue : t('negativeValue', { value: formattedValue });
}

/**
 * Format token value change without + sign.
 * Default number of decimal places depends on token symbol and trailing zeroes are stripped.
 */
export function formatTokenValue(value: ?BigNumber, symbol?: string, options?: FormatValueOptions) {
  if (!value || !value.isFinite()) return null;

  const decimalPlaces = getDecimalPlaces(symbol);
  const formattedValue = formatValue(value.abs(), { decimalPlaces, ...options });

  return value.gte(0)
    ? t('tokenValue', { value: formattedValue, token: symbol })
    : t('negativeTokenValue', { value: formattedValue, token: symbol });
}

/**
 * Format token value change with +/- sign.
 * Default number of decimal places depends on token symbol and trailing zeroes are stripped.
 */
export function formatTokenChange(value: ?BigNumber, symbol?: string, options?: FormatValueOptions) {
  if (!value || !value.isFinite()) return null;

  const decimalPlaces = getDecimalPlaces(symbol);
  const formattedValue = formatValue(value.abs(), { decimalPlaces, ...options });

  return value.gte(0)
    ? t('positiveTokenValue', { value: formattedValue, token: symbol })
    : t('negativeTokenValue', { value: formattedValue, token: symbol });
}

export function formatHexAddress(address: string) {
  if (address?.length <= 12) return address;

  return t('ellipsedMiddleString', { stringStart: address.slice(0, 6), stringEnd: address.slice(-6) });
}

export function formatExchangeRate(
  rate: ?BigNumber | number,
  fromSymbol: string,
  toSymbol: string,
  reverse: boolean = false,
) {
  rate = wrapBigNumberOrNil(rate);
  if (!rate || !rate.isFinite()) return null;

  if (reverse) {
    rate = BigNumber(1).dividedBy(rate);
    return formatExchangeRate(rate, toSymbol, fromSymbol);
  }

  const rateString = formatExchangeRateWithoutSymbol(rate);
  return t('exchangeRate', { rate: rateString, fromSymbol, toSymbol });
}

export function formatExchangeRateWithoutSymbol(rate: ?BigNumber | number) {
  rate = wrapBigNumberOrNil(rate);
  if (!rate || !rate.isFinite()) return null;

  if (rate.gt(1000)) {
    return formatValue(rate, { decimalPlaces: 0 });
  }

  if (rate.gt(1)) {
    return formatValue(rate, { decimalPlaces: 2 });
  }

  if (rate.gt(0.00001)) {
    return formatValue(rate, { decimalPlaces: 5 });
  }

  return '<0.00001';
}

/**
 * Format liquidity pool share.
 *
 * Input number is expressed as a fraction, i.e. 0.5 == 50%
 */
export function formatLiquidityPoolShare(value: ?BigNumber | string) {
  value = wrapBigNumberOrNil(value);
  if (!value) return null;

  if (value.lte(0.000001)) return '<0.0001%'; // note: 0.000001 * 100 = 0.0001%

  return formatPercentValue(value, { decimalPlaces: 4, stripTrailingZeros: true });
}

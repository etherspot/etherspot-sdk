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
  delay,
  formatAmount,
  decodeETHAddress,
  decodeSupportedAddress,
  pipe,
  parseNumber,
  isValidNumber,
  formatMoney,
  uniqBy,
  formatUnits,
  formatFiat,
  parseTokenAmount,
  getFormattedTransactionFeeValue,
  formatBigAmount,
  formatBigFiatAmount,
  formatTokenAmount,
  addressAsKey,
  valueForAddress,
  parseTimestamp,
} from 'utils/common';

import { ETH, PLR, HIGH_VALUE_TOKENS, USDC } from 'constants/assetsConstants';
import { CHAIN } from 'constants/chainConstants';

const gasToken = {
  address: '0x0',
  decimals: 18,
  symbol: 'PLR',
};

describe('Common utils', () => {
  describe('delay', () => {
    it('should return a resolved delayed promise with specified timeout', () => {
      const timeout = 500;
      let value;
      delay(timeout).then(() => {
        value = true;
      }).catch(() => { });
      expect(value).toBeUndefined();
      setTimeout(() => {
        expect(value).not.toBeUndefined();
      }, timeout + 1);
    });
  });

  describe('formatAmount', () => {
    it('should format transaction amount to a readable one', () => {
      const expectedAmount = '0.000042';
      expect(formatAmount(0.0000420000001)).toBe(expectedAmount);
    });
  });

  describe('decodeETHAddress', () => {
    it('returns ETH address when string is an address', () => {
      const expectedAddress = '0xf74b153d202ab7368aca04efb71cb3c8c316b514';
      expect(decodeETHAddress('0xf74b153d202ab7368aca04efb71cb3c8c316b514')).toBe(expectedAddress);
    });

    it('returns ETH address from string provided', () => {
      const expectedAddress = '0xf74b153d202ab7368aca04efb71cb3c8c316b514';
      expect(decodeETHAddress('ethereum:0xf74b153d202ab7368aca04efb71cb3c8c316b514')).toBe(expectedAddress);
    });
  });

  describe('decodeSupportedAddress', () => {
    it('decodes ethereum address', () => {
      const expectedAddress = 'ETHEREUM_ADDRESS';
      expect(decodeSupportedAddress('ethereum:ETHEREUM_ADDRESS')).toBe(expectedAddress);
    });
  });

  describe('pipe', () => {
    it('should return a function composition', () => {
      const toLower = (str) => str.toLowerCase();
      const emptyJoin = (arr) => arr.join(' ');
      const expectedOutput = 'pillar';
      const func = pipe(emptyJoin, toLower);
      expect(func(['PILLAR'])).toBe(expectedOutput);
    });
  });

  describe('parseNumber', () => {
    it('supports receiving a BigNumber', () => {
      const expectedValue = 3;
      expect(parseNumber(new BigNumber(3))).toBe(expectedValue);
    });
    it('supports receiving undefined', () => {
      const expectedValue = 0;
      expect(parseNumber(undefined)).toBe(expectedValue);
    });
    it('converts a comma separated number (as string) to a decimal separated number', () => {
      const expectedValue = 12.345;
      expect(parseNumber('12,345')).toBe(expectedValue);
    });
    it('converts a decimal separated number (as string) to the exact same number', () => {
      const expectedValue = 23.45;
      expect(parseNumber('23.45')).toBe(expectedValue);
    });
    it('converts a value with multiple decimal separators', () => {
      const expectedValue = 5678.91;
      expect(parseNumber('5,678.91')).toBe(expectedValue);
    });
  });

  describe('isValidNumber', () => {
    it('allows BigNumber', () => {
      expect(isValidNumber(new BigNumber(2))).toBeTruthy();
    });
    it('allows undefined', () => {
      expect(isValidNumber(undefined)).toBeTruthy();
    });
    it('fails on string with non numerical symbols', () => {
      expect(isValidNumber('a12,3m4')).toBeFalsy();
    });
    it('fails on string with two dots', () => {
      expect(isValidNumber('2.3.45')).toBeFalsy();
    });
    it('fails on string with two commas', () => {
      expect(isValidNumber('5,678,91')).toBeFalsy();
    });
    it('fails on string with ,. going side by side', () => {
      expect(isValidNumber('5,.678')).toBeFalsy();
    });
    it('fails on string with ., going side by side', () => {
      expect(isValidNumber('5.,678')).toBeFalsy();
    });
    it('allows to have a dot and a comma', () => {
      expect(isValidNumber('5,678.91')).toBeTruthy();
    });
  });

  describe('formatMoney', () => {
    it('should strip trailing zeros from number 12.0300', () => {
      const expectedValue = '12.03';
      expect(formatMoney('12.0300')).toBe(expectedValue);
    });
    it('should add trailing zeros to number 12.3', () => {
      const expectedValue = '12.30';
      expect(formatMoney('12.3', 2, 3, ',', '.', false)).toBe(expectedValue);
    });
    it('should strip trailing zeros and a dot from number 12.00', () => {
      const expectedValue = '12';
      expect(formatMoney('12.00')).toBe(expectedValue);
    });
  });

  describe('uniqBy', () => {
    it('returns uniq items by key', () => {
      const expected = [{ id: 1, name: 'Jon' }, { id: 2, name: 'Snow' }];
      const input = [{ id: 1, name: 'Jon' }, { id: 2, name: 'Snow' }, { id: 2, name: 'Snow' }];

      expect(uniqBy(input, 'id')).toEqual(expected);
    });
  });

  describe('formatUnits', () => {
    it('should format 0 correctly', () => {
      const result = formatUnits('0', 18);
      expect(result).toEqual('0.0');
    });
    it('should format 40000000000 correctly', () => {
      const result = formatUnits('40000000000', 18);
      expect(result).toEqual('0.00000004');
    });
    it('should format error input 0.0001 correctly', () => {
      const result = formatUnits('0.0001', 18);
      expect(result).toEqual('0.0');
    });
    it('should format error input 0.0001 correctly', () => {
      const result = formatUnits('0.0001', 0);
      expect(result).toEqual('0');
    });
    it('should format 0xc420d9d8e4003a8000 correctly', () => {
      const result = formatUnits('0xc420d9d8e4003a8000', 18);
      expect(result).toEqual('3617.929');
    });
    it('should format error input undefined correctly', () => {
      const result = formatUnits(undefined, 18);
      expect(result).toEqual('0.0');
    });
    it('should format error input "" correctly', () => {
      const result = formatUnits('', 18);
      expect(result).toEqual('0.0');
    });
    it('should format 40000000 correctly with 0 decimals', () => {
      const result = formatUnits('40000000', 0);
      expect(result).toEqual('40000000');
    });
    it('should format 40000999.9 correctly with 0 decimals', () => {
      const result = formatUnits('40000999.9', 0);
      expect(result).toEqual('40000999');
    });
    it('should format 40000999.9 correctly with 18 decimals', () => {
      const result = formatUnits('40000999.9', 18);
      expect(result).toEqual('0.000000000040000999');
    });
    it('should format 3.91071936104e+21 correctly with 18 decimals', () => {
      const result = formatUnits('3.91071936104e+21', 18);
      expect(result).toEqual('3910.71936104');
    });
    it('should format 3.91071936104e+21 correctly with 0 decimals', () => {
      const result = formatUnits('3.91071936104e+21', 0);
      expect(result).toEqual('3910719361040000000000');
    });
  });

  describe('formatFiat', () => {
    it('should add currency symbol to value string based on currency provided', () => {
      const expectedValue = '€14.30';
      expect(formatFiat('14.3', 'EUR')).toBe(expectedValue);
    });
    it('should add default (£) currency symbol to value string if no currency is provided', () => {
      const expectedValue = '£14.30';
      expect(formatFiat('14.3')).toBe(expectedValue);
    });
    it('should round value and show two decimals only', () => {
      const expectedValue = '£14.34';
      expect(formatFiat('14.336')).toBe(expectedValue);
    });
    it('should add trailing zeros to values missing second decimal', () => {
      const expectedValue = '£14.30';
      expect(formatFiat('14.3')).toBe(expectedValue);
    });
    it('should add trailing zeros to values missing decimals', () => {
      const expectedValue = '£14.00';
      expect(formatFiat('14')).toBe(expectedValue);
    });
    it('should show just 0 (without decimals) if value is less than 0', () => {
      const expectedValue = '£0';
      expect(formatFiat('0.00')).toBe(expectedValue);
    });
  });

  describe('parseTokenAmount', () => {
    it('should parse from 0.1 as 100000000000000000 with 18 decimals', () => {
      const expectedValue = 100000000000000000;
      expect(parseTokenAmount('0.1', 18)).toBe(expectedValue);
    });
    it('should parse from 100 as 100 with 0 decimals', () => {
      const expectedValue = 100;
      expect(parseTokenAmount('100', 0)).toBe(expectedValue);
    });
  });

  describe('getFormattedTransactionFeeValue', () => {
    it('should parse from BigNumber', () => {
      const txFeeInWei = new BigNumber(1234500000000000000);
      const formattedEth = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei);
      const formattedGasToken = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei, gasToken);
      expect(formattedEth).toBe('1.2345');
      expect(formattedGasToken).toBe('1.23'); // method has 2 decimals precision for gasToken
    });
    it('should parse from BigNumber that has exponential value', () => {
      const txFeeInWei = new BigNumber(0x41d1d9bfc6ee79e9e9); // parses from hex
      const formattedEth = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei);
      const formattedGasToken = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei, gasToken);
      expect(txFeeInWei.toString()).toBe('1.2141596928761193e+21'); // exponential
      expect(formattedEth).toBe('1214.159692');
      expect(formattedGasToken).toBe('1214.15'); // method has 2 decimals precision for gasToken
    });
    it('should parse from numeric', () => {
      const txFeeInWei = 1234500000000000000;
      const formattedEth = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei);
      const formattedGasToken = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei, gasToken);
      expect(formattedEth).toBe('1.2345');
      expect(formattedGasToken).toBe('1.23'); // method has 2 decimals precision for gasToken
    });
    it('should parse from string', () => {
      const txFeeInWei = '1234500000000000000';
      const formattedEth = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei);
      const formattedGasToken = getFormattedTransactionFeeValue(CHAIN.ETHEREUM, txFeeInWei, gasToken);
      expect(formattedEth).toBe('1.2345');
      expect(formattedGasToken).toBe('1.23'); // method has 2 decimals precision for gasToken
    });
  });

  describe('formatBigAmount', () => {
    it('basic cases', () => {
      expect(formatBigAmount('1')).toEqual('1.00');
      expect(formatBigAmount('1.01')).toEqual('1.01');
      expect(formatBigAmount('1.001')).toEqual('1.00');
      expect(formatBigAmount('1.0055')).toEqual('1.01');

      expect(formatBigAmount('12')).toEqual('12.00');
      expect(formatBigAmount('123')).toEqual('123.00');

      expect(formatBigAmount('1234')).toEqual('1.23K');
      expect(formatBigAmount('12345')).toEqual('12.35K');
      expect(formatBigAmount('123456')).toEqual('123.46K');
      expect(formatBigAmount('1234567')).toEqual('1.23M');
      expect(formatBigAmount('12345678')).toEqual('12.35M');
      expect(formatBigAmount('123456789')).toEqual('123.46M');

      expect(formatBigAmount('1002003004')).toEqual('1.00B');
      expect(formatBigAmount('1002003004005')).toEqual('1.00T');
    });
  });

  describe('formatBigFiatAmount', () => {
    it('basic cases', () => {
      expect(formatBigFiatAmount(1000, 'EUR')).toEqual('€1.00K');
      expect(formatBigFiatAmount(1000000, 'EUR')).toEqual('€1.00M');
      expect(formatBigFiatAmount(12345.67, 'EUR')).toEqual('€12.35K');
      expect(formatBigFiatAmount(123.45, 'EUR')).toEqual('€123.45');
    });
  });

  describe('formatTokenAmount', () => {
    it('formats ETH correctly', () => {
      expect(formatTokenAmount(123.456789, ETH)).toEqual('123.4567');
      expect(formatTokenAmount(123.45, ETH)).toEqual('123.45');
      expect(formatTokenAmount('123.450000000', ETH)).toEqual('123.45');
    });
    it('formats high value tokens correctly', () => {
      HIGH_VALUE_TOKENS.forEach(token => {
        // 8 decimals
        expect(formatTokenAmount('123.123456789', token)).toEqual('123.12345678');
      });
    });
    it('formats other tokens correctly', () => {
      expect(formatTokenAmount(123.456789, PLR)).toEqual('123.4567');
      expect(formatTokenAmount('123.456789', USDC)).toEqual('123.4567');
      expect(formatTokenAmount('123.4000000', USDC)).toEqual('123.4');
      expect(formatTokenAmount('123.456789')).toEqual('123.4567');
    });
  });

  describe('addressAsKey', () => {
    it('returns lower case string key on value being string', () => {
      expect(addressAsKey('AAA')).toEqual('aaa');
    });
    it('fails safe on no address', () => {
      // $FlowFixMe: address value passed only to validate test
      expect(addressAsKey(undefined)).toEqual('');
      // $FlowFixMe: address value passed only to validate test
      expect(addressAsKey(null)).toEqual('');
    });
  });

  describe('valueForAddress', () => {
    const address = '0x';
    const value = 'ok';
    const record = { [address]: value };

    it('returns correct value for address', () => {
      expect(valueForAddress(record, address)).toEqual(value);
    });
    it('returns undefined for non existing address', () => {
      expect(valueForAddress(record, 'invalid')).toEqual(undefined);
    });
    it('returns undefined for undefined address', () => {
      // $FlowFixMe: address value passed only to validate test
      expect(valueForAddress(record, undefined)).toEqual(undefined);
      // $FlowFixMe: address value passed only to validate test
      expect(valueForAddress(record, null)).toEqual(undefined);
    });
  });
  describe('parseTimestamp', () => {
    const mockDateString = '2021-07-28 13:37';
    const mockDate = new Date(mockDateString);
    const mockDateTimestamp = new Date(mockDateString).getTime();
    it('parses timestamp from number', () => {
      expect(parseTimestamp(mockDateTimestamp)).toEqual(mockDateTimestamp);
    });
    it('parses timestamp from Date', () => {
      expect(parseTimestamp(mockDate)).toEqual(mockDateTimestamp);
    });
    it('parses timestamp from string', () => {
      expect(parseTimestamp(mockDateString)).toEqual(mockDateTimestamp);
    });
  });
});

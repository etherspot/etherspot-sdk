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
import { formatValue } from 'utils/format';

describe('formatValue', () => {
  it('handles default case', () => {
    expect(formatValue(BigNumber('0'))).toEqual('0');
    expect(formatValue(BigNumber('1'))).toEqual('1');
    expect(formatValue(BigNumber('1.000'))).toEqual('1');
    expect(formatValue(BigNumber('1.234'))).toEqual('1.234');
    expect(formatValue(BigNumber('1000.01'))).toEqual('1,000.01');
    expect(formatValue(BigNumber('1000200.01'))).toEqual('1,000,200.01');
  });

  it('handles decimalPlaces', () => {
    expect(formatValue(BigNumber('0'), { decimalPlaces: 3 })).toEqual('0.000');
    expect(formatValue(BigNumber('1'), { decimalPlaces: 2 })).toEqual('1.00');
    expect(formatValue(BigNumber('1.235'), { decimalPlaces: 2 })).toEqual('1.23');
    expect(formatValue(BigNumber('1000.235'), { decimalPlaces: 5 })).toEqual('1,000.23500');
  });

  it('handles decimalPlaces and strips trailing zeros', () => {
    expect(formatValue(BigNumber('0'), { decimalPlaces: 3, stripTrailingZeros: true })).toEqual('0');
    expect(formatValue(BigNumber('1'), { decimalPlaces: 2, stripTrailingZeros: true })).toEqual('1');
    expect(formatValue(BigNumber('1.235'), { decimalPlaces: 2, stripTrailingZeros: true })).toEqual('1.23');
    expect(formatValue(BigNumber('1000.235'), { decimalPlaces: 5, stripTrailingZeros: true })).toEqual('1,000.235');
  });
});

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

// constants
import { ETH } from 'constants/assetsConstants';

// utils
import { calculateETHTransactionAmountAfterFee } from 'utils/transactions';
import { mockEthAddress } from 'testUtils/jestSetup';


const mockEthBalance = (balance) => ({
  [mockEthAddress]: {
    balance,
    symbol: ETH,
    address: mockEthAddress,
  },
});

describe('transactions utils', () => {
  describe('calculateETHTransactionAmountAfterFee', () => {
    it('should return lower ETH amount when not enough balance left for fees and enough total balance', () => {
      const balances = mockEthBalance('1');
      const ethTransactionAmount = new BigNumber(1);
      const totalFeeInEth = new BigNumber(0.01);
      const calculatedEthTransactionAmountAfterFees = calculateETHTransactionAmountAfterFee(
        ethTransactionAmount,
        balances,
        totalFeeInEth,
      );
      expect(calculatedEthTransactionAmountAfterFees).toStrictEqual(new BigNumber(0.99));
      expect(calculatedEthTransactionAmountAfterFees.isPositive()).toBeTruthy();
    });
    it('should return zero ETH amount when total balance is equal to fees', () => {
      const balances = mockEthBalance('0.01');
      const ethTransactionAmount = new BigNumber(1);
      const totalFeeInEth = new BigNumber(0.01);
      const calculatedEthTransactionAmountAfterFees = calculateETHTransactionAmountAfterFee(
        ethTransactionAmount,
        balances,
        totalFeeInEth,
      );
      expect(calculatedEthTransactionAmountAfterFees).toStrictEqual(new BigNumber(0));
      expect(calculatedEthTransactionAmountAfterFees.isZero()).toBeTruthy();
      expect(calculatedEthTransactionAmountAfterFees.isPositive()).toBeTruthy();
    });
    it('should return negative ETH amount when not enough balance left for fees and not enough total balance', () => {
      const balances = mockEthBalance('0.01');
      const ethTransactionAmount = new BigNumber(1);
      const totalFeeInEth = new BigNumber(0.02);
      const calculatedEthTransactionAmountAfterFees = calculateETHTransactionAmountAfterFee(
        ethTransactionAmount,
        balances,
        totalFeeInEth,
      );
      expect(calculatedEthTransactionAmountAfterFees).toStrictEqual(new BigNumber(-0.01));
      expect(calculatedEthTransactionAmountAfterFees.isNegative()).toBeTruthy();
    });
    it('should return same ETH amount when enough balance left for fees', () => {
      const balances = mockEthBalance('1');
      const ethTransactionAmount = new BigNumber(0.97);
      const totalFeeInEth = new BigNumber(0.02);
      const calculatedEthTransactionAmountAfterFees = calculateETHTransactionAmountAfterFee(
        ethTransactionAmount,
        balances,
        totalFeeInEth,
      );
      expect(calculatedEthTransactionAmountAfterFees).toStrictEqual(ethTransactionAmount);
      expect(calculatedEthTransactionAmountAfterFees.isPositive()).toBeTruthy();
    });
  });
});

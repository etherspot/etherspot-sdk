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

// utils
import { getBalance } from 'utils/assets';
import { getAssetRateInFiat } from 'utils/rates';
import { mockEthAddress, mockPlrAddress } from 'testUtils/jestSetup';

// types
import type { WalletAssetsBalances } from 'models/Balances';
import type { RatesByAssetAddress } from 'models/Rates';

describe('Assets utils', () => {
  const ETH_GBP = 10;
  const ETH_USD = 5;
  const PLR_USD = 1.5;
  const PLR_GBP = 3;

  const mockInvalidTknAddress = '0x1';

  const rates: RatesByAssetAddress = {
    [mockEthAddress]: { GBP: ETH_GBP, USD: ETH_USD },
    [mockPlrAddress]: { GBP: PLR_GBP, USD: PLR_USD },
  };

  describe('getAssetRateInFiat', () => {
    describe('for ethereum tokens', () => {
      it('returns the rate', () => {
        const rate = getAssetRateInFiat(rates, mockPlrAddress, 'GBP');

        expect(rate).toEqual(PLR_GBP);
      });

      describe('for invalid token', () => {
        it('returns 0', () => {
          const rate = getAssetRateInFiat(rates, mockInvalidTknAddress, 'GBP');

          expect(rate).toEqual(0);
        });
      });
    });

    describe('for ETH', () => {
      it('returns the rate', () => {
        const rate = getAssetRateInFiat(rates, mockEthAddress, 'GBP');

        expect(rate).toEqual(ETH_GBP);
      });
    });
  });

  describe('getBalance', () => {
    it('returns 0 for empty balance', () => {
      const balance = getBalance({}, mockEthAddress);

      expect(balance).toEqual(0);
    });

    it('returns the balance', () => {
      const balances: WalletAssetsBalances = {
        [mockEthAddress]: { symbol: 'ETH', balance: '2.321000', address: mockEthAddress },
      };

      const balance = getBalance(balances, mockEthAddress);
      expect(balance).toEqual(2.321);
    });
  });
});

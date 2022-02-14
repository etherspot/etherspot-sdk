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
import { BigNumber } from 'ethers';

// Utils
import { wrapBigNumber } from '../utils/bigNumber';
import { valueForAddress } from '../utils/common';

// Types
import type { Value } from '../models/Value';
import type { Currency, RatesByAssetAddress } from '../models/Rates';


export const getFiatValueFromUsd = (valueInUsd: BigNumber | string, usdToFiatRate: number): BigNumber => {
  if (!valueInUsd || usdToFiatRate == null) return null;

  return wrapBigNumber(valueInUsd)?.mul(usdToFiatRate);
};

export const getAssetRateInFiat = (
  rates: RatesByAssetAddress,
  assetAddress: string,
  fiatCurrency: Currency,
): number => valueForAddress(rates, assetAddress)?.[fiatCurrency] ?? 0;

export const getAssetValueInFiat = (
  assetValue: Value,
  assetAddress: string,
  rates: RatesByAssetAddress,
  currency: Currency,
): number => {
  if (!assetValue && assetValue !== 0) return null;

  const rate = getAssetRateInFiat(rates, assetAddress, currency);
  if (!rate) return null;

  return wrapBigNumber(assetValue)?.mul(rate).toNumber();
};

export const getAssetValueFromFiat = (
  fiatValue: Value,
  assetAddress: string,
  rates: RatesByAssetAddress,
  currency: Currency,
): BigNumber => {
  if (!fiatValue && fiatValue !== 0) return null;

  const rate = getAssetRateInFiat(rates, assetAddress, currency);
  if (!rate) return null;

  return wrapBigNumber(fiatValue)?.div(rate);
};

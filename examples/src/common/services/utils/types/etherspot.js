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

import { BigNumber as EthersBigNumber } from 'ethers';
import type { AccountDashboardProtocols as EtherspotAccountDashboardProtocols } from 'etherspot';

export type PaginationResult<T = any> = {
  items?: T[];
  currentPage: number;
  nextPage: number;
}

export type PaginatedTokens = PaginationResult<TokenListToken>;

export type TokenListToken = {
  address: string,
  chainId: number,
  decimals: number,
  logoURI: string,
  name: string,
  symbol: string,
};

export type ExchangeOffer = {
  exchangeRate: number,
  provider: ExchangeProviders,
  receiveAmount: EthersBigNumber,
  transactions: TransactionData[],
};

export type ExchangeProviders = 'OneInch' | 'Synthetix' | 'Uniswap' | 'Sushiswap' | 'Honeyswap' | 'Paraswap';

export type TransactionData = {
  data?: string,
  to: string,
  value: EthersBigNumber,
};

export type GatewayEstimatedBatch = {
  createdAt: Date,
  expiredAt: Date,
  estimatedGas: number,
  estimatedGasPrice: EthersBigNumber,
  refundAmount: EthersBigNumber,
  refundTokenPayee: string,
  signature: string,
};

type EtherspotAccountTotalBalancesMetadata = {
  key: string,
  serviceTitle: string,
  title: string,
  iconUrl: string,
  address: string,
  share: number,
  value: number,
};

export type EtherspotAccountTotalBalancesItem = {
  chainId: number,
  category: EtherspotAccountDashboardProtocols,
  totalBalance: number,
  balances: EtherspotAccountTotalBalancesMetadata[],
};

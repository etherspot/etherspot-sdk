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

export type Cancellation = {
  id: string,
  recipientBalance: string,
  senderBalance: string,
  timestamp: string,
  txhash: string,
};

export type Withdrawal = {
  id: string,
  amount: string,
};

export type Token = {
  id: string,
  decimals: ?string,
  name: ?string,
  symbol: ?string,
};

export type Stream = {
  id: string,
  cancellation: ?Cancellation,
  deposit: string,
  ratePerSecond: string,
  recipient: string,
  sender: string,
  startTime: string,
  stopTime: string,
  timestamp: string,
  token: Token,
  withdrawals: Withdrawal[],
};

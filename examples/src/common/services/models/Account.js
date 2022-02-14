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

// Constants
import { ACCOUNT_TYPES } from 'constants/accountsConstants';

// Types
import type { ChainRecord } from 'models/Chain';

export type AccountTypes = $Values<typeof ACCOUNT_TYPES>;
export type EtherspotAccount = {|
  type: typeof ACCOUNT_TYPES.ETHERSPOT_SMART_WALLET,
  id: string,
  extra?: EtherspotAccountExtra,
  isActive: boolean,
|};

export type EtherspotAccountExtra = ChainRecord<{
  address: string,
  createdAt: string, // Date & time
  updatedAt: string, // Date & time
  ensNode?: { name?: string },
  state: 'Deployed' | 'UnDeployed',
  store: string,
  type: string,
}>;

export type ArchanovaAccount = {|
  type: typeof ACCOUNT_TYPES.ARCHANOVA_SMART_WALLET,
  id: string,
  extra?: ArchanovaAccountExtra,
  isActive: boolean,
|};

export type ArchanovaAccountExtra = {
  address: string,
  updatedAt: string, // Date & time
  balance: any,
  ensName?: string,
  nextState: ?any,
  state: string,
  type: ?any,
};

export type KeyBasedAccount = {|
  type: typeof ACCOUNT_TYPES.KEY_BASED,
  id: string,
  extra?: KeyBasedAccountExtra,
  isActive: boolean,
|};

export type KeyBasedAccountExtra = {||};

export type Account = EtherspotAccount | ArchanovaAccount | KeyBasedAccount;

export type AccountRecord<T> = { [accountId: string]: T };

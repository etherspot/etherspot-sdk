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

export const UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS';
export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export namespace ACCOUNT_TYPES  {
  export const KEY_BASED = 'KEY_BASED';
  export const ARCHANOVA_SMART_WALLET= 'SMART_WALLET'; // actual value is different for safe deprecate reason
  export const ETHERSPOT_SMART_WALLET= 'ETHERSPOT_SMART_WALLET';
};

export type ACCOUNT_TYPES = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];
export const CHANGING_ACCOUNT = 'CHANGING_ACCOUNT';

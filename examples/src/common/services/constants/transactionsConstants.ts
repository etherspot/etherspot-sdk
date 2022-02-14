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

export namespace TRANSACTION_TYPE  {
  export const EXCHANGE = 'EXCHANGE';
};

export namespace ERC721_TRANSFER_METHODS  {
  export const TRANSFER = 'transfer';
  export const TRANSFER_FROM = 'transferFrom';
  export const SAFE_TRANSFER_FROM = 'safeTransferFrom';
};

export type ERC721_TRANSFER_METHODS = typeof ERC721_TRANSFER_METHODS[keyof typeof ERC721_TRANSFER_METHODS];

// export const ERC721_TRANSFER_METHODS = {
//    TRANSFER : 'transfer',
//   TRANSFER_FROM : 'transferFrom',
//   SAFE_TRANSFER_FROM : 'safeTransferFrom',
// };

export const AAVE_LENDING_DEPOSIT_TRANSACTION = 'AAVE_LENDING_DEPOSIT_TRANSACTION';
export const AAVE_LENDING_WITHDRAW_TRANSACTION = 'AAVE_LENDING_WITHDRAW_TRANSACTION';

export const ERROR_TYPE = {
  CANT_BE_TRANSFERRED: 'can not be transferred',
  NOT_OWNED: 'is not owned',
  TRANSACTION_UNDERPRISED: 'transaction underpriced',
  REPLACEMENT_TRANSACTION_UNDERPRISED: 'replacement transaction underpriced',
};

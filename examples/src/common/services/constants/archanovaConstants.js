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
import { sdkConstants } from '@smartwallet/sdk';

export const RESET_ARCHANOVA_WALLET = 'RESET_ARCHANOVA_WALLET';
export const SET_ARCHANOVA_SDK_INIT = 'SET_ARCHANOVA_SDK_INIT';
export const SET_ARCHANOVA_WALLET_ACCOUNTS = 'SET_ARCHANOVA_WALLET_ACCOUNTS';
export const SET_ARCHANOVA_WALLET_CONNECTED_ACCOUNT = 'SET_ARCHANOVA_WALLET_CONNECTED_ACCOUNT';
export const SET_ARCHANOVA_WALLET_ACCOUNT_ENS = 'SET_ARCHANOVA_WALLET_ACCOUNT_ENS';
export const SET_ARCHANOVA_WALLET_UPGRADE_STATUS = 'SET_ARCHANOVA_WALLET_UPGRADE_STATUS';
export const SET_ARCHANOVA_WALLET_DEPLOYMENT_DATA = 'SET_ARCHANOVA_WALLET_DEPLOYMENT_DATA';
export const SET_ARCHANOVA_WALLET_LAST_SYNCED_PAYMENT_ID = 'SET_ARCHANOVA_WALLET_LAST_SYNCED_PAYMENT_ID';
export const SET_ARCHANOVA_WALLET_LAST_SYNCED_TRANSACTION_ID = 'SET_ARCHANOVA_WALLET_LAST_SYNCED_TRANSACTION_ID';
export const START_ARCHANOVA_WALLET_DEPLOYMENT = 'START_ARCHANOVA_WALLET_DEPLOYMENT';
export const RESET_ARCHANOVA_WALLET_DEPLOYMENT = 'RESET_ARCHANOVA_WALLET_DEPLOYMENT';
export const ARCHANOVA_WALLET_UPGRADE_STATUSES = {
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  DEPLOYMENT_COMPLETE: 'DEPLOYMENT_COMPLETE',
  DEPLOYING: 'DEPLOYING',
};
export const ARCHANOVA_WALLET_DEPLOYMENT_ERRORS = {
  SDK_ERROR: 'SDK_ERROR',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  REVERTED: 'REVERTED',
};
export const ARCHANOVA_PPN_PAYMENT_COMPLETED = sdkConstants?.AccountPaymentStates?.Completed ?? '';
export const ARCHANOVA_PPN_PAYMENT_PROCESSED = sdkConstants?.AccountPaymentStates?.Processed ?? '';
export const SET_ARCHANOVA_WALLET_DEPLOYMENT_ESTIMATE = 'SET_ARCHANOVA_WALLET_DEPLOYMENT_ESTIMATE';
export const SET_GETTING_ARCHANOVA_WALLET_DEPLOYMENT_ESTIMATE = 'SET_GETTING_ARCHANOVA_WALLET_DEPLOYMENT_ESTIMATE';
export const SET_CHECKING_ARCHANOVA_SESSION = 'SET_CHECKING_ARCHANOVA_SESSION';
export const ARCHANOVA_WALLET_ASSET_MIGRATION = 'ARCHANOVA_WALLET_ASSET_MIGRATION';
export const ARCHANOVA_WALLET_ENS_MIGRATION = 'ARCHANOVA_WALLET_ENS_MIGRATION';
export const ARCHANOVA_ENS_TRANSFER_METHOD_HASH = 'c7e7cea1'; // transferENSNode(address,address,bytes32,bytes)

// transaction tag constants: leave VALUES with SMART_WALLET
export const ARCHANOVA_WALLET_SWITCH_TO_GAS_TOKEN_RELAYER = 'SMART_WALLET_SWITCH_TO_GAS_TOKEN_RELAYER';
export const ARCHANOVA_WALLET_ACCOUNT_DEVICE_ADDED = 'SMART_WALLET_ACCOUNT_DEVICE_ADDED';
export const ARCHANOVA_WALLET_ACCOUNT_DEVICE_REMOVED = 'SMART_WALLET_ACCOUNT_DEVICE_REMOVED';


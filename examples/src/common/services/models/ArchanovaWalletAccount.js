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
import { sdkInterfaces } from '@smartwallet/sdk';
import { ARCHANOVA_WALLET_DEPLOYMENT_ERRORS } from 'constants/archanovaConstants';

export type ArchanovaWalletAccount = sdkInterfaces.IAccount;

export type ArchanovaWalletAccountDevice = sdkInterfaces.IAccountDevice;

export type ConnectedArchanovaWalletAccount = {
  ...ArchanovaWalletAccount,
  activeDeviceAddress: ?string,
  devices: ?ArchanovaWalletAccountDevice[],
};


export type ArchanovaWalletDeploymentError = $Keys<typeof ARCHANOVA_WALLET_DEPLOYMENT_ERRORS>;

export type InitArchanovaProps = {
  privateKey?: string,
  pin?: string,
}

export type ArchanovaAccountDevice = {
  device: {
    address: string,
    version: ?number,
  },
  type: string,
  state: string,
  nextState: ?string,
  features: {},
  updatedAt: Date,
};

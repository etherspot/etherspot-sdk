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
// $FlowIgnore
/* eslint-disable */
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Class RCTCxxModule',
  'Module RNRandomBytes',
  'Module RNOS',
  'Module RNFetchBlob',
  'Class EX',
  'Unrecognized WebSocket connection option(s)', // TODO: try removing after moving exchange to websocket transport
  'Setting a timer', // TODO: this is coming from ethers.js lib, periodically check whether we can already remove this
  'Warning: componentWillReceiveProps has been renamed',
  'Warning: componentWillMount has been renamed',
  'web3-bzz package will be deprecated',
  'web3-shh package will be deprecated',
]);
import '@ethersproject/shims';
import 'utils/shim';
import 'crypto';

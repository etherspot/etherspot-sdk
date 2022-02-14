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
export const ADD_WALLETCONNECT_CALL_REQUEST = 'ADD_WALLETCONNECT_CALL_REQUEST';
export const REMOVE_WALLETCONNECT_CALL_REQUEST = 'REMOVE_WALLETCONNECT_CALL_REQUEST';

export const SET_WALLETCONNECT_CONNECTOR_REQUEST = 'SET_WALLETCONNECT_CONNECTOR_REQUEST';
export const RESET_WALLETCONNECT_CONNECTOR_REQUEST = 'RESET_WALLETCONNECT_CONNECTOR_REQUEST';

export const ADD_WALLETCONNECT_ACTIVE_CONNECTOR = 'ADD_WALLETCONNECT_ACTIVE_CONNECTOR';
export const REMOVE_WALLETCONNECT_ACTIVE_CONNECTOR = 'REMOVE_WALLETCONNECT_ACTIVE_CONNECTOR';
export const RESET_WALLETCONNECT_ACTIVE_CONNECTORS = 'RESET_WALLETCONNECT_ACTIVE_CONNECTORS';

export const SET_WALLETCONNECT_REQUEST_ERROR = 'SET_WALLETCONNECT_REQUEST_ERROR';

export const WALLETCONNECT_EVENT = {
  SESSION_REQUEST: 'session_request',
  SESSION_UPDATE: 'session_update',
  CALL_REQUEST: 'call_request',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  TRANSPORT_ERROR: 'transport_error', // websocket connection lost
};

export const PERSONAL_SIGN = 'personal_sign';
export const ETH_SIGN = 'eth_sign';
export const ETH_SEND_TX = 'eth_sendTransaction';
export const ETH_SIGN_TX = 'eth_signTransaction';
export const ETH_SIGN_TYPED_DATA = 'eth_signTypedData';
export const ETH_SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4';

export const REQUEST_TYPE = {
  MESSAGE: ('message': 'message'),
  TRANSACTION: ('transaction': 'transaction'),
  UNSUPPORTED: ('unsupported': 'unsupported'),
};

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
import urlTools from 'url';
import isEmpty from 'lodash.isempty';

const allowedDeepLinkProtocols = ['pillarwallet:', 'wc:']; // eslint-disable-line i18next/no-literal-string

type ParsedDeepLink = {
  action?: string,
  query?: Object,
  protocol?: string,
}

export const validateDeepLink = (url: string): ParsedDeepLink => {
  if (!url || typeof url !== 'string') return {};
  const params = urlTools.parse(url, true);
  if (isEmpty(params)) return {};
  const { protocol } = params;
  if (!allowedDeepLinkProtocols.includes(protocol)) return {};
  const { host: action, query = {} } = params;
  // $FlowFixMe: flow update to 0.122
  return { action, query, protocol };
};

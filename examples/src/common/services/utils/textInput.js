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

import { appFont, fontSizes, lineHeights } from 'utils/variables';

const isMatchingSearch = (query, text) => query && text && text.toUpperCase().includes(query.toUpperCase());

const isCaseInsensitiveMatch = (query, text) => query && text && text.toLowerCase() === query.toLowerCase();

export const resolveAssetSource = (uri: ?(string | number)) => {
  if (!uri) return { uri: null };
  if (typeof uri === 'number') return uri;
  return { uri };
};

// filter by search query and sort exact matches (case insensitve) first (-1) or keep existing order (0)
export const getMatchingSortedData: (data: Object[], query: ?string) => Object[] = (data, query) => data
  .filter(({ value: val, name }) => isMatchingSearch(query, val) || isMatchingSearch(query, name))
  .sort(
    ({ value: val, name }) => isCaseInsensitiveMatch(query, val) || isCaseInsensitiveMatch(query, name) ? -1 : 0,
  );

export const getFontSize = (value: ?string | number, numeric?: boolean) => {
  if (numeric) return fontSizes.large;
  if (value || value === 0) return fontSizes.medium;
  return fontSizes.regular;
};

export const getLineHeight = (value: ?string | number, numeric?: boolean) => {
  if (numeric) return lineHeights.large;
  if (value || value === 0) return lineHeights.medium;
  return lineHeights.regular;
};

export const getFontFamily = (value: ?string | number, numeric?: boolean) => {
  if (!(value || value === 0) || numeric) return appFont.medium;
  return appFont.regular;
};

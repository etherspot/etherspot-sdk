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

import { mapNotNil } from 'utils/array';

/**
 * Simple utility function for parsing external JSON content (e.g. API calls response or CMS data);
 */

export function stringOrNull(input: ?any): ?string {
  return typeof input === 'string' ? input : null;
}

export function numberOrNull(input: ?any): ?number {
  if (typeof input === 'number') return input;

  if (typeof input === 'string') {
    const value = parseFloat(input);
    return !Number.isNaN(value) ? value : null;
  }

  return null;
}

export function booleanOrNull(input: ?any): ?boolean {
  return typeof input === 'boolean' ? input : null;
}

export function mapArrayOrEmpty<Input, Value>(input: ?Input[], parseItem: (Input) => ?Value): Value[] {
  if (!input || !Array.isArray(input)) return [];
  return mapNotNil(input, parseItem);
}

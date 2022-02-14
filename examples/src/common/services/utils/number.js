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

import { type Record, recordValues } from 'utils/object';

/**
 * Returns sum of nullabe numbers.
 *
 * It returns 0 when input is empty or contain only nulls.
 */
export function sum(values: (?number)[]): number {
  return values.reduce((total, value) => total + (value || 0), 0);
}

export function sumBy<Element>(
  elements: Element[] | Record<Element>,
  valueSelector: (element: Element) => ?number,
): number {
  if (!Array.isArray(elements)) {
    elements = recordValues(elements);
  }

  return sum(elements.map(valueSelector));
}

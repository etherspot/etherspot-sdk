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

/**
 * Performs map operation and filters out `null` and `undefined` results.
 */
export function mapNotNil<Item, Result>(items: Item[], selector: (Item, number, Item[]) => ?Result): Result[] {
  // $FlowFixMe: does not infer that `filter` removes nil values
  return items.map((item, index, array) => selector(item, index, array)).filter((item) => item != null);
}

/**
 * Type-safe version of `filter(Boolean)`
 */
export function compactFalsy<Item>(items: (?Item | false)[]): Item[] {
  // $FlowFixMe: flow cannot infer filtering behavior.
  return items.filter(Boolean);
}

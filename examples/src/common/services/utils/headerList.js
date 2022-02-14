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

import { groupBy } from 'lodash';

/**
 * Utilities for working with mixed list of items & headers. Useful when working with
 * SectionList and having 2-level of headers.
 */

type KeyedItem = { key: string };

/**
 * Special list item type holding either regular item or header item.
 */
export type HeaderListItem<Item: KeyedItem> = RegularItem<Item> | HeaderItem<Item>;

type RegularItem<Item> = {| type: 'item', key: string, item: Item |};
type HeaderItem<Item> = {| type: 'header', key: string, items: Item[] |};

/**
 * Transform list of items, by grouping them using `groupKey` selector.
 */
export function prepareHeaderListItems<Item: KeyedItem>(
  items: Item[],
  groupKey: (Item) => string,
): HeaderListItem<Item>[] {
  const groups = groupBy(items, groupKey);
  return Object.keys(groups).flatMap((key) => {
    const headerItem = { type: 'header', key, items: groups[key] };
    const regularItems = groups[key].map((item) => ({ type: 'item', key: item.key, item }));
    return [headerItem, ...regularItems];
  });
}


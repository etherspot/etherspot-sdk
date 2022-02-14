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

import { orderBy } from 'lodash';

// Utils
import { addressesEqual } from 'utils/assets';
import { addressAsKey } from 'utils/common';
import { caseInsensitiveIncludes } from 'utils/strings';

// Types
import type { Collectible } from 'models/Collectible';

/**
 * Build a string key that uniquely identifies a given collectible.
 */
export function buildCollectibleKey(contractAddress: string, id: string) {
  return `${addressAsKey(contractAddress)}-${id}`;
}

export function getCollectibleKey(collectible: ?Collectible) {
  if (!collectible) return '';
  return buildCollectibleKey(collectible.contractAddress, collectible.id);
}

export function defaultSortCollectibles(collectibles: Collectible[]): Collectible[] {
  return orderBy(collectibles, [({ name }) => name?.trim().toLowerCase()], ['asc']);
}

export function isCollectibleMatchedByQuery(collectible: Collectible, query: ?string): boolean {
  if (!query) return true;
  return caseInsensitiveIncludes(collectible.name, query);
}

export function findCollectible(
  collectibles: ?(Collectible[]),
  contractAddressToFind: string,
  idToFind: string,
): ?Collectible {
  return collectibles?.find(
    ({ contractAddress, id }) => addressesEqual(contractAddress, contractAddressToFind) && id === idToFind,
  );
}

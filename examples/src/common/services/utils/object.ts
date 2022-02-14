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

import { omitBy, isNil } from 'lodash';

export type Record<Value> = { [key:string]: Value };

/**
 * Simple way to build record from array.
 */
export function buildRecord<Element, Value>(
  elements: Element[],
  keySelector: (element: Element) => string,
  valueSelector: (element: Element, key: string) => Value,
): Record<Value> {
  const result = {};
  elements.forEach(element => {
    const key = keySelector(element);
    result[key] = valueSelector(element, key);
  });

  return result;
}

/**
 * Properly typed version of `Object.values`.
 */
export function recordValues<Value>(record: Record<Value>): Value[] {
  if (!record) return [];
  return Object.keys(record).map((key) => record[key]);
}

/**
 * Improved version of lodash mapKeys.
 * Supports flow typing as well as key filtering when new key maps to null or undefined.
 */
export function mapRecordKeys<Value>(
  record: Record<Value>,
  keySelector: (key: string, value: Value) => string,
): Record<Value> {
  const result = {};
  Object.keys(record).forEach((oldKey) => {
    const newKey = keySelector(oldKey, record[oldKey]);
    if (newKey != null) {
      result[newKey] = record[oldKey];
    }
  });

  return result;
}

/**
 * Improved version of lodash mapValue.
 * Supports flow typing.
 */
export function mapRecordValues<Value, Target>(
  record: Record<Value>,
  valueSelector: (value: Value, key: string) => Target,
): Record<Target> {
  const result = {};
  Object.keys(record).forEach((key) => {
    result[key] = valueSelector(record[key], key);
  });

  return result;
}


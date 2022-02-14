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
import * as React from 'react';
import { Dimensions, Platform, PixelRatio, View } from 'react-native';
import type { Measurements } from 'reducers/walkthroughsReducer';

const {
  width: SCREEN_WIDTH,
} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export const isColorDark = (color: string) => {
  let r;
  let g;
  let b;

  if (color.match(/^rgb/)) {
    const colorArray = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/) || [];
    const rgbColours = colorArray.shift();
    [r, g, b] = rgbColours;
  } else {
    /* eslint-disable i18next/no-literal-string */
    let updColor = `0x${color.replace('#', '')}`;
    if (color.length < 5) {
      updColor = `0x${color.replace('#', '').replace(/./g, '$&$&')}`;
    }
    /* eslint-enable i18next/no-literal-string */

    /* eslint-disable */
    const colorBitwise = +(updColor);
    r = colorBitwise >> 16;
    g = (colorBitwise >> 8) & 255;
    b = colorBitwise & 255;
    /* eslint-enable */
  }

  const rInt = parseInt(r, 10);
  const gInt = parseInt(g, 10);
  const bInt = parseInt(b, 10);

  const hsp = Math.sqrt((0.299 * (rInt * rInt)) + (0.587 * (gInt * gInt)) + (0.114 * (bInt * bInt)));

  return hsp < 127.5;
};

export function responsiveSize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') return Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}

export function hexToRgba(hex: string, opacity: ?number) {
  const op = !!opacity && (opacity <= 1 || opacity > 0) ? opacity.toString() : '1';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${op})`
    : null;
}

export const measure = (ref: React.ElementRef<typeof View>): Promise<Measurements> =>
  new Promise(resolve => ref.measureInWindow((x, y, w, h) => resolve({
    x, y, w, h,
  })));

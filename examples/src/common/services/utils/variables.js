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
/* eslint-disable i18next/no-literal-string */

import { responsiveSize } from 'utils/ui';

export const baseColors = {
  sunYellow: '#f8e71c',
  burningFire: '#F56C07',
  periwinkle: '#9191ff',
  fireEngineRed: '#ff0005',
  warmPurple: '#b2329c',
  brightPurple: '#4f1a91',
  electricBlue: '#007AFF',
  duckEggBlue: '#e6eefa',
  selago: '#f6fafe',
  hawkesBlue: '#f0f7fe',
  brightSkyBlue: '#00bfff',
  pigeonPost: '#9fb7db',
  cyan: '#00bfff',
  aquaMarine: '#50e3c2',
  freshEucalyptus: '#2AA057',
  snowWhite: '#fafafa',
  lightGray: '#f5f5f5',
  whiteSmoke: '#f7f7f7',
  whiterSmoke: '#f2f2f2',
  lighterGray: '#fafafa',
  mediumGray: '#C6CACD',
  mediumLightGray: '#EDEDED',
  darkGray: '#8B939E',
  coolGrey: '#8b939e',
  slateBlack: '#0A1427',
  lightGreen: '#82bc40',
  jadeGreen: '#2aa157',
  clearBlue: '#2077fd',
  offBlue: '#5983b0',
  white: '#ffffff',
  black: '#000000',
  vividOrange: '#ffc021',
  brightBlue: '#2f86eb',
  limeGreen: '#47d764',
  lightYellow: '#feffe0',
  gallery: '#efefef',
  veryLightBlue: '#e0edff',
  dawnPink: '#f2eae4',
  rose: '#f5078d',
  cerulean: '#07b0f5',
  beige: '#f7f7df',
  coconutCream: '#e3e3bd',
  pineGlade: '#b3b375',
  mantis: '#85bb4c',
  oliveDrab: '#5e9226',
  alabaster: '#fcfcfc',
  aliceBlue: '#f7fbff',
  manatee: '#a3a9b2',
  blanchedAlmond: '#ffe8ce',
  geyser: '#d1d7dd',
  fairPink: '#f7ebe6',
  tumbleweed: '#db9a84',
  pattensBlue: '#F0F5FA',
  shark: '#292c33',
  caribbeanGreen: '#4cf18b',
  royalBlue: '#3b7af2',
  blumine: '#275692',
  emerald: '#3dd276',
  greyser: '#d1d9e4',
  midnight: '#222e44',
  eucalypus: '#2aa057',
  tropicalBlue: '#CAE1F8',
  zumthor: '#EBF5FF',
  fruitSalad: '#459d53',
  lavenderBlue: '#c3e0ff',
  hoki: '#647fa4',
  deepSkyBlue: '#01BFFF',
  ultramarine: '#0a0c78',
  toryBlue: '#2f3195',
  blueViolet: '#b233e4',
  jellyBean: '#497391',
  aluminium: '#a9aeb8',
  danube: '#5e8fcc',
  patternsBlue: '#f4f7fb',
  spindle: '#b5d0ee',
  pomegranate: '#f33726',
  quartz: '#d9e3f5',
  lavender: '#ebebfc',
  shipCove: '#8798c2',
  blueYonder: '#818eb3',
  zircon: '#f3f7ff',
  malibu: '#58a7ff',
  redDamask: '#ca674c',
  dodgerBlue: '#007aff',
  indianRed: '#cb6262',
  pinkishGrey: '#cacaca',
  solitude: '#ebeff2',
  persianBlue: '#1D24D8',
  pastelGreen: '#77D16D',
  dell: '#467038',
  stratos: '#000260',
  rockBlue: '#8e8fb8',
  scarlet: '#FD3300',
  tomato: '#F9584F',
  neonBlue: '#3C71FF',
  darkOrange: '#ff8d04',
  chestnutRose: '#cb4c4c',
  darkBlue: '#02050d',
  desaturatedDarkBlue: '#62688f',
  electricViolet: '#7501D9',
};

export const brandColors = [
  baseColors.periwinkle,
  baseColors.sunYellow,
  baseColors.burningFire,
  baseColors.brightSkyBlue,
  baseColors.aquaMarine,
];

export const UIColors = {
  primary: baseColors.electricBlue,
  danger: baseColors.burningFire,
  disabled: baseColors.mediumGray,
  defaultHeaderColor: baseColors.white,
  defaultInputBackgroundColor: baseColors.white,
  defaultTextColor: baseColors.slateBlack,
  defaultNavigationColor: baseColors.slateBlack,
  defaultBackgroundColor: baseColors.snowWhite,
  defaultBorderColor: 'rgba(0, 0, 0, 0.085)',
  focusedBorderColor: baseColors.electricBlue,
  defaultShadowColor: 'rgba(0, 0, 0, 0.25)',
  tabShadowColor: 'rgba(128, 128, 128, 0.2)',
  placeholderTextColor: baseColors.darkGray,
  cardShadowColor: '#EEF3F9',
  actionButtonShadowColor: 'rgba(18, 63, 111, 0.1)',
  defaultDividerColor: baseColors.mediumLightGray,
  actionButtonBorderColor: 'rgba(255, 255, 255, 0.37)',
  headerContentBorder: 'rgba(255, 255, 255, 0.1)',
  listDivider: 'rgba(25, 16, 91, 0.05)',
  headerButtonBorder: 'rgba(0, 122, 255, 0.05)',
  darkShadowColor: 'rgba(6, 15, 30, 0.8)',
  tooltipBackground: '#060f1ecc',
};

export const fontSizes = {
  tiny: 10,
  small: 12,
  regular: 14,
  medium: 16,
  big: 18,
  large: 24,
  giant: 36,
  jumbo: 52,
  rSmall: responsiveSize(12),
  rRegular: responsiveSize(14),
  rBig: responsiveSize(18),
  rLarge: responsiveSize(24),
  rGiant: responsiveSize(56),
  rJumbo: responsiveSize(64),
};

export const lineHeights = {
  tiny: 14,
  small: 18,
  regular: 22,
  medium: 24,
  big: 28,
  large: 38,
  giant: 54,
  rSmall: responsiveSize(18),
  rRegular: responsiveSize(22),
  rBig: responsiveSize(28),
  rLarge: responsiveSize(38),
  rGiant: responsiveSize(64),
  rJumbo: responsiveSize(74),
};

export const fontStyles = {
  tiny: `font-size: ${fontSizes.tiny}px; line-height: ${lineHeights.tiny}px;`,
  small: `font-size: ${fontSizes.small}px; line-height: ${lineHeights.small}px;`,
  regular: `font-size: ${fontSizes.regular}px; line-height: ${lineHeights.regular}px;`,
  medium: `font-size: ${fontSizes.medium}px; line-height: ${lineHeights.medium}px;`,
  big: `font-size: ${fontSizes.big}px; line-height: ${lineHeights.big}px;`,
  large: `font-size: ${fontSizes.large}px; line-height: ${lineHeights.large}px;`,
  giant: `font-size: ${fontSizes.giant}px; line-height: ${lineHeights.giant}px;`,
  rSmall: `font-size: ${fontSizes.rSmall}px; line-height: ${lineHeights.rSmall}px;`,
  rRegular: `font-size: ${fontSizes.rRegular}px; line-height: ${lineHeights.rRegular}px;`,
  rBig: `font-size: ${fontSizes.rBig}px; line-height: ${lineHeights.rBig}px;`,
  rLarge: `font-size: ${fontSizes.rLarge}px; line-height: ${lineHeights.rLarge}px;`,
  rGiant: `font-size: ${fontSizes.rGiant}px; line-height: ${lineHeights.rGiant}px;`,
  rJumbo: `font-size: ${fontSizes.rJumbo}px; line-height: ${lineHeights.rJumbo}px;`,
};

export const objectFontStyles = {
  tiny: { fontSize: fontSizes.tiny, lineHeight: lineHeights.tiny },
  small: { fontSize: fontSizes.small, lineHeight: lineHeights.small },
  regular: { fontSize: fontSizes.regular, lineHeight: lineHeights.regular },
  medium: { fontSize: fontSizes.medium, lineHeight: lineHeights.medium },
  big: { fontSize: fontSizes.big, lineHeight: lineHeights.big },
  large: { fontSize: fontSizes.large, lineHeight: lineHeights.large },
  giant: { fontSize: fontSizes.giant, lineHeight: lineHeights.giant },
  rSmall: { fontSize: fontSizes.rSmall, lineHeight: lineHeights.rSmall },
  rRegular: { fontSize: fontSizes.rRegular, lineHeight: lineHeights.rRegular },
  rBig: { fontSize: fontSizes.rBig, lineHeight: lineHeights.rBig },
  rLarge: { fontSize: fontSizes.rLarge, lineHeight: lineHeights.rLarge },
  rGiant: { fontSize: fontSizes.rGiant, lineHeight: lineHeights.rGiant },
  rJumbo: { fontSize: fontSizes.rJumbo, lineHeight: lineHeights.rJumbo },
};

export const spacing = {
  rhythm: 20,
  extraSmall: 4,
  small: 8,
  medium: 12,
  mediumLarge: 16,
  large: 20,
  largePlus: 24,
  extraLarge: 32,
  layoutSides: 16,
  extraPlusLarge: 56,
};

export const itemSizes = {
  avatarCircleSmall: 44,
  avatarCircleMedium: 54,
};

export const fontTrackings = {
  tiny: 0.1,
  small: 0.2,
  medium: 0.3,
  mediumLarge: 0.4,
  large: 0.5,
};

export const appFont = {
  regular: 'EuclidCircularB-Regular',
  medium: 'EuclidCircularB-Medium',
  bold: 'EuclidCircularB-Bold',
  light: 'EuclidCircularB-Light',

  // When designs specify Archia-Medium use this replacement font
  archiaMedium: 'SpaceGrotesk-Medium',
};

export const borderRadiusSizes = {
  defaultContainer: 22.5,
  defaultButton: 14,
  small: 16,
  mediumSmall: 20,
  medium: 24,
};

export const shadowColors = {
  black: '#000',
};

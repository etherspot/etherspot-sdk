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

import { Trans } from 'react-i18next';

export type I18n = {
  language: string,
};

export type TranslationOptions = {
  exclamation?: boolean,
  questionMark?: boolean,
  suffix?: string,
  prefix?: string,
  capitalize?: boolean,
  linkedText?: string,
  primaryText?: string,
  mediumText?: boolean,
  onPress?: () => void,
};

export type TranslationResource = {
  [key: string]: string,
};

export type TranslationResourcesOfLanguage = {
  [ns: string]: TranslationResource,
}

export type TranslationData = {|
  ns: string,
  url: string,
|};

export type LocalisationOptions = {
  activeLngCode: ?string,
};

export type TranslatedString = string | Trans;

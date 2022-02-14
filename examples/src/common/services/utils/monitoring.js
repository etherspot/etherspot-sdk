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

import Instabug, { NetworkLogger } from 'instabug-reactnative';

import { getEnv } from 'configs/envConfig';
import { DARK_THEME } from 'constants/appSettingsConstants';

import type { ElementRef } from 'react';

export const initInstabug = () => {
  Instabug.startWithToken(getEnv().INSTABUG_TOKEN, [Instabug.invocationEvent.none]);

  // Temporary workaround: In dev mode, the app crashes while loading
  // the home screen if network logging is enabled.
  if (__DEV__) {
    NetworkLogger.setEnabled(false);
  }
};

export const excludeFromMonitoring = (element: ElementRef<any> | null) => {
  if (element !== null) Instabug.setPrivateView(element);
};

export const setInstabugTheme = (appThemeName: string) => {
  const instabugTheme = appThemeName === DARK_THEME ? Instabug.colorTheme.dark : Instabug.colorTheme.light;

  if (instabugTheme) {
    Instabug.setColorTheme(instabugTheme);
  }
};

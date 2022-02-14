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

import InAppBrowser from 'react-native-inappbrowser-reborn';
import { reportOrWarn } from 'utils/common';
import t from 'translations/translate';

import type { InAppBrowserOptions } from 'react-native-inappbrowser-reborn';

// Components
import Toast from 'components/Toast';

// NOTE: On Android devices, for react-native-inappbrowser-reborn to work there
// needs to be an application that supports Custom Tabs. Otherwise,
// InAppBrowser.isAvailable method should return false. However, the current
// release (3.4.0) doesn't include this check, which results in the app
// crashing after calling inAppBrowser.open.
//
// For testing, uninstall or disable Chrome and any other browsers.
//
// see: https://github.com/proyecto26/react-native-inappbrowser/pull/108

export const openInAppBrowser = async (url: string, options?: InAppBrowserOptions) => {
  if (await InAppBrowser.isAvailable()) {
    return InAppBrowser
      .open(url, options)
      .catch(error => {
        reportOrWarn('InAppBrowser.error', error, 'error');
        throw error;
      });
  }

  reportOrWarn('InAppBrowser.isAvailable() returned false', null, 'warning');
  throw new Error('InAppBrowser.isAvailable() returned false');
};

export const openUrl = async (url: string | null) => {
  if (url) {
    await openInAppBrowser(url).catch(showServiceLaunchErrorToast);
  } else {
    showServiceLaunchErrorToast();
  }
};

export const showServiceLaunchErrorToast = () => {
  Toast.show({
    message: t('toast.serviceLaunchFailed'),
    emoji: 'hushed',
    supportLink: true,
  });
};

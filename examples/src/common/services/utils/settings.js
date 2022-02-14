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

import * as Keychain from 'react-native-keychain';
import t from 'translations/translate';


export const getBiometryType = (biometryType?: string) => {
  switch (biometryType) {
    case Keychain.BIOMETRY_TYPE.TOUCH_ID:
      return t('auth:biometryType.touchId');
    case Keychain.BIOMETRY_TYPE.FACE_ID:
      return t('auth:biometryType.faceId');
    case Keychain.BIOMETRY_TYPE.FINGERPRINT:
      /**
       * for Android it always return "fingerprint" even though face unlock is available (Android 10)
       * TODO: check constantly for lib updates to update this
       */
      return t('auth:biometryType.androidBiometricUnlock');
    default:
      return t('auth:biometryType.genericBiometricLogin');
  }
};

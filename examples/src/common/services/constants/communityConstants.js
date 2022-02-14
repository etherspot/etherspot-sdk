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

import { Platform } from 'react-native';

export const TWITTER_SOCIAL_ADDRESS = {
  web: 'https://twitter.com/PillarWallet',
  app: 'twitter://user?screen_name=PillarWallet',
};

export const TELEGRAM_SOCIAL_ADDRESS = {
  web: 'https://t.me/pillarofficial',
};

export const YOUTUBE_SOCIAL_ADDRESS = {
  web: 'https://www.youtube.com/c/PillarProject',
};

export const MEDIUM_SOCIAL_ADDRESS = {
  web: 'https://medium.com/pillarproject',
};

export const FACEBOOK_SOCIAL_ADDRESS = {
  web: 'https://facebook.com/pillarproject/',
  app: Platform.select({
    android: 'fb://page/277505029373839',
    ios: 'fb://profile/277505029373839',
  }),
};

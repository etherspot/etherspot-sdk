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

import RNFetchBlob from 'rn-fetch-blob';
import { printLog } from 'utils/common';
import type { TranslationData } from 'models/Translations';
import type { CachedUrls } from 'reducers/cacheReducer';

export const getCachedJSONFile = async (localPath: string) => {
  return new Promise(resolve => {
    let data = '';
    RNFetchBlob.fs.readStream(
      localPath,
      'utf8',
    )
      .then((stream) => {
        stream.open();
        stream.onData((chunk) => {
          data += chunk;
        });
        stream.onError((error) => {
          printLog('Could not read local file', localPath, error);
          resolve({});
        });
        stream.onEnd(() => {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        });
      })
      .catch(() => resolve(null));
  });
};

export const getCachedTranslationResources = async (
  translationsData: TranslationData[],
  cachedUrls: CachedUrls,
  onNoTranslations: (url: string) => void,
  onError: (e: Object) => void) => {
  const cachedTranslations = await Promise.all(translationsData.map(async ({ ns, url }) => {
    const { localPath } = cachedUrls?.[url] || {};

    if (!localPath) return { ns, translations: {} };

    const translations = await getCachedJSONFile(localPath);

    if (!translations) {
      if (onNoTranslations) onNoTranslations(url);
      return { ns, translations: {} };
    }
    return { ns, translations };
  })).catch((e) => {
    if (onError) onError(e);
    return [];
  });

  return cachedTranslations.reduce((formattedResources, translation) => {
    const { ns, translations } = translation;
    if (ns && translations) formattedResources[ns] = translations;
    return formattedResources;
  }, {});
};

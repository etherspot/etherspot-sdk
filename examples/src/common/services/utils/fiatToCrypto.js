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

import querystring from 'querystring';
import WertWidget from '@wert-io/widget-initializer';

// Services
import { firebaseRemoteConfig } from 'services/firebase';

// Constants
import { REMOTE_CONFIG } from 'constants/remoteConfigConstants';

// Config
import { getEnv } from 'configs/envConfig';
import { ARCHANOVA_RAMP_CURRENCY_TOKENS, ETHERSPOT_RAMP_CURRENCY_TOKENS } from 'configs/rampConfig';
import { CONTAINER_ID, ORIGIN } from 'configs/wertConfig';

const PILLAR = 'Pillar';

export function rampWidgetUrl(
  address: string,
  fiatCurrency: string,
  fiatValue: string,
  isEtherspotAccount: boolean,
) {
  const params = {
    hostAppName: PILLAR,
    fiatCurrency,
    fiatValue,
    hostApiKey: getEnv().RAMPNETWORK_API_KEY,
    userAddress: address,
    swapAsset: isEtherspotAccount ? ETHERSPOT_RAMP_CURRENCY_TOKENS.join(',') : ARCHANOVA_RAMP_CURRENCY_TOKENS,
  };

  return `${getEnv().RAMPNETWORK_WIDGET_URL}?${querystring.stringify(params)}`;
}

export function wertWidgetUrl(
  address: string,
  fiatValue: string,
) {
  const wertWidget = new WertWidget({
    partner_id: getEnv().WERT_ID,
    container_id: CONTAINER_ID,
    origin: ORIGIN,
    commodities: firebaseRemoteConfig.getString(REMOTE_CONFIG.FEATURE_WERT_COMMODITIES),
    currency: firebaseRemoteConfig.getString(REMOTE_CONFIG.FEATURE_WERT_CURRENCY),
    currency_amount: fiatValue,
    commodity: firebaseRemoteConfig.getString(REMOTE_CONFIG.FEATURE_WERT_COMMODITY),
    address,
  });

  return wertWidget.getEmbedUrl();
}

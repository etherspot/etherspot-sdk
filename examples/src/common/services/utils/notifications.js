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
import { utils, BigNumber as EthersBigNumber } from 'ethers';
import { Notifications } from 'react-native-notifications';
import isEmpty from 'lodash.isempty';
import t from 'translations/translate';

// $FlowFixMe – throws "react-native-android-badge" not found
import BadgeAndroid from 'react-native-android-badge';

// Constants
import {
  COLLECTIBLE,
  BCX,
  BADGE,
  FCM_DATA_TYPE,
} from 'constants/notificationConstants';

// Utils
import { reportLog } from 'utils/common';
import { addressesEqual } from 'utils/assets';

// Models
import type { ApiNotification, Notification } from 'models/Notification';

const parseNotification = (notificationBody: string): ?Object => {
  let messageObj = null;
  try {
    messageObj = JSON.parse(notificationBody);
  } catch (e) {
    // do nothing
  }
  return messageObj;
};

const validBcxTransaction = (transaction: ?Object): boolean => {
  if (!transaction || !transaction.fromAddress || !transaction.toAddress) return false;
  if (!transaction.status || !transaction.asset) return false;
  if (transaction.value === undefined) {
    reportLog('Wrong BCX tx notification received', { transaction });
    return false;
  }
  return true;
};

const validCollectibleTransaction = (transaction: ?Object): boolean => {
  if (!transaction || !transaction.fromAddress || !transaction.toAddress) return false;
  if (!transaction.status || !transaction.contractAddress) return false;
  return true;
};

export const processNotification = (notification: Object): ?Object => {
  let result = null;
  const parsedNotification = parseNotification(notification.msg);
  if (!parsedNotification) return result;

  if (notification.type === BCX) {
    if (!parsedNotification || !validBcxTransaction(parsedNotification)) return result;
    result = { type: notification.type };
  }

  if (notification.type === BADGE) {
    result = { type: notification.type };
  }

  if (!!notification.type && notification.type.toUpperCase() === COLLECTIBLE) {
    if (!parsedNotification || !validCollectibleTransaction(parsedNotification)) return result;
    result = { type: COLLECTIBLE };
  }

  return result;
};

export const getToastNotification = (data: mixed, myEthAddress: ?string): null | Notification => {
  if (typeof data !== 'object') return null;
  const { type, msg } = data ?? {};
  const notification = typeof msg === 'string' && parseNotification(msg);
  if (!notification) return null;

  if (type === FCM_DATA_TYPE.BCX) {
    if (!validBcxTransaction(notification)) return null;

    const {
      asset,
      status,
      value,
      decimals,
      fromAddress: sender,
      toAddress: receiver,
    } = notification;

    const tokenValue = t('tokenValue', {
      value: utils.formatUnits(EthersBigNumber.from(value.toString()), decimals),
      token: asset,
    });

    if (addressesEqual(receiver, myEthAddress) && status === 'pending') {
      return {
        message: t('notification.transactionReceivedPending', { tokenValue }),
        emoji: 'ok_hand',
      };
    } else if (addressesEqual(receiver, myEthAddress) && status === 'confirmed') {
      return {
        message: t('notification.transactionReceivedConfirmed', { tokenValue }),
        emoji: 'ok_hand',
      };
    } else if (addressesEqual(sender, myEthAddress) && status === 'pending') {
      return {
        message: t('notification.transactionSentPending', { tokenValue }),
        emoji: 'ok_hand',
      };
    } else if (addressesEqual(sender, myEthAddress) && status === 'confirmed') {
      return {
        message: t('notification.transactionSentConfirmed', { tokenValue }),
        emoji: 'ok_hand',
      };
    }
  }

  if (type === FCM_DATA_TYPE.COLLECTIBLE) {
    if (!validCollectibleTransaction(notification)) return null;
    const { fromAddress: sender, toAddress: receiver } = notification;

    if (addressesEqual(receiver, myEthAddress)) {
      return {
        message: t('notification.receivedCollectible'),
        emoji: 'ok_hand',
      };
    } else if (addressesEqual(sender, myEthAddress)) {
      return {
        message: t('notification.collectibleSentAndReceived'),
        emoji: 'ok_hand',
      };
    }
  }

  return null;
};

export const mapInviteNotifications = (notifications: ApiNotification[]): Object[] => notifications
  .map(({ createdAt, payload }) => {
    let notification: Object = { createdAt };

    // note: payload.msg is optional and per Sentry reports might not be JSON
    if (payload.msg) {
      try {
        const parsedMessage = JSON.parse(payload.msg);
        notification = { ...notification, ...parsedMessage };
      } catch (e) {
        //
      }
    }

    return notification;
  })
  .filter(({ createdAt, ...rest }) => !isEmpty(rest)) // filter if notification empty after parsing
  .map(({ senderUserData, type, createdAt }) => ({ ...senderUserData, type, createdAt }))
  .sort((a, b) => b.createdAt - a.createdAt);

export const resetAppNotificationsBadgeNumber = () => {
  if (Platform.OS === 'ios') {
    Notifications.ios.setBadgeCount(0);
    return;
  }
  BadgeAndroid.setBadge(0);
};

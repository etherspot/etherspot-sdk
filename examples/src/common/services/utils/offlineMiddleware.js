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

import get from 'lodash.get';
import includes from 'lodash.includes';
import {
  QUEUE_ACTION,
  ONLINE,
  REMOVE_FROM_QUEUE,
  OFFLINE_API_CALL,
  START_OFFLINE_QUEUE,
  OFFLINE_QUEUE,
} from 'constants/offlineQueueConstants';
import { makeApiCall } from 'actions/offlineApiActions';
import { saveDbAction } from 'actions/dbActions';

const middlewareConfig = {
  stateName: OFFLINE_QUEUE,
  additionalTriggers: [START_OFFLINE_QUEUE],
};

/**
 * Helper method to dispatch the queued action again when the connection is available.
 *
 * @param {Array} queue An array of queued Redux actions.
 * @param {Function} dispatch Redux's dispatch function.
 * @param {Function} getState Redux's getState function.
 */
function fireQueuedActions(queue, dispatch, getState) {
  const { stateName } = middlewareConfig;
  queue.forEach((actionInQueue) => {
    if (actionInQueue.type === OFFLINE_API_CALL) {
      dispatch(makeApiCall(actionInQueue))
        .then(() => {
          dispatch({ type: REMOVE_FROM_QUEUE, payload: actionInQueue });
          const currentQueue = get(getState(), [stateName, 'queue'], []);
          dispatch(saveDbAction(OFFLINE_QUEUE, { offlineQueue: currentQueue }, true));
        })
        .catch(() => null);
    }
  });
}

/**
 * Custom Redux middleware for providing an offline queue functionality.
 *
 * Every action that should be queued if the device is offline should have:
 * ```
 * meta: {
 *   queueIfOffline: true
 * }
 * ```
 * property set.
 *
 * When the device is online this:
 *  - depending on the action type would dispatch appropriate action,
 *  - passes the action to the next middleware as is.
 *
 * When the device is offline this action will be placed in an offline queue.
 * Those actions are later dispatched again when the device comes online.
 * Note that this action is still dispatched to make the optimistic updates possible.
 */
export default function offlineMiddleware({ getState, dispatch }: Object): any {
  return next => (action) => {
    const { stateName, additionalTriggers } = middlewareConfig;

    const state = get(getState(), stateName, {});
    const { isConnected } = state;

    if (action.type === ONLINE || includes(additionalTriggers, action.type)) {
      const result = next(action);
      const { queue } = get(getState(), stateName);
      const canFireQueue = isConnected || action.type === ONLINE;
      if (canFireQueue) {
        fireQueuedActions(queue, dispatch, getState);
      }
      return result;
    }

    const shouldQueue = get(action, ['meta', 'queueIfOffline'], false);
    if (isConnected && shouldQueue) {
      if (action.type === OFFLINE_API_CALL) {
        dispatch(makeApiCall(action));
      }
      return next(action);
    }

    if (isConnected || !shouldQueue) {
      return next(action);
    }

    const actionToQueue = {
      type: QUEUE_ACTION,
      payload: {
        ...action,
      },
    };
    dispatch(actionToQueue);

    const { queue } = get(getState(), stateName);
    dispatch(saveDbAction(OFFLINE_QUEUE, { offlineQueue: queue }, true));

    return next(action);
  };
}

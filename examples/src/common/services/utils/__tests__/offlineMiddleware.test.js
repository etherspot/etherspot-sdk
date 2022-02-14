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

import {
  QUEUE_ACTION,
  ONLINE,
  REMOVE_FROM_QUEUE,
  OFFLINE_API_CALL,
  START_OFFLINE_QUEUE,
} from 'constants/offlineQueueConstants';
import * as offlineApiActions from 'actions/offlineApiActions';
import * as dbActions from 'actions/dbActions';
import offlineMiddleware from '../offlineMiddleware';

const middlewareConfig = {
  stateName: 'offlineQueue',
  additionalTriggers: [START_OFFLINE_QUEUE],
};

describe('Offline middleware', () => {
  const dispatchMock = jest.fn();
  const getState = jest.fn();
  const next = jest.fn();

  const initialState = {
    queue: [],
    isConnected: true,
  };

  jest.spyOn(offlineApiActions, 'makeApiCall').mockImplementation(() => jest.fn());
  jest.spyOn(dbActions, 'saveDbAction').mockImplementation(() => {});

  afterEach(() => {
    dispatchMock.mockClear();
    getState.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('offlineMiddleware()', () => {
    beforeEach(() => {
      getState.mockImplementation(() => ({
        [middlewareConfig.stateName]: initialState,
      }));
    });
    afterEach(() => {
      dispatchMock.mockRestore();
      getState.mockRestore();
    });

    it('should forward unknown action to the next dispatcher', () => {
      const action = {
        type: 'USERINFO',
      };
      offlineMiddleware({ getState, dispatch: dispatchMock })(next)(action);
      expect(next).toBeCalledWith(action);
      expect(dispatchMock).not.toBeCalled();
    });

    it('should dispatch nothing on ONLINE or additionalTriggers actions when the queue is empty', () => {
      const actions = [ONLINE, ...middlewareConfig.additionalTriggers];
      actions.forEach(action => {
        offlineMiddleware({ getState, dispatch: dispatchMock })(next)(action);
        expect(next).toBeCalledWith(action);
        expect(dispatchMock).not.toBeCalled();
      });
    });

    it('should execute action immediately when user is online', () => {
      const action = {
        type: OFFLINE_API_CALL,
        payload: {
          method: 'test',
          params: [1, 2],
        },
        meta: {
          queueIfOffline: true,
        },
      };
      offlineMiddleware({ getState, dispatch: dispatchMock })(next)(action);
      expect(dispatchMock).toBeCalled();
      expect(offlineApiActions.makeApiCall).toBeCalledWith(action);
      expect(next).toBeCalledWith(action);
    });

    it('should put action in a queue when user is offline', () => {
      getState.mockImplementation(() => ({
        [middlewareConfig.stateName]: { ...initialState, isConnected: false },
      }));
      const action = {
        type: OFFLINE_API_CALL,
        payload: {
          method: 'test',
          params: [1, 2],
        },
        meta: {
          queueIfOffline: true,
        },
      };
      const actionToQueue = {
        type: QUEUE_ACTION,
        payload: {
          ...action,
        },
      };
      offlineMiddleware({ getState, dispatch: dispatchMock })(next)(action);
      expect(dispatchMock).toBeCalledWith(actionToQueue);
      expect(dbActions.saveDbAction).toBeCalled();
      expect(next).toBeCalledWith(action);
    });

    it('should execute the stored action when user goes online', async () => {
      const actionInQueue = {
        type: OFFLINE_API_CALL,
        payload: {
          method: 'test',
          params: [1, 2],
        },
        meta: {
          queueIfOffline: true,
        },
      };
      const onlineAction = {
        type: ONLINE,
      };

      getState.mockImplementation(() => ({
        [middlewareConfig.stateName]: { ...initialState, queue: [actionInQueue], isConnected: false },
      }));
      dispatchMock.mockResolvedValue({});

      await offlineMiddleware({ getState, dispatch: dispatchMock })(next)(onlineAction);
      expect(offlineApiActions.makeApiCall).toBeCalledWith(actionInQueue);
      expect(dispatchMock.mock.calls[1][0]).toEqual({ type: REMOVE_FROM_QUEUE, payload: actionInQueue });
      expect(dbActions.saveDbAction).toBeCalled();
    });
  });
});

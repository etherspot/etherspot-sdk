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

import asyncRetry from 'async-retry';

type Retrier<T> = (bail: (error?: Error) => void, attemptNo: number) => T | Promise<T>;

export type Options = {
  retries?: number,
  factor?: number,
  minTimeout?: number,
  maxTimeout?: number,
  randomize?: boolean,
  onRetry?: (error: Error) => void,
};

function retry<T>(fn: Retrier<T>, options: Options = {}): Promise<T> {
  return asyncRetry(fn, {
    retries: 3,
    factor: 1,
    minTimeout: 6000,
    randomize: false,
    ...options,
  });
}

// retryOnNetworkError will not make another attempt to call fn if the thrown exception:
// - was not caused by the (axios) network request, or
// - contains a response from the server
export function retryOnNetworkError<T>(fn: Retrier<T>, options?: Options): Promise<T> {
  return retry<T>(async (bail, attemptNo): Promise<T> => {
    try {
      const result: T = await fn(bail, attemptNo);
      return result;
    } catch (error) {
      const isNetworkError = error.isAxiosError && !error.response;
      if (!isNetworkError) {
        // the error can't be rethrown here because of
        // https://github.com/vercel/async-retry/issues/69
        // $FlowFixMe
        return bail(error);
      }

      throw error;
    }
  }, options);
}

export default retry;

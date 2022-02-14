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

import retry, { retryOnNetworkError } from '../retry';

describe('auto-retry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves to return value if the attempt was successful', async () => {
    await expect(retry(() => 5)).resolves.toEqual(5);
  });

  it('resolves to the value of first resolved promise', async () => {
    const fn = jest.fn(async (bail, attemptNo) => {
      if (attemptNo > 2) return attemptNo;
      throw new Error();
    });
    const promise = retry(fn);

    jest.runAllTimers();
    await expect(promise).resolves.toEqual(3);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('is rejected if none of the attempts succeed', async () => {
    const fn = jest.fn(async (bail, attemptNo) => { throw new Error(`#${attemptNo}`); });
    const promise = retry(fn, { retries: 4 });

    jest.runAllTimers();
    await expect(promise).rejects.toThrow('#5');
    expect(fn).toHaveBeenCalledTimes(5);
  });

  it('stops retries when bail() is called', async () => {
    const fn = jest.fn(async (bail, attemptNo) => {
      if (attemptNo === 2) return bail();
      throw new Error();
    });
    const promise = retry(fn);

    jest.runAllTimers();
    await expect(promise).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('retryOnNetworkError', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retries request if no response was received', async () => {
    const promise = retryOnNetworkError(async (bail, attemptNo) => {
      if (attemptNo === 2) return true;
      const error = new Error();
      (error: any).isAxiosError = true;
      throw error;
    });

    jest.runAllTimers();
    await expect(promise).resolves.toEqual(true);
  });

  it('does not retry for server errors', async () => {
    const promise = retryOnNetworkError(async (bail, attemptNo) => {
      if (attemptNo === 2) return true;
      const error = new Error();
      (error: any).isAxiosError = true;
      (error: any).response = {};
      throw error;
    });

    jest.runAllTimers();
    await expect(promise).rejects.toThrow();
  });

  it('does not retry for errors not caused by the request', async () => {
    const promise = retryOnNetworkError(async (bail, attemptNo) => {
      if (attemptNo === 2) return true;
      throw new Error();
    });

    jest.runAllTimers();
    await expect(promise).rejects.toThrow();
  });
});

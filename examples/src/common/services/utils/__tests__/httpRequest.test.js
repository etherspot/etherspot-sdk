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

import axios from 'axios';
import httpRequest from 'utils/httpRequest';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

class MockNetworkError extends Error {
  isAxiosError: boolean;

  constructor() {
    super('Mock Network Error');
    this.isAxiosError = true;
  }
}

async function networkErrorImpl() {
  throw new MockNetworkError();
}

describe('HTTP request wrapper', () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('get', () => {
    it('returns original response if successful', async () => {
      (axios.get: any).mockImplementationOnce(async () => ({ data: 'data' }));
      await expect(httpRequest.get('')).resolves.toEqual({ data: 'data' });
    });

    it('retries the request on network error by default', async () => {
      (axios.get: any)
        .mockImplementationOnce(networkErrorImpl)
        .mockImplementationOnce(async () => null);
      const promise = httpRequest.get('');
      jest.runAllTimers();
      await expect(promise).resolves.toEqual(null);
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it('allows disabling auto-retry', async () => {
      (axios.get: any)
        .mockImplementationOnce(networkErrorImpl)
        .mockImplementationOnce(async () => null);
      const promise = httpRequest.get('', { retry: false });
      jest.runAllTimers();
      await expect(promise).rejects.toThrow();
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('allows overriding retry options', async () => {
      (axios.get: any).mockImplementation(networkErrorImpl);
      const promise = httpRequest.get('', { retryOptions: { retries: 1 } });
      jest.runAllTimers();
      await expect(promise).rejects.toThrow();
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('post', () => {
    it('returns original response if successful', async () => {
      (axios.post: any).mockImplementationOnce(async () => ({ data: 'data' }));
      await expect(httpRequest.post('')).resolves.toEqual({ data: 'data' });
    });

    it('does not retry the request on network error by default', async () => {
      (axios.post: any)
        .mockImplementationOnce(networkErrorImpl)
        .mockImplementationOnce(async () => null);
      const promise = httpRequest.post('');
      jest.runAllTimers();
      await expect(promise).rejects.toThrow();
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('allows enabling auto-retry', async () => {
      (axios.post: any)
        .mockImplementationOnce(networkErrorImpl)
        .mockImplementationOnce(async () => null);
      const promise = httpRequest.post('', null, { retry: true });
      jest.runAllTimers();
      await expect(promise).resolves.toEqual(null);
      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    it('allows overriding retry options', async () => {
      (axios.post: any).mockImplementation(networkErrorImpl);
      const promise = httpRequest.post('', null, {
        retry: true,
        retryOptions: { retries: 1 },
      });
      jest.runAllTimers();
      await expect(promise).rejects.toThrow();
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});

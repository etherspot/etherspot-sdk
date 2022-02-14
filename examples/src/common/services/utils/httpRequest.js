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
import { retryOnNetworkError } from 'utils/retry';

import type { AxiosXHR, AxiosXHRConfigBase, AxiosPromise } from 'axios';
import type { Options as RetryOptions } from 'utils/retry';

type ExtendedConfigBase<T, R = T> = AxiosXHRConfigBase<T, R> & {
  retry?: boolean,
  retryOptions?: RetryOptions,
};

const retryOptionsNone = { retries: 0 };

function get<R>(url: string, config?: ExtendedConfigBase<mixed, R>): AxiosPromise<mixed, R> {
  const { retry = true, retryOptions, ...axiosConfig } = config ?? {};

  return retryOnNetworkError<AxiosXHR<mixed, R>>(
    () => axios.get<R>(url, axiosConfig),
    retry === false ? retryOptionsNone : retryOptions,
  );
}

function post<T, R>(url: string, data?: T, config?: ExtendedConfigBase<T, R>): AxiosPromise<T, R> {
  const { retry = false, retryOptions, ...axiosConfig } = config ?? {};

  return retryOnNetworkError<AxiosXHR<T, R>>(
    () => axios.post<T, R>(url, data, axiosConfig),
    retry === false ? retryOptionsNone : retryOptions,
  );
}

export default { get, post };

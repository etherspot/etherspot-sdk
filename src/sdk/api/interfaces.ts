import { FetchPolicy } from '@apollo/client/core';

export interface ApiOptions {
  host: string;
  port?: number;
  useSsl?: boolean;
}

export interface ApiRequestOptions<T extends {}, K extends keyof T = keyof T> {
  omitChainIdVariable?: boolean;
  variables?: { [key: string]: any };
  models?: {
    [key in K]: { new (...args: any): T[K] };
  };
}

export interface ApiRequestQueryOptions<T> extends ApiRequestOptions<T> {
  fetchPolicy?: FetchPolicy;
}

import { FetchPolicy } from '@apollo/client/core';

export interface ApiOptions {
  host: string;
  port?: number;
  useSsl?: boolean;
}

export interface ApiRequestOptions<T> {
  variables?: { [key: string]: any };
  Model?: { new (...args: any[]): T };
}

export interface ApiRequestQueryOptions<T> extends ApiRequestOptions<T> {
  fetchPolicy?: FetchPolicy;
}

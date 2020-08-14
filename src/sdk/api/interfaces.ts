import { FetchPolicy } from '@apollo/client/core';

export interface ApiOptions {
  host: string;
  port?: number;
  useSsl?: boolean;
}

export interface ApiMutateOptions<T> {
  variables?: { [key: string]: any };
  Model?: { new (...args: any[]): T };
}

export interface ApiQueryOptions<T> extends ApiMutateOptions<T> {
  fetchPolicy?: FetchPolicy;
}

import {
  ApolloClient,
  DocumentNode,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  split,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import fetch from 'cross-fetch';
import { BigNumber } from 'ethers';
import { isBigNumber, Service } from '../common';
import { HttpException, HttpExceptionCodes } from './exceptions';
import { ApiOptions, ApiRequestOptions, ApiRequestQueryOptions } from './interfaces';
import { buildApiUri, catchApiError, mapApiResult } from './utils';

export class ApiService extends Service {
  private readonly options: ApiOptions;

  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(options: ApiOptions) {
    super();

    this.options = {
      port: null,
      useSsl: false,
      ...options,
    };
  }

  async query<T extends {}>(query: DocumentNode, options?: ApiRequestQueryOptions<T>): Promise<T> {
    options = {
      variables: {},
      fetchPolicy: 'no-cache',
      ...options,
    };

    const {
      omitChainIdVariable, //
      variables,
      fetchPolicy,
      models,
    } = options;

    return this.wrapCall(
      () =>
        this.apolloClient.query<T>({
          query,
          fetchPolicy,
          variables: this.prepareApiVariables(variables, omitChainIdVariable),
        }),
      models,
    );
  }

  async mutate<T extends {}>(mutation: DocumentNode, options?: ApiRequestOptions<T>): Promise<T> {
    options = {
      variables: {},
      ...options,
    };

    const {
      omitChainIdVariable, //
      variables,
      models,
    } = options;

    return this.wrapCall(
      () =>
        this.apolloClient.mutate<T>({
          mutation,
          variables: this.prepareApiVariables(variables, omitChainIdVariable),
        }),
      models,
    );
  }

  subscribe<T extends {}>(query: DocumentNode, options?: ApiRequestOptions<T>): Observable<T> {
    const {
      omitChainIdVariable, //
      variables,
      models,
    } = options;

    return this.apolloClient
      .subscribe<T>({
        query,
        variables: this.prepareApiVariables(variables, omitChainIdVariable),
      })

      .map(({ data }) => mapApiResult(data, models));
  }

  protected onInit(): void {
    const httpLink = new HttpLink({
      fetch,
      uri: buildApiUri(this.options, 'http'),
    });

    const wsLink = new WebSocketLink({
      webSocketImpl: WebSocket,
      uri: buildApiUri(this.options, 'ws', 'graphql'),
      options: {
        reconnect: true,
        lazy: true,
      },
    });

    const authLink = setContext(async () => {
      const { sessionService, projectService } = this.services;

      return {
        headers: {
          ...sessionService.headers,
          ...projectService.headers,
        },
      };
    });

    const link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      authLink.concat(httpLink),
    );

    this.apolloClient = new ApolloClient({
      link,
      cache: new InMemoryCache({
        resultCaching: false,
        addTypename: false,
      }),
    });
  }

  private async wrapCall<T extends {}, K extends keyof T = keyof T>(
    call: () => Promise<{ data?: T }>,
    models?: {
      [key in K]: { new (...args: any): T[K] };
    },
  ): Promise<T> {
    const wrapped = async () => {
      let result: T;

      try {
        const { data } = await call();
        result = mapApiResult(data, models);
      } catch (err) {
        catchApiError(err);
      }

      return result;
    };

    let result: T;

    try {
      result = await wrapped();
    } catch (err) {
      if (
        err instanceof HttpException &&
        (err.code === HttpExceptionCodes.Forbidden || err.code === HttpExceptionCodes.Unauthorized)
      ) {
        // create new session
        const { sessionService } = this.services;
        const { sessionTtl } = sessionService;
        await sessionService.createSession(sessionTtl);

        // re-call
        result = await wrapped();
      } else {
        throw err;
      }
    }

    return result;
  }

  private prepareApiVariables(
    variables: { [keys: string]: any },
    omitChainIdVariable: boolean,
  ): { [key: string]: any } {
    const result: { [key: string]: any } = {};

    const keys = Object.keys(variables || {});

    for (const key of keys) {
      let value: any;
      if (isBigNumber(variables[key])) {
        value = BigNumber.from(variables[key]).toHexString();
      } else if (variables[key] instanceof Date) {
        value = variables[key].getTime();
      } else {
        value = variables[key];
      }
      result[key] = value;
    }

    if (!omitChainIdVariable) {
      const { chainId } = this.services.networkService;

      result.chainId = chainId;
    }

    return result;
  }
}

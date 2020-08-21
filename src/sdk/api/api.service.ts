import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  DocumentNode,
  HttpLink,
  split,
  ApolloLink,
  Observable,
} from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Service } from '../common';
import { ApiOptions, ApiRequestOptions, ApiRequestQueryOptions } from './interfaces';
import { buildApiUri, catchApiError, mapApiResult, prepareApiVariables } from './utils';

export class ApiService extends Service {
  private readonly options: ApiOptions;
  apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(options: ApiOptions) {
    super();

    this.options = {
      port: null,
      useSsl: false,
      ...options,
    };
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

    const authLink = new ApolloLink((operation, forward) => {
      const { authService } = this.services;

      operation.setContext({
        headers: authService.headers,
      });

      return forward(operation);
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
      }),
    });
  }

  async query<T extends {}>(query: DocumentNode, options?: ApiRequestQueryOptions<T>): Promise<T> {
    let result: T = null;

    options = {
      variables: {},
      fetchPolicy: 'no-cache',
      ...options,
    };

    const {
      variables, //
      fetchPolicy,
      models,
    } = options;

    try {
      const { data } = await this.apolloClient.query<T>({
        query,
        fetchPolicy,
        variables: prepareApiVariables(variables),
      });

      result = mapApiResult(data, models);
    } catch (err) {
      catchApiError(err);
    }

    return result;
  }

  async mutate<T extends {}>(mutation: DocumentNode, options?: ApiRequestOptions<T>): Promise<T> {
    let result: T = null;

    options = {
      variables: {},
      ...options,
    };

    const {
      variables, //
      models,
    } = options;

    try {
      const { data } = await this.apolloClient.mutate<T>({
        mutation,
        variables: prepareApiVariables(variables),
      });

      result = mapApiResult(data, models);
    } catch (err) {
      catchApiError(err);
    }

    return result;
  }

  subscribe<T extends {}>(query: DocumentNode, options?: ApiRequestOptions<T>): Observable<T> {
    const {
      variables, //
      models,
    } = options;

    return this.apolloClient
      .subscribe<T>({
        query,
        variables: prepareApiVariables(variables),
      })

      .map(({ data }) => mapApiResult(data, models));
  }
}

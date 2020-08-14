import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  DocumentNode,
  HttpLink,
  split,
  ApolloLink,
} from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { plainToClass } from 'class-transformer';
import { Service } from '../common';
import { ApiOptions, ApiQueryOptions, ApiMutateOptions } from './interfaces';
import { buildApiUri } from './utils';

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

  protected onInit(): void {
    const httpLink = new HttpLink({
      fetch,
      uri: buildApiUri(this.options, 'http'),
    });

    const wsLink = new WebSocketLink({
      webSocketImpl: WebSocket,
      uri: buildApiUri(this.options, 'ws'),
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
      httpLink,
    );

    this.apolloClient = new ApolloClient({
      link: authLink.concat(link),
      cache: new InMemoryCache({
        resultCaching: false,
      }),
    });
  }

  query<T>(query: DocumentNode, options?: ApiQueryOptions<T>): Promise<T> {
    options = {
      variables: {},
      fetchPolicy: 'no-cache',
      ...options,
    };

    const {
      variables, //
      fetchPolicy,
      Model,
    } = options;

    return this.apolloClient
      .query<{
        output: T;
      }>({
        query,
        variables,
        fetchPolicy,
      })
      .then(({ data: { output } }) => (Model ? plainToClass(Model, output) : output));
  }

  mutate<T>(mutation: DocumentNode, options?: ApiMutateOptions<T>): Promise<T> {
    options = {
      variables: {},
      ...options,
    };

    const {
      variables, //
      Model,
    } = options;

    return this.apolloClient
      .mutate<{
        output: T;
      }>({
        mutation,
        variables,
      })
      .then(({ data: { output } }) => (Model ? plainToClass(Model, output) : output));
  }
}

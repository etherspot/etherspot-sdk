import { ApolloClient, InMemoryCache, NormalizedCacheObject, DocumentNode } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { AbstractService } from '../common';
import { ApiOptions } from './interfaces';
import { buildApiUri } from './utils';

export class ApiService extends AbstractService {
  protected readonly options: ApiOptions;
  protected apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(options: ApiOptions) {
    super();

    this.options = {
      host: 'localhost',
      port: null,
      useSsl: false,
      ...options,
    };
  }

  protected onInit(): void {
    const link = new HttpLink({
      fetch,
      uri: buildApiUri(this.options, 'http'),
    });

    this.apolloClient = new ApolloClient({
      link,
      cache: new InMemoryCache({
        resultCaching: false,
      }),
    });
  }

  query<T = any, V = { [key: string]: any }>(query: DocumentNode, variables?: V): Promise<T> {
    return this.apolloClient
      .query<{
        output: T;
      }>({
        query,
        variables: variables || {},
        fetchPolicy: 'no-cache',
      })
      .then(({ data: { output } }) => output);
  }

  mutate<T = any, V = { [key: string]: any }>(mutation: DocumentNode, variables?: V): Promise<T> {
    return this.apolloClient
      .mutate<{
        output: T;
      }>({
        mutation,
        variables: variables || {},
      })
      .then(({ data: { output } }) => output);
  }
}

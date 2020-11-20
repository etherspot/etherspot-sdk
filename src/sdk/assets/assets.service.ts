import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { TokensList, TokensLists, TokensListToken } from './classes';
import { DEFAULT_IS_TOKEN_ON_TOKENS_LISTS_NAMES } from './constants';

export class AssetsService extends Service {
  async getTokensLists(): Promise<TokensList[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: TokensLists;
    }>(
      gql`
        query($chainId: Int) {
          result: tokensLists(chainId: $chainId) {
            items {
              name
              endpoint
              isDefault
              createdAt
              updatedAt
            }
          }
        }
      `,
      {
        models: {
          result: TokensLists,
        },
      },
    );

    return result.items;
  }

  async getTokensListTokens(name: string = null): Promise<TokensListToken[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: TokensList;
    }>(
      gql`
        query($chainId: Int, $name: String) {
          result: tokensList(chainId: $chainId, name: $name) {
            tokens {
              address
              name
              symbol
              decimals
              logoURI
            }
          }
        }
      `,
      {
        variables: {
          name,
        },
        models: {
          result: TokensList,
        },
      },
    );

    return result ? result.tokens : null;
  }

  async getAccountTokensListTokens(name: string = null): Promise<TokensListToken[]> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: TokensList;
    }>(
      gql`
        query($chainId: Int, $account: String!, $name: String) {
          result: accountTokensList(chainId: $chainId, account: $account, name: $name) {
            tokens {
              address
              name
              symbol
              decimals
              logoURI
            }
          }
        }
      `,
      {
        variables: {
          account,
          name,
        },
        models: {
          result: TokensList,
        },
      },
    );

    return result ? result.tokens : null;
  }

  async isTokenOnTokensList(token: string, name: string = null): Promise<boolean> {
    const { apiService, networkService } = this.services;

    if (!name) {
      const { network } = networkService;

      name = DEFAULT_IS_TOKEN_ON_TOKENS_LISTS_NAMES[network.name] || null;
    }

    const { result } = await apiService.query<{
      result: boolean;
    }>(
      gql`
        query($chainId: Int, $token: String!, $name: String) {
          result: isTokenOnTokensList(chainId: $chainId, token: $token, name: $name)
        }
      `,
      {
        variables: {
          token,
          name,
        },
      },
    );

    return result;
  }
}

import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { TokenList, TokenLists, TokenListToken } from './classes';

export class AssetsService extends Service {
  async getTokenLists(): Promise<TokenList[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: TokenLists;
    }>(
      gql`
        query($chainId: Int) {
          result: tokenLists(chainId: $chainId) {
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
          result: TokenLists,
        },
      },
    );

    return result.items;
  }

  async getTokenListTokens(name: string = null): Promise<TokenListToken[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: TokenList;
    }>(
      gql`
        query($chainId: Int, $name: String) {
          result: tokenList(chainId: $chainId, name: $name) {
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
          result: TokenList,
        },
      },
    );

    return result ? result.tokens : null;
  }

  async getAccountTokenListTokens(name: string = null): Promise<TokenListToken[]> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: TokenList;
    }>(
      gql`
        query($chainId: Int, $account: String!, $name: String) {
          result: accountTokenList(chainId: $chainId, account: $account, name: $name) {
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
          result: TokenList,
        },
      },
    );

    return result ? result.tokens : null;
  }

  async isTokenOnTokenList(token: string, name: string = null): Promise<boolean> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: boolean;
    }>(
      gql`
        query($chainId: Int, $token: String!, $name: String) {
          result: isTokenOnTokenList(chainId: $chainId, token: $token, name: $name)
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

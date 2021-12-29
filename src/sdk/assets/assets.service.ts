import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { TokenList, TokenLists, TokenListToken } from './classes';
import { NativeCurrencies } from './classes/native-currencies';
import { NativeCurrenciesItem } from './classes/native-currencies-item';
import { NetworkNames, networkNameToChainId } from '../network';

export class AssetsService extends Service {
  async getTokenLists(network?: NetworkNames): Promise<TokenList[]> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result.items;
  }

  async getTokenListTokens(name: string = null, network?: NetworkNames): Promise<TokenListToken[]> {
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
              chainId
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
        fetchPolicy: 'cache-first',
        chainId: networkNameToChainId(network),
      },
    );

    return result ? result.tokens : null;
  }

  async getNativeCurrencies(): Promise<NativeCurrenciesItem[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: NativeCurrencies;
    }>(
      gql`
        query {
          result: nativeCurrencies {
            items {
              name
              symbol
              decimals
              logoURI
              chainId
            }
          }
        }
      `,
      {
        models: {
          result: NativeCurrencies,
        },
      },
    );

    return result.items;
  }

  async getAccountTokenListTokens(name: string = null, network?: NetworkNames): Promise<TokenListToken[]> {
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
              chainId
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
        chainId: networkNameToChainId(network),
      },
    );

    return result ? result.tokens : null;
  }

  async isTokenOnTokenList(token: string, name: string = null, network?: NetworkNames): Promise<boolean> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }
}

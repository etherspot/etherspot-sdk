import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { HistoricalTokenPrices, MarketDetails, NumberOfTransactions, PoolsActivities, TokenDetails, TokenList, TokenLists, TokenListToken, TradingHistories } from './classes';
import { NativeCurrencies } from './classes/native-currencies';
import { NativeCurrenciesItem } from './classes/native-currencies-item';

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

  async getTokenDetails(tokenAddress: string, ChainId: number, provider?: string): Promise<TokenDetails> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: TokenDetails;
    }>(
      gql`
      query($ChainId: Int, $tokenAddress: String!, $provider: String) {
        result: tokenDetails(chainId: $ChainId, tokenAddress: $tokenAddress, provider: $provider) {
          tokenAddress
          usdPrice
          liquidityUSD
          tradingVolume
        }
      }
    `,
      {
        variables: {
          ChainId,
          tokenAddress,
          provider
        },
        models: {
          result: TokenDetails,
        },
      },
    );

    return result;
  }

  async getHistoricalTokenPrice(tokenAddress: string, ChainId: number, provider?: string, timePeriod?: string)
    : Promise<HistoricalTokenPrices> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: HistoricalTokenPrices;
    }>(
      gql`
      query($ChainId: Int, $tokenAddress: String!, $provider: String, $timePeriod: String) {
        result: historicalTokenPrice(chainId: $ChainId, tokenAddress: $tokenAddress, provider: $provider, timePeriod: $timePeriod) {
          items {
            tokenAddress
            usdPrice
            timestamp
          }
        }
      }
    `,
      {
        variables: {
          ChainId,
          tokenAddress,
          provider,
          timePeriod,
        },
        models: {
          result: HistoricalTokenPrices,
        },
      },
    );

    return result;
  }

  async getPoolsActivity(tokenAddress: string, ChainId: number, provider?: string, page?: number, type?: string)
    : Promise<PoolsActivities> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PoolsActivities;
    }>(
      gql`
    query($ChainId: Int, $tokenAddress: String!, $provider: String, $page: Int, $type: String) {
      result: poolsActivity(chainId: $ChainId, tokenAddress: $tokenAddress, provider: $provider, page: $page, type: $type) {
        items {
          amm
          transactionAddress
          timestamp
          amountUSD
          transactionType
          tokensIn {
            symbol
            amm
            network
            priceUSD
            priceETH
            amount
          }
          tokensOut {
            symbol
            amm
            network
            priceUSD
            priceETH
            amount
          }
        }
      }
    }
  `,
      {
        variables: {
          ChainId,
          tokenAddress,
          provider,
          page,
          type,
        },
        models: {
          result: PoolsActivities,
        },
      },
    );

    return result;
  }

  async getNumberOfTransactions(tokenAddress: string, ChainId: number, provider?: string)
    : Promise<NumberOfTransactions> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: NumberOfTransactions;
    }>(
      gql`
    query($ChainId: Int, $tokenAddress: String!, $provider: String) {
      result: numberOfTransactions(chainId: $ChainId, tokenAddress: $tokenAddress, provider: $provider) {
        totalTransactions
      }
    }
  `,
      {
        variables: {
          ChainId,
          tokenAddress,
          provider,
        },
        models: {
          result: NumberOfTransactions,
        },
      },
    );

    return result;
  }

  async getTradingHistory(tokenAddress: string, ChainId: number, provider?: string, page?: number)
    : Promise<TradingHistories> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: TradingHistories;
    }>(
      gql`
      query($ChainId: Int, $tokenAddress: String!, $provider: String, $page: Int) {
        result: tradingHistory(chainId: $ChainId, tokenAddress: $tokenAddress, provider: $provider, page: $page) {
          items {
            amm
            transactionAddress
            direction
            timestamp
            amountUSD
            walletAddress
            tokensIn {
              symbol
              amm
              network
              priceUSD
              priceETH
              amount
            }
            tokensOut {
              symbol
              amm
              network
              priceUSD
              priceETH
              amount
            }
          }
      }
    }
    `,
      {
        variables: {
          ChainId,
          tokenAddress,
          provider,
          page,
        },
        models: {
          result: TradingHistories,
        },
      },
    );

    return result;
  }

  async getMarketDetails(tokenAddress: string, ChainId: number, provider?: string)
    : Promise<MarketDetails> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: MarketDetails;
    }>(
      gql`
      query($ChainId: Int, $tokenAddress: String!, $provider: String) {
        result: marketDetails(chainId: $ChainId, tokenAddress: $tokenAddress, provider: $provider) {
          id
          symbol
          name
          image
          marketCap
          allTimeHigh
          allTimeLow
          fullyDilutedValuation
          priceChangePercentage1h
          priceChangePercentage24h
          priceChangePercentage7d
          priceChangePercentage1m
          priceChangePercentage1y
        }
      }
    `,
      {
        variables: {
          ChainId,
          tokenAddress,
          provider,
        },
        models: {
          result: MarketDetails,
        },
      },
    );

    return result;
  }
}

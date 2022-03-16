import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { Service } from '../common';
import {
  ExchangeOffers,
  ExchangeOffer,
  CrossChainBridgeSupportedChain,
  CrossChainBridgeSupportedChains,
  CrossChainBridgeToken,
  CrossChainBridgeTokenList,
} from './classes';
import { PaginatedTokens } from '../assets';
import { GetCrossChainBridgeTokenListDto, GetCrossChainBridgeRouteDto } from '../dto';

export class ExchangeService extends Service {
  async getExchangeSupportedAssets(page: number = null, limit: number = null): Promise<PaginatedTokens> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: PaginatedTokens;
    }>(
      gql`
        query($chainId: Int, $account: String!, $page: Int, $limit: Int) {
          result: exchangeSupportedAssets(chainId: $chainId, account: $account, page: $page, limit: $limit) {
            items {
              address
              name
              symbol
              decimals
              logoURI
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        variables: {
          account,
          page: page || 1,
          limit: limit || 100,
        },
        models: {
          result: PaginatedTokens,
        },
      },
    );

    return result;
  }

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
  ): Promise<ExchangeOffer[]> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: ExchangeOffers;
    }>(
      gql`
        query(
          $chainId: Int
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
        ) {
          result: exchangeOffers(
            chainId: $chainId
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
          ) {
            items {
              provider
              receiveAmount
              exchangeRate
              transactions {
                to
                data
                value
              }
            }
          }
        }
      `,
      {
        variables: {
          account,
          fromTokenAddress,
          toTokenAddress,
          fromAmount,
        },
        models: {
          result: ExchangeOffers,
        },
      },
    );

    return result ? result.items : null;
  }

  async getCrossChainBridgeSupportedChains(): Promise<CrossChainBridgeSupportedChain[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: CrossChainBridgeSupportedChains;
    }>(
      gql`
        query {
          result: crossChainBridgeSupportedChains {
            items {
              chainId
              name
              isL1
              sendingEnabled
              icon
              receivingEnabled
              currency {
                address
                icon
                name
                symbol
                decimals
                minNativeCurrencyForGas
              }
              rpcs
              explorers
            }
          }
        }
      `,
      {
        models: {
          result: CrossChainBridgeSupportedChains,
        },
      },
    );

    return result ? result.items : null;
  }

  async getCrossChainBridgeTokenList(dto: GetCrossChainBridgeTokenListDto): Promise<CrossChainBridgeToken[]> {
    const { apiService } = this.services;
    const  { direction, fromChainId, toChainId, disableSwapping } = dto;

    const { result } = await apiService.query<{
      result: CrossChainBridgeTokenList;
    }>(
      gql`
        query(
          $direction: SocketTokenDirection!
          $fromChainId: Int!
          $toChainId: Int!
          $disableSwapping: Boolean
        ) {
          result: crossChainBridgeTokenList(
            direction: $direction
            fromChainId: $fromChainId
            toChainId: $toChainId
            disableSwapping: $disableSwapping
          ) {
            items {
              name
              address
              chainId
              decimals
              symbol
              icon
            }
          }
        }
      `,
      {
        variables: {
          direction,
          fromChainId,
          toChainId,
          disableSwapping,
        },
        models: {
          result: CrossChainBridgeTokenList,
        },
      },
    );

    return result ? result.items : null;
  }


  async findCrossChainBridgeRoutes(dto: GetCrossChainBridgeRouteDto): Promise<CrossChainBridgeToken[]> {
    const { apiService } = this.services;
    const  { fromTokenAddress, fromChainId, toTokenAddress, toChainId, fromAmount, userAddress, disableSwapping } = dto;

    const { result } = await apiService.query<{
      result: CrossChainBridgeTokenList;
    }>(
      gql`
        query(
          $direction: SocketTokenDirection!
          $fromChainId: Int!
          $toChainId: Int!
          $disableSwapping: Boolean
        ) {
          result: findCrossChainBridgeRoutes(
            direction: $direction
            fromChainId: $fromChainId
            toChainId: $toChainId
            disableSwapping: $disableSwapping
          ) {
            items {
              name
              address
              chainId
              decimals
              symbol
              icon
            }
          }
        }
      `,
      {
        variables: {
          fromTokenAddress,
          fromChainId,
          toTokenAddress,
          toChainId,
          fromAmount,
          userAddress,
          disableSwapping,
        },
        models: {
          result: CrossChainBridgeTokenList,
        },
      },
    );

    return result ? result.items : null;
  }

  
}

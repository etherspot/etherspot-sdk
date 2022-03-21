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
  CrossChainBridgeRoute,
  CrossChainBridgeRoutes,
  CrossChainBridgeBuildTXResponse
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
    const { direction, fromChainId, toChainId, disableSwapping } = dto;

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


  async findCrossChainBridgeRoutes(dto: GetCrossChainBridgeRouteDto): Promise<CrossChainBridgeRoute[]> {
    const { apiService } = this.services;
    const { fromTokenAddress, fromChainId, toTokenAddress, toChainId, fromAmount, userAddress, disableSwapping } = dto;

    const { result } = await apiService.query<{
      result: CrossChainBridgeRoutes;
    }>(
      gql`
      query(
        $fromTokenAddress: String!
        $fromChainId: Int!
        $toTokenAddress: String!
        $toChainId: Int!
        $fromAmount: BigNumber!
        $userAddress: String!
        $disableSwapping: Boolean
      ) {
        result: findCrossChainBridgeRoutes(
          fromTokenAddress: $fromTokenAddress
          fromChainId: $fromChainId
          toTokenAddress: $toTokenAddress
          toChainId: $toChainId
          fromAmount: $fromAmount
          userAddress: $userAddress
          disableSwapping: $disableSwapping
        ) {
          items {
            routeId
            fromAmount
            toAmount
            usedBridgeNames
            chainGasBalances
            totalUserTx
            sender
            totalGasFeesInUsd
            userTxs {
              userTxType
               txType
              chainId
              toAmount
              toAsset {
                name
                address
                chainId
                decimals
                symbol
                icon
              }
              stepCount
              routePath
              sender
              approvalData {
                minimumApprovalAmount
                approvalTokenAddress
                allowanceTarget
                owner
              }
              steps{
                type
                protocol {
                  name
                  displayName
                  icon
                }
                chainId
                fromAsset {
                  name
                  address
                  chainId
                  decimals
                  symbol
                  icon
                }
                fromAmount
                toAsset {
                  name
                  address
                  chainId
                  decimals
                  symbol
                  icon
                }
                toAmount
                gasFees {
                  gasLimit
                  asset {
                    chainId
                    address
                    symbol
                    name
                    decimals
                    icon
                  }
                  feesInUsd
                }
                protocolFees {
                  amount
                  feesInUsd
                  asset  {
                    chainId
                    address
                    symbol
                    name
                    decimals
                    icon
                  }
                  feesInUsd
                }
                serviceTime
              }
              gasFees{
                feesInUsd
              }
              protocolFees {
                amount
                feesInUsd
                asset{
                name
                address
                chainId
                decimals
                symbol
                icon
              }
              }
              serviceTime
              userTxIndex
        }
            serviceTime
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
          result: CrossChainBridgeRoutes,
        },
      },
    );

    return result ? result.items : null;
  }

  
  async buildCrossChainBridgeTransaction(route: CrossChainBridgeRoute): Promise<CrossChainBridgeBuildTXResponse> {
    const { apiService } = this.services;

    const { result } = await apiService.mutate<{
      result: CrossChainBridgeBuildTXResponse;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $hash: String!) {
          result: buildCrossChainBridgeTransaction(route: $route) {
           userTxType: String
              txType: String
              txData: String
              txTarget: String
              chainId: Int
              value: String
              approvalData:{ 
                minimumApprovalAmount
                approvalTokenAddress
                allowanceTarget
                owner
              }
          }
        }
      `,
      {
        models: {
          result: CrossChainBridgeBuildTXResponse,
        },
        variables: {
          route: route,
        },
      },
    );

    return result;
  }


}

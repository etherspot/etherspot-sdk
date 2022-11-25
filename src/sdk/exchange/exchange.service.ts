import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { Route } from '@lifi/sdk';
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
  CrossChainBridgeBuildTXResponse,
  BridgingQuotes,
  ExchangeRouterAddress,
  StepTransaction,
  StepTransactions,
  AdvanceRoutesLiFi,
  LiFiStatus,
} from './classes';

import { PaginatedTokens } from '../assets';
import { GetCrossChainBridgeTokenListDto, GetCrossChainBridgeRouteDto, GetCrossChainBridgeSupportedChainsDto } from '../dto';
import { CrossChainServiceProvider, LiFiBridge } from './constants';

export class ExchangeService extends Service {
  async getExchangeSupportedAssets(page: number = null, limit: number = null, ChainId: number): Promise<PaginatedTokens> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: PaginatedTokens;
    }>(
      gql`
        query($ChainId: Int, $account: String!, $page: Int, $limit: Int) {
          result: exchangeSupportedAssets(chainId: $ChainId, account: $account, page: $page, limit: $limit) {
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
          ChainId,
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

  async getCrossChainQuotes(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromChainId: number,
    toChainId: number,
    fromAmount: BigNumber,
    serviceProvider?: CrossChainServiceProvider,
    lifiBridges?: LiFiBridge[]
  ): Promise<BridgingQuotes> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: BridgingQuotes;
    }>(
      gql`
        query(
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
          $fromChainId: Int
          $toChainId: Int
          $serviceProvider: CrossChainServiceProvider
          $lifiBridges: [LiFiBridge!]
        ) {
          result: getCrossChainQuotes(
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
            fromChainId: $fromChainId
            toChainId: $toChainId
            serviceProvider: $serviceProvider
            lifiBridges: $lifiBridges
          ) {
            items {
              provider
              approvalData {
                approvalAddress
                amount
              }
              transaction {
                data
                to
                value
                from
                chainId
              }
              estimate {
                approvalAddress
                fromAmount
                toAmount
                gasCosts {
                  limit
                  amountUSD
                  token {
                    address
                    symbol
                    decimals
                    logoURI
                    chainId
                    name
                  }
                }
                data {
                  fromToken {
                    address
                    symbol
                    decimals
                    logoURI
                    chainId
                    name
                  }
                  toToken {
                    address
                    symbol
                    decimals
                    logoURI
                    chainId
                    name
                  }
                  toTokenAmount
                  estimatedGas
                }
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
          fromChainId,
          toChainId,
          fromAmount,
          serviceProvider,
          lifiBridges
        },
        models: {
          result: BridgingQuotes,
        },
      },
    );

    return result ? result : null;
  }

  async getAdvanceRoutesLiFi(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromChainId: number,
    toChainId: number,
    fromAmount: BigNumber,
    toAddress?: string,
    allowSwitchChain?: boolean,
  ): Promise<AdvanceRoutesLiFi> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    let data = null;

    const { result } = await apiService.query<{
      result: string;
    }>(
      gql`
        query(
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
          $fromChainId: Int
          $toChainId: Int
          $toAddress: String
          $allowSwitchChain: Boolean
        ) {
          result: getAdvanceRoutesLiFi(
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
            fromChainId: $fromChainId
            toChainId: $toChainId
            toAddress: $toAddress
            allowSwitchChain: $allowSwitchChain
          ) {
            data
          }
        }
      `,
      {
        variables: {
          account,
          fromTokenAddress,
          toTokenAddress,
          fromChainId,
          toChainId,
          fromAmount,
          toAddress,
          allowSwitchChain,
        },
      },
    );

    try {
      data = JSON.parse(result['data']);
    } catch (err) {
      console.log(err)
    }
    return data;
  }

  async getStepTransaction(selectedRoute: Route): Promise<StepTransactions> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    let transactions = [];
    try {
      const route = JSON.stringify(selectedRoute);

      const { result } = await apiService.query<{
        result: StepTransaction[];
      }>(
        gql`
        query(
          $route: String!
          $account: String!
        ) {
          result: getStepTransactions(
            route: $route
            account: $account
          ) {
              to
              gasLimit
              gasPrice
              data
              value
              chainId
              type
          }
        }`,
        {
          variables: {
            route,
            account,
          },
        }
      );
      transactions = result;
    } catch (err) {
      console.log(err);
    }
    return {
      items: transactions
    };
  }

  async getLiFiStatus(fromChainId: number, toChainId: number, txnHash: string, bridge?: string): Promise<LiFiStatus> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: LiFiStatus;
    }>(
      gql`
        query(
          $fromChainId: Int!
          $toChainId: Int!
          $txnHash: String!
          $bridge: String
        ) {
          result: getLiFiStatus(
            fromChainId: $fromChainId
            toChainId: $toChainId
            txnHash: $txnHash
            bridge: $bridge
          ) {
            status
            bridgeExplorerLink
            subStatus
            subStatusMsg
            sendingTxnHash
            receivingTxnHash
          }
        }`,
      {
        variables: {
          fromChainId,
          toChainId,
          txnHash,
          bridge
        },
      }
    );

    return result;
  }

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
    fromChainId: number,
  ): Promise<ExchangeOffer[]> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: ExchangeOffers;
    }>(
      gql`
        query(
          $fromChainId: Int!
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
        ) {
          result: exchangeOffers(
            chainId: $fromChainId
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
          fromChainId,
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

  async getCrossChainBridgeSupportedChains(dto?: GetCrossChainBridgeSupportedChainsDto): Promise<CrossChainBridgeSupportedChain[]> {
    const { apiService } = this.services;
    const serviceProvider = dto?.serviceProvider;

    const { result } = await apiService.query<{
      result: CrossChainBridgeSupportedChains;
    }>(
      gql`
        query($serviceProvider: CrossChainServiceProvider) {
          result: crossChainBridgeSupportedChains(
            serviceProvider: $serviceProvider
          ) {
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
        variables: {
          serviceProvider,
        },
        models: {
          result: CrossChainBridgeSupportedChains,
        },
      },
    );

    return result ? result.items : null;
  }

  async getCrossChainBridgeTokenList(dto: GetCrossChainBridgeTokenListDto): Promise<CrossChainBridgeToken[]> {
    const { apiService } = this.services;
    const { direction, fromChainId, toChainId, disableSwapping, serviceProvider } = dto;

    const { result } = await apiService.query<{
      result: CrossChainBridgeTokenList;
    }>(
      gql`
        query(
          $direction: SocketTokenDirection!,
          $fromChainId: Int!,
          $toChainId: Int!,
          $disableSwapping: Boolean,
          $serviceProvider: CrossChainServiceProvider
        ) {
          result: crossChainBridgeTokenList(
            direction: $direction
            fromChainId: $fromChainId
            toChainId: $toChainId
            disableSwapping: $disableSwapping,
            serviceProvider: $serviceProvider
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
          serviceProvider,
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
          $fromAmount: String!
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
              chainGasBalances
              fromAmount
              routeId
              sender
              serviceTime
              toAmount
              totalGasFeesInUsd
              totalUserTx
              usedBridgeNames
              userTxs {
                approvalData {
                  allowanceTarget
                  approvalTokenAddress
                  minimumApprovalAmount
                  owner
                }
                chainId
                gasFees {
                  asset {
                    address
                    chainId
                    decimals
                    icon
                    name
                    symbol
                  }
                  feesInUsd
                  gasLimit
                }
                routePath
                sender
                serviceTime
                stepCount
                steps {
                  chainId
                  fromChainId
                  fromAmount
                  fromAsset {
                    address
                    chainAgnosticId
                    chainId
                    createdAt
                    decimals
                    icon
                    id
                    isEnabled
                    name
                    rank
                    symbol
                    updatedAt
                  }
                  gasFees {
                    asset {
                      address
                      chainId
                      decimals
                      icon
                      name
                      symbol
                    }
                    feesInUsd
                    gasLimit
                  }
                  protocol {
                    displayName
                    icon
                    name
                  }
                  toAmount
                  toAsset {
                    address
                    chainAgnosticId
                    chainId
                    createdAt
                    decimals
                    icon
                    id
                    isEnabled
                    name
                    rank
                    symbol
                    updatedAt
                  }
                  toChainId
                  type
                }
                toAmount
                toAsset {
                  address
                  chainAgnosticId
                  chainId
                  createdAt
                  decimals
                  icon
                  id
                  isEnabled
                  name
                  rank
                  symbol
                  updatedAt
                }
                txType
                userTxIndex
                userTxType
              }
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

  async buildCrossChainBridgeTransaction(dto: CrossChainBridgeRoute): Promise<CrossChainBridgeBuildTXResponse> {
    const { apiService } = this.services;
    const { result } = await apiService.query<{
      result: CrossChainBridgeBuildTXResponse;
    }>(
      gql`
        query($payload: CrossChainBridgeRouteBuildTransactionRouteArgs!) {
          result: callCrossChainBridgeTransaction(payload: $payload) {
            userTxType
            txType
            txData
            txTarget
            chainId
            value
            approvalData {
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
          payload: { payload: dto },
        },
      },
    );
    return result;
  }

  async getExchangeRoutersAddress(dto: ExchangeRouterAddress): Promise<string[]> {
    const { apiService } = this.services;
    const { chainId } = dto;
    const { result } = await apiService.query<{
      result: string[]
    }>(
      gql`
        query($chainId: number) {
          result: getExchangeRoutersAddress(chainId: $chainId)
        }
      `,
      {
        variables: {
          chainId,
        },
      }
    );
    return result;
  }

  async getCrossChainBridgeTransaction<T = any, P = any>(payload: P): Promise<T> {
    const { apiService } = this.services;

    const { result } = await apiService.mutate<{
      result: {
        data: any;
      };
    }>(
      gql`
        mutation($chainId: Int, $sender: String!, $payload: JSONObject) {
          result: getCrossChainBridgeTransaction(payload: $payload) {
            data
          }
        }
      `,
      {
        variables: {
          payload,
        },
      },
    );

    return result.data;
  }
}

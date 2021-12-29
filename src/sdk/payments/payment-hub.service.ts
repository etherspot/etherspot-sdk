import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { prepareAddress, Service } from '../common';
import {
  PaymentHub,
  PaymentHubBridge,
  PaymentHubBridges,
  PaymentHubDeposit,
  PaymentHubDeposits,
  PaymentHubPayment,
  PaymentHubPayments,
  PaymentHubs,
} from './classes';
import { PAYMENT_HUB_P2P_CHANNEL_UID } from './constants';
import { computePaymentChannelHash } from './utils';
import { NetworkNames, networkNameToChainId } from '../network';

export class PaymentHubService extends Service {
  async getPaymentHub(hub: string, token: string = null, network?: NetworkNames): Promise<PaymentHub> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHub;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $token: String) {
          result: paymentHub(chainId: $chainId, hub: $hub, token: $token) {
            address
            createdAt
            liquidity
            token
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHub,
        },
        variables: {
          hub,
          token,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getPaymentHubs(
    hub: string = null,
    token?: string,
    page: number = null,
    network?: NetworkNames,
  ): Promise<PaymentHubs> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubs;
    }>(
      gql`
        query($chainId: Int, $hub: String, $token: String, $page: Int) {
          result: paymentHubs(chainId: $chainId, hub: $hub, token: $token, page: $page) {
            items {
              address
              createdAt
              liquidity
              token
              updatedAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: PaymentHubs,
        },
        variables: {
          hub,
          token,
          page: page || 1,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getPaymentHubBridge(
    hub: string,
    token: string,
    acceptedChainId: number,
    acceptedToken: string,
    network?: NetworkNames,
  ): Promise<PaymentHubBridge> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubBridge;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $token: String, $acceptedChainId: Int!, $acceptedToken: String) {
          result: paymentHubBridge(
            chainId: $chainId
            hub: $hub
            token: $token
            acceptedChainId: $acceptedChainId
            acceptedToken: $acceptedToken
          ) {
            hub {
              address
              token
              liquidity
            }
            acceptedChainId
            acceptedToken
            state
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubBridge,
        },
        variables: {
          hub,
          token,
          acceptedChainId,
          acceptedToken,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getPaymentHubBridges(
    hub: string,
    token: string = null,
    acceptedChainId: number = null,
    page: number = null,
    network?: NetworkNames,
  ): Promise<PaymentHubBridges> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubBridges;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $token: String, $acceptedChainId: Int, $page: Int) {
          result: paymentHubBridges(
            chainId: $chainId
            hub: $hub
            token: $token
            acceptedChainId: $acceptedChainId
            page: $page
          ) {
            items {
              hub {
                address
                token
                liquidity
              }
              acceptedChainId
              acceptedToken
              state
              createdAt
              updatedAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: PaymentHubBridges,
        },
        variables: {
          hub,
          token,
          acceptedChainId,
          page: page || 1,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getPaymentHubDeposit(
    hub: string,
    token: string = null,
    owner: string,
    network?: NetworkNames,
  ): Promise<PaymentHubDeposit> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubDeposit;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $owner: String!, $token: String) {
          result: paymentHubDeposit(chainId: $chainId, hub: $hub, owner: $owner, token: $token) {
            hub {
              address
              token
              liquidity
            }
            owner
            totalAmount
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubDeposit,
        },
        variables: {
          hub,
          owner,
          token,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getPaymentHubDeposits(
    hub: string,
    tokens: string[] = [],
    owner: string,
    page: number = null,
    network?: NetworkNames,
  ): Promise<PaymentHubDeposits> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubDeposits;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $owner: String!, $tokens: [String!], $page: Int) {
          result: paymentHubDeposits(chainId: $chainId, hub: $hub, owner: $owner, tokens: $tokens, page: $page) {
            items {
              hub {
                address
                token
                liquidity
              }
              owner
              totalAmount
              createdAt
              updatedAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: PaymentHubDeposits,
        },
        variables: {
          hub,
          owner,
          tokens,
          page: page || 1,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getPaymentHubPayment(hash: string): Promise<PaymentHubPayment> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubPayment;
    }>(
      gql`
        query($hash: String!) {
          result: paymentHubPayment(hash: $hash) {
            hub {
              address
              token
              liquidity
            }
            hash
            sender
            recipient
            value
            createdAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubPayment,
        },
        variables: {
          hash,
        },
      },
    );

    return result;
  }

  async getPaymentHubPayments(
    hub: string,
    token: string = null,
    senderOrRecipient: string,
    page: number = null,
    network?: NetworkNames,
  ): Promise<PaymentHubPayments> {
    const { apiService, accountService } = this.services;

    const owner = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: PaymentHubPayments;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $owner: String!, $senderOrRecipient: String, $token: String, $page: Int) {
          result: paymentHubPayments(
            chainId: $chainId
            hub: $hub
            owner: $owner
            senderOrRecipient: $senderOrRecipient
            token: $token
            page: $page
          ) {
            items {
              hub {
                address
                token
                liquidity
              }
              hash
              sender
              recipient
              value
              createdAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: PaymentHubPayments,
        },
        variables: {
          hub,
          owner,
          senderOrRecipient,
          token,
          page: page || 1,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async createPaymentHubPayment(
    hub: string,
    token: string,
    recipient: string,
    value: BigNumber,
    network?: NetworkNames,
  ): Promise<PaymentHubPayment> {
    const { apiService, accountService } = this.services;

    const { accountAddress } = accountService;

    const { result } = await apiService.mutate<{
      result: PaymentHubPayment;
    }>(
      gql`
        mutation(
          $chainId: Int
          $hub: String!
          $sender: String!
          $recipient: String!
          $value: BigNumber!
          $token: String
        ) {
          result: createPaymentHubPayment(
            chainId: $chainId
            hub: $hub
            sender: $sender
            recipient: $recipient
            value: $value
            token: $token
          ) {
            hub {
              address
              token
              liquidity
            }
            hash
            sender
            recipient
            value
            createdAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubPayment,
        },
        variables: {
          hub,
          sender: accountAddress,
          recipient,
          value,
          token,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async updatePaymentHub(liquidity: BigNumber, token: string = null, network?: NetworkNames): Promise<PaymentHub> {
    const { apiService, accountService } = this.services;

    const { accountAddress } = accountService;

    const { result } = await apiService.mutate<{
      result: PaymentHub;
    }>(
      gql`
        mutation($chainId: Int, $hub: String!, $token: String, $liquidity: BigNumber!) {
          result: updatePaymentHub(chainId: $chainId, hub: $hub, token: $token, liquidity: $liquidity) {
            address
            token
            liquidity
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHub,
        },
        variables: {
          hub: accountAddress,
          token,
          liquidity,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async updatePaymentHubDeposit(
    hub: string,
    totalAmount: BigNumber,
    token: string = null,
    network?: NetworkNames,
  ): Promise<PaymentHubDeposit> {
    if (!totalAmount) {
      totalAmount = BigNumber.from(0);
    }

    const { paymentRegistryContract } = this.internalContracts;
    const { apiService, accountService, blockService, walletService } = this.services;

    const sender = accountService.accountAddress;

    const blockNumber = await blockService.getCurrentBlockNumber(network);

    const paymentHubDeposit = await this.getPaymentHubDeposit(hub, token, sender, network);

    const currentAmount = paymentHubDeposit ? paymentHubDeposit.totalAmount : BigNumber.from(0);

    let senderSignature: string = null;

    if (currentAmount.lt(totalAmount)) {
      // deposit
      const diff = totalAmount.sub(currentAmount);
      const { p2pPaymentsService } = this.services;

      const hash = computePaymentChannelHash(sender, hub, token, PAYMENT_HUB_P2P_CHANNEL_UID);
      const paymentChannel = await p2pPaymentsService.getP2PPaymentChannel(hash, network);
      const amount = paymentChannel ? paymentChannel.totalAmount.add(diff) : diff;

      const messageHash = paymentRegistryContract.hashPaymentChannelCommit(
        sender, //
        hub,
        prepareAddress(token, true),
        PAYMENT_HUB_P2P_CHANNEL_UID,
        blockNumber,
        amount,
      );

      senderSignature = await walletService.signMessage(messageHash);
    }

    const { result } = await apiService.mutate<{
      result: PaymentHubDeposit;
    }>(
      gql`
        mutation(
          $chainId: Int
          $blockNumber: Int!
          $hub: String!
          $token: String
          $totalAmount: BigNumber
          $sender: String!
          $senderSignature: String
        ) {
          result: updatePaymentHubDeposit(
            blockNumber: $blockNumber
            chainId: $chainId
            hub: $hub
            token: $token
            totalAmount: $totalAmount
            sender: $sender
            senderSignature: $senderSignature
          ) {
            hub {
              address
              token
              liquidity
            }
            owner
            totalAmount
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubDeposit,
        },
        variables: {
          blockNumber,
          hub,
          token,
          totalAmount,
          sender,
          senderSignature,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async transferPaymentHubDeposit(
    hub: string,
    token: string,
    value: BigNumber,
    targetChainId: number,
    targetHub: string = null,
    targetToken = null,
    network?: NetworkNames,
  ): Promise<PaymentHubDeposit> {
    if (!value) {
      value = BigNumber.from(0);
    }

    const { apiService, accountService } = this.services;

    const sender = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: PaymentHubDeposit;
    }>(
      gql`
        mutation(
          $chainId: Int
          $hub: String!
          $token: String
          $sender: String!
          $value: BigNumber!
          $targetChainId: Int!
          $targetHub: String
          $targetToken: String
        ) {
          result: transferPaymentHubDeposit(
            chainId: $chainId
            hub: $hub
            token: $token
            sender: $sender
            value: $value
            targetChainId: $targetChainId
            targetHub: $targetHub
            targetToken: $targetToken
          ) {
            hub {
              address
              token
              liquidity
            }
            owner
            totalAmount
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubDeposit,
        },
        variables: {
          hub,
          token,
          sender,
          value,
          targetChainId,
          targetHub,
          targetToken,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async activatePaymentHubBridge(
    token: string,
    acceptedChainId: number,
    acceptedToken: string = null,
    network?: NetworkNames,
  ): Promise<PaymentHubBridge> {
    const {
      apiService,
      accountService: { accountAddress: hub },
    } = this.services;

    const { result } = await apiService.mutate<{
      result: PaymentHubBridge;
    }>(
      gql`
        mutation($chainId: Int, $hub: String!, $token: String, $acceptedChainId: Int!, $acceptedToken: String) {
          result: activatePaymentHubBridge(
            chainId: $chainId
            hub: $hub
            token: $token
            acceptedChainId: $acceptedChainId
            acceptedToken: $acceptedToken
          ) {
            hub {
              address
              token
              liquidity
            }
            acceptedChainId
            acceptedToken
            state
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubBridge,
        },
        variables: {
          hub,
          token,
          acceptedChainId,
          acceptedToken,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async deactivatePaymentHubBridge(
    token: string,
    acceptedChainId: number,
    acceptedToken: string = null,
    network?: NetworkNames,
  ): Promise<PaymentHubBridge> {
    const {
      apiService,
      accountService: { accountAddress: hub },
    } = this.services;

    const { result } = await apiService.mutate<{
      result: PaymentHubBridge;
    }>(
      gql`
        mutation($chainId: Int, $hub: String!, $token: String, $acceptedChainId: Int!, $acceptedToken: String) {
          result: deactivatePaymentHubBridge(
            chainId: $chainId
            hub: $hub
            token: $token
            acceptedChainId: $acceptedChainId
            acceptedToken: $acceptedToken
          ) {
            hub {
              address
              token
              liquidity
            }
            acceptedChainId
            acceptedToken
            state
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: PaymentHubBridge,
        },
        variables: {
          hub,
          token,
          acceptedChainId,
          acceptedToken,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }
}

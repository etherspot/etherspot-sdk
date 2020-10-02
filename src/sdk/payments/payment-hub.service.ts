import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { prepareAddress, Service } from '../common';
import {
  PaymentHub,
  PaymentHubDeposit,
  PaymentHubDeposits,
  PaymentHubPayment,
  PaymentHubPayments,
  PaymentHubs,
} from './classes';
import { PAYMENT_HUB_P2P_CHANNEL_UID } from './constants';
import { computePaymentChannelHash } from './utils';

export class PaymentHubService extends Service {
  async getPaymentHub(hub: string, token: string = null): Promise<PaymentHub> {
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
      },
    );

    return result;
  }

  async getPaymentHubs(hub: string = null, token?: string, page: number = null): Promise<PaymentHubs> {
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
      },
    );

    return result;
  }

  async getPaymentHubDeposit(hub: string, owner: string, token: string = null): Promise<PaymentHubDeposit> {
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
      },
    );

    return result;
  }

  async getPaymentHubDeposits(
    hub: string,
    owner: string,
    tokens: string[] = [],
    page: number = null,
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
    senderOrRecipient: string,
    token: string = null,
    page: number = null,
  ): Promise<PaymentHubPayments> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentHubPayments;
    }>(
      gql`
        query($chainId: Int, $hub: String!, $senderOrRecipient: String!, $token: String, $page: Int) {
          result: paymentHubPayments(
            chainId: $chainId
            hub: $hub
            senderOrRecipient: $senderOrRecipient
            token: $token
            page: $page
          ) {
            items {
              hub {
                address
                token
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
          senderOrRecipient,
          token,
          page: page || 1,
        },
      },
    );

    return result;
  }

  async createPaymentHubPayment(
    hub: string,
    recipient: string,
    value: BigNumber,
    token: string = null,
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
      },
    );

    return result;
  }

  async updatePaymentHub(liquidity: BigNumber, token: string = null): Promise<PaymentHub> {
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
      },
    );

    return result;
  }

  async updatePaymentHubDeposit(hub: string, totalAmount: BigNumber, token: string = null): Promise<PaymentHubDeposit> {
    if (!totalAmount) {
      totalAmount = BigNumber.from(0);
    }

    const { paymentRegistryContract } = this.contracts;
    const { apiService, accountService, blockService, walletService } = this.services;

    const sender = accountService.accountAddress;

    const { currentOnchainBlockNumber: blockNumber } = await blockService.getBlockStats();

    const paymentHubDeposit = await this.getPaymentHubDeposit(hub, sender, token);

    const currentAmount = paymentHubDeposit ? paymentHubDeposit.totalAmount : BigNumber.from(0);

    let senderSignature: string = null;

    if (currentAmount.lt(totalAmount)) {
      // deposit
      const diff = totalAmount.sub(currentAmount);
      const { p2pPaymentsService } = this.services;

      const hash = computePaymentChannelHash(sender, hub, token, PAYMENT_HUB_P2P_CHANNEL_UID);
      const paymentChannel = await p2pPaymentsService.getP2PPaymentChannel(hash);
      const amount = paymentChannel ? paymentChannel.totalAmount.add(diff) : diff;

      const typedMessage = paymentRegistryContract.buildTypedData(
        'PaymentChannelCommit',
        [
          { name: 'sender', type: 'address' }, //
          { name: 'recipient', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'uid', type: 'bytes32' },
          { name: 'blockNumber', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
        ],
        {
          sender, //
          recipient: hub,
          token: prepareAddress(token, true),
          uid: PAYMENT_HUB_P2P_CHANNEL_UID,
          blockNumber,
          amount: amount.toHexString(),
        },
      );

      senderSignature = await walletService.signTypedData(typedMessage);
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
      },
    );

    return result;
  }
}

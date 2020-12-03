import { gql } from '@apollo/client/core';
import { BigNumber } from 'ethers';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { prepareAddress, Service, UniqueSubject } from '../common';
import { P2PPaymentChannel, P2PPaymentChannelPayments, P2PPaymentChannels, P2PPaymentDeposits } from './classes';
import { computePaymentChannelHash, createPaymentChannelUid } from './utils';

export class P2pPaymentService extends Service {
  readonly p2pPaymentDepositAddress$ = new UniqueSubject<string>();

  get p2pPaymentDepositAddress(): string {
    return this.p2pPaymentDepositAddress$.value;
  }

  async syncP2PPaymentDeposits(owner: string, tokens: string[]): Promise<P2PPaymentDeposits> {
    const { apiService } = this.services;

    const { result } = await apiService.mutate<{
      result: P2PPaymentDeposits;
    }>(
      gql`
        mutation($chainId: Int, $owner: String!, $tokens: [String!]) {
          result: syncPaymentDeposits(chainId: $chainId, owner: $owner, tokens: $tokens) {
            items {
              address
              availableAmount
              createdAt
              lockedAmount
              owner
              state
              token
              totalAmount
              updatedAt
            }
          }
        }
      `,
      {
        models: {
          result: P2PPaymentDeposits,
        },
        variables: {
          owner,
          tokens,
        },
      },
    );

    return result;
  }

  async getP2PPaymentChannel(hash: string): Promise<P2PPaymentChannel> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: P2PPaymentChannel;
    }>(
      gql`
        query($chainId: Int, $hash: String!) {
          result: p2pPaymentChannel(chainId: $chainId, hash: $hash) {
            committedAmount
            createdAt
            hash
            recipient
            sender
            state
            token
            totalAmount
            uid
            updatedAt
            latestPayment {
              blockNumber
              guardianSignature
              senderSignature
              state
              totalAmount
              updatedAt
              value
            }
          }
        }
      `,
      {
        models: {
          result: P2PPaymentChannel,
        },
        variables: {
          hash,
        },
      },
    );

    return result;
  }

  async getP2PPaymentChannels(
    senderOrRecipient: string,
    filters: { uncommittedOnly: boolean },
    page: number = null,
  ): Promise<P2PPaymentChannels> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: P2PPaymentChannels;
    }>(
      gql`
        query($chainId: Int, $senderOrRecipient: String!, $page: Int, $uncommittedOnly: Boolean) {
          result: p2pPaymentChannels(
            chainId: $chainId
            senderOrRecipient: $senderOrRecipient
            page: $page
            uncommittedOnly: $uncommittedOnly
          ) {
            items {
              committedAmount
              createdAt
              hash
              recipient
              sender
              state
              token
              totalAmount
              uid
              updatedAt
              latestPayment {
                blockNumber
                guardianSignature
                senderSignature
                state
                totalAmount
                updatedAt
                value
              }
            }
            nextPage
            currentPage
          }
        }
      `,
      {
        models: {
          result: P2PPaymentChannels,
        },
        variables: {
          senderOrRecipient,
          page: page || 1,
          ...filters,
        },
      },
    );

    return result;
  }

  async getP2PPaymentChannelPayments(channel: string, page: number = null): Promise<P2PPaymentChannelPayments> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: P2PPaymentChannelPayments;
    }>(
      gql`
        query($chainId: Int, $channel: String!, $page: Int) {
          result: p2pPaymentChannelPayments(chainId: $chainId, channel: $channel, page: $page) {
            items {
              blockNumber
              createdAt
              guardianSignature
              senderSignature
              state
              totalAmount
              updatedAt
              value
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: P2PPaymentChannelPayments,
        },
        variables: {
          channel,
          page: page || 1,
        },
      },
    );

    return result;
  }

  async increaseP2PPaymentChannelAmount(
    recipient: string,
    token: string,
    value: BigNumber,
    uidSalt: string = null,
  ): Promise<P2PPaymentChannel> {
    const { accountService } = this.services;
    const hash = computePaymentChannelHash(
      accountService.accountAddress,
      recipient,
      token,
      createPaymentChannelUid(uidSalt),
    );

    const paymentChannel = await this.getP2PPaymentChannel(hash);

    return this.updateP2PPaymentChannel(
      recipient,
      token,
      paymentChannel ? paymentChannel.totalAmount.add(value) : value,
      uidSalt,
    );
  }

  async updateP2PPaymentChannel(
    recipient: string,
    token: string,
    totalAmount: BigNumber,
    uidSalt: string = null,
  ): Promise<P2PPaymentChannel> {
    const { paymentRegistryContract } = this.contracts;
    const { apiService, accountService, blockService, walletService } = this.services;

    const uid = createPaymentChannelUid(uidSalt);
    const sender = accountService.accountAddress;

    const { currentOnchainBlockNumber: blockNumber } = await blockService.getBlockStats();

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
        recipient,
        token: prepareAddress(token, true),
        uid,
        blockNumber,
        amount: totalAmount.toHexString(),
      },
    );

    const senderSignature = await walletService.signTypedData(typedMessage);

    const { result } = await apiService.mutate<{
      result: P2PPaymentChannel;
    }>(
      gql`
        mutation(
          $chainId: Int
          $blockNumber: Int!
          $recipient: String!
          $sender: String!
          $senderSignature: String!
          $token: String
          $totalAmount: BigNumber!
          $uid: String!
        ) {
          result: updateP2PPaymentChannel(
            chainId: $chainId
            blockNumber: $blockNumber
            recipient: $recipient
            sender: $sender
            senderSignature: $senderSignature
            token: $token
            totalAmount: $totalAmount
            uid: $uid
          ) {
            committedAmount
            createdAt
            hash
            recipient
            sender
            state
            token
            totalAmount
            uid
            updatedAt
            latestPayment {
              blockNumber
              guardianSignature
              senderSignature
              state
              totalAmount
              updatedAt
              value
            }
          }
        }
      `,
      {
        models: {
          result: P2PPaymentChannel,
        },
        variables: {
          blockNumber,
          recipient,
          sender,
          senderSignature,
          token,
          totalAmount,
          uid,
        },
      },
    );

    return result;
  }

  async signP2PPaymentChannel(hash: string): Promise<P2PPaymentChannel> {
    const { apiService, accountService, walletService } = this.services;
    const paymentChannel = await this.getP2PPaymentChannel(hash);

    if (
      !paymentChannel ||
      !paymentChannel.latestPayment ||
      paymentChannel.sender !== accountService.accountAddress ||
      paymentChannel.latestPayment.senderSignature
    ) {
      throw new Error('Can not sign payment channel');
    }

    const {
      sender,
      recipient,
      token,
      totalAmount,
      uid,
      latestPayment: { blockNumber },
    } = paymentChannel;

    const { paymentRegistryContract } = this.contracts;

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
        recipient,
        token: prepareAddress(token, true),
        uid,
        blockNumber,
        amount: totalAmount.toHexString(),
      },
    );

    const senderSignature = await walletService.signTypedData(typedMessage);

    const { result } = await apiService.mutate<{
      result: P2PPaymentChannel;
    }>(
      gql`
        mutation($chainId: Int, $hash: String!, $senderSignature: String!) {
          result: signP2PPaymentChannel(chainId: $chainId, hash: $hash, senderSignature: $senderSignature) {
            committedAmount
            createdAt
            hash
            recipient
            sender
            state
            token
            totalAmount
            uid
            updatedAt
            latestPayment {
              blockNumber
              guardianSignature
              senderSignature
              state
              totalAmount
              updatedAt
              value
            }
          }
        }
      `,
      {
        models: {
          result: P2PPaymentChannel,
        },
        variables: {
          hash,
          senderSignature,
        },
      },
    );

    return result;
  }

  protected onInit() {
    const { paymentRegistryContract } = this.contracts;
    const { accountService, networkService } = this.services;

    this.addSubscriptions(
      combineLatest([
        accountService.accountAddress$, //
        networkService.chainId$,
      ])
        .pipe(
          map(([address]) => {
            let result: string = null;

            if (address) {
              result = paymentRegistryContract.computeAccountCreate2Address(address);
            }

            return result;
          }),
        )
        .subscribe(this.p2pPaymentDepositAddress$),
    );
  }
}

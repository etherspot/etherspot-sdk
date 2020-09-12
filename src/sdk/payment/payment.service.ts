import { gql } from '@apollo/client/core';
import { BigNumber } from 'ethers';
import { map } from 'rxjs/operators';
import { Service, UniqueSubject, prepareAddress } from '../common';
import { PaymentChannel, PaymentChannels, PaymentDeposit, PaymentDeposits } from './classes';
import { createPaymentChannelUid, computePaymentChannelHash } from './utils';

export class PaymentService extends Service {
  readonly paymentDepositAddress$ = new UniqueSubject<string>();

  get paymentDepositAddress(): string {
    return this.paymentDepositAddress$.value;
  }

  async syncPaymentDeposits(owner: string, tokens: string[]): Promise<PaymentDeposit[]> {
    const { apiService } = this.services;

    const { paymentDeposits } = await apiService.mutate<{
      paymentDeposits: PaymentDeposits;
    }>(
      gql`
        mutation($owner: String!, $tokens: [String!]) {
          paymentDeposits: syncPaymentDeposits(owner: $owner, tokens: $tokens) {
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
          paymentDeposits: PaymentDeposits,
        },
        variables: {
          owner,
          tokens,
        },
      },
    );

    return paymentDeposits ? paymentDeposits.items : [];
  }

  async getPaymentChannel(hash: string): Promise<PaymentChannel> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentChannel;
    }>(
      gql`
        query($hash: String!) {
          result: paymentChannel(hash: $hash) {
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
          result: PaymentChannel,
        },
        variables: {
          hash,
        },
      },
    );

    return result;
  }

  async getPaymentChannels(senderOrRecipient: string = null, page: number = null): Promise<PaymentChannels> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: PaymentChannels;
    }>(
      gql`
        query($senderOrRecipient: String!, $page: Int) {
          result: paymentChannels(senderOrRecipient: $senderOrRecipient, page: $page) {
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
          result: PaymentChannels,
        },
        variables: {
          senderOrRecipient,
          page: page || 1,
        },
      },
    );

    return result;
  }

  async increasePaymentChannelAmount(
    recipient: string,
    token: string,
    value: BigNumber,
    uidSalt: string = null,
  ): Promise<PaymentChannel> {
    const { accountService } = this.services;
    const hash = computePaymentChannelHash(
      accountService.accountAddress,
      recipient,
      token,
      createPaymentChannelUid(uidSalt),
    );

    const paymentChannel = await this.getPaymentChannel(hash);

    return this.updatePaymentChannel(
      recipient,
      token,
      paymentChannel ? paymentChannel.totalAmount.add(value) : value,
      uidSalt,
    );
  }

  async updatePaymentChannel(
    recipient: string,
    token: string,
    totalAmount: BigNumber,
    uidSalt: string = null,
  ): Promise<PaymentChannel> {
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
      result: PaymentChannel;
    }>(
      gql`
        mutation(
          $blockNumber: Int!
          $recipient: String!
          $sender: String!
          $senderSignature: String!
          $token: String
          $totalAmount: BigNumber!
          $uid: String!
        ) {
          result: updatePaymentChannel(
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
          result: PaymentChannel,
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

  protected onInit() {
    const { paymentRegistryContract } = this.contracts;
    const { accountService } = this.services;

    this.addSubscriptions(
      accountService.accountAddress$
        .pipe(
          map((address) => {
            let result: string = null;

            if (address) {
              result = paymentRegistryContract.computeAccountCreate2Address(address);
            }

            return result;
          }),
        )
        .subscribe(this.paymentDepositAddress$),
    );
  }
}

import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { PaymentHubPayment } from './classes';

export class PaymentHubService extends Service {
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
}

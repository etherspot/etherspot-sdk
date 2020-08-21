import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { PaymentChannel } from './classes';

export class PaymentsService extends Service {
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
}

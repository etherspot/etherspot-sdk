import { gql } from '@apollo/client/core';
import { Service, Exception } from '../common';
import { SUPPORTED_FAUCET_NETWORKS } from './constants';

export class FaucetService extends Service {
  async topUpAccount(): Promise<string> {
    const { apiService, networkService, accountService } = this.services;
    const {
      network: { name },
    } = networkService;

    if (!SUPPORTED_FAUCET_NETWORKS[name]) {
      throw new Exception('Faucet not supported on current network');
    }

    const account = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: string;
    }>(
      gql`
        mutation($chainId: Int, $account: String!) {
          result: topUpAccount(chainId: $chainId, account: $account)
        }
      `,
      {
        variables: {
          account,
        },
      },
    );

    return result;
  }

  async topUpPaymentDepositAccount(): Promise<string> {
    const { apiService, networkService, accountService } = this.services;
    const {
      network: { name },
    } = networkService;

    if (!SUPPORTED_FAUCET_NETWORKS[name]) {
      throw new Exception('Faucet not supported on current network');
    }

    const account = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: string;
    }>(
      gql`
        mutation($chainId: Int, $account: String!) {
          result: topUpPaymentDepositAccount(chainId: $chainId, account: $account)
        }
      `,
      {
        variables: {
          account,
        },
      },
    );

    return result;
  }
}

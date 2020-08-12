import { gql } from 'apollo-boost';
import { Wallet } from 'ethers';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { Context } from './common';
import {
  AccountOwnerRegistryContract,
  AccountProofRegistryContract,
  ENSControllerContract,
  ENSRegistryContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';
import { createNetwork } from './network';
import { DEFAULT_NETWORK_NAME, DEFAULT_NETWORK_API_OPTIONS } from './defaults';
import { SdkOptions } from './interfaces';

export class Sdk {
  private context: Context;

  constructor(options: SdkOptions = {}) {
    options = {
      networkName: DEFAULT_NETWORK_NAME,
      ...options,
    };

    options = {
      apiOptions: DEFAULT_NETWORK_API_OPTIONS[options.networkName],
      ...options,
    };

    this.context = new Context(
      createNetwork(options.networkName),
      {
        accountOwnerRegistryContract: new AccountOwnerRegistryContract(),
        accountProofRegistryContract: new AccountProofRegistryContract(),
        ensControllerContract: new ENSControllerContract(),
        ensRegistryContract: new ENSRegistryContract(),
        erc20TokenContract: new ERC20TokenContract(),
        gatewayContract: new GatewayContract(),
        paymentRegistryContract: new PaymentRegistryContract(),
        personalAccountRegistryContract: new PersonalAccountRegistryContract(),
      },
      {
        apiService: new ApiService(options.apiOptions),
        authService: new AuthService(),
      },
    );
  }

  createWallet(privateKey: string): Wallet {
    return this.context.setWallet(new Wallet(privateKey));
  }

  generateWallet(options?: any): Wallet {
    return this.context.setWallet(Wallet.createRandom(options));
  }

  async createSession(): Promise<Session> {
    const { authService } = this.context.services;

    return authService.createSessionCode();
  }
}

import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';
import { Wallet } from 'ethers';
import { Subject } from 'rxjs';
import { AccountService } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { Context } from './context';
import { ENSNode, ENSService } from './ens';
import { createNetwork, Network } from './network';
import { NotificationService, Notification } from './notification';
import { State } from './state';
import { WalletService } from './wallet';
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
import { DEFAULT_NETWORK_NAME, DEFAULT_NETWORK_API_OPTIONS } from './defaults';
import { SdkOptions } from './interfaces';

export class Sdk {
  readonly state: State;
  private readonly context: Context;
  private readonly network: Network;
  private readonly contracts: Context['contracts'];
  private readonly services: Context['services'];

  constructor(wallet: Wallet, options?: SdkOptions) {
    options = {
      networkName: DEFAULT_NETWORK_NAME,
      ...options,
    };

    options = {
      apiOptions: DEFAULT_NETWORK_API_OPTIONS[options.networkName],
      ...options,
    };

    this.network = createNetwork(options.networkName);

    this.contracts = {
      accountOwnerRegistryContract: new AccountOwnerRegistryContract(),
      accountProofRegistryContract: new AccountProofRegistryContract(),
      ensControllerContract: new ENSControllerContract(),
      ensRegistryContract: new ENSRegistryContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    };

    this.services = {
      accountService: new AccountService(),
      apiService: new ApiService(options.apiOptions),
      authService: new AuthService(),
      ensService: new ENSService(),
      notificationService: new NotificationService(),
      walletService: new WalletService(wallet),
    };

    this.context = new Context(this.network, this.contracts, this.services);
    this.state = new State(this.services);
  }

  get apolloClient(): ApolloClient<NormalizedCacheObject> {
    return this.services.apiService.apolloClient;
  }

  async createSession(): Promise<Session> {
    return this.services.authService.createSession();
  }

  async reserveENSName(name: string): Promise<ENSNode> {
    const { authService, ensService } = this.services;

    await authService.verifySession();

    let result: ENSNode;

    try {
      result = await ensService.createENSSubNode(name);
    } catch (err) {
      console.log(err.graphQLErrors[0].extensions);
    }

    return result;
  }

  subscribeNotifications(): Subject<Notification> {
    return this.services.notificationService.subscribeNotifications();
  }
}

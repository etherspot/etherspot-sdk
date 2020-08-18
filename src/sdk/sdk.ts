import { Wallet } from 'ethers';
import { Observable } from 'rxjs';
import { Account, AccountMembers, Accounts, AccountService, AccountTypes } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { Context } from './context';
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
import { DEFAULT_NETWORK_API_OPTIONS, DEFAULT_NETWORK_NAME } from './defaults';
import { ENSNode, ENSService } from './ens';
import { SdkOptions } from './interfaces';
import { createNetwork, Network } from './network';
import { Notification, NotificationService } from './notification';
import { State } from './state';
import { WalletService } from './wallet';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {
  readonly state: State;

  private readonly context: Context;
  private readonly network: Network;
  private readonly contracts: Context['contracts'];
  private readonly services: Context['services'];

  constructor(wallet: Wallet, options?: SdkOptions);
  constructor(options?: SdkOptions);
  constructor(...args: any[]) {
    let wallet: Wallet = null;
    let options: SdkOptions = {};

    if (args.length > 0) {
      let optionsIndex = 0;

      if (args[0] instanceof Wallet) {
        wallet = args[0];
        ++optionsIndex;
      }

      if (args[optionsIndex] && typeof args[optionsIndex] === 'object') {
        options = args[optionsIndex];
      }
    }

    options = {
      networkName: DEFAULT_NETWORK_NAME,
      ...options,
    };

    options = {
      apiOptions: DEFAULT_NETWORK_API_OPTIONS[options.networkName],
      ...options,
    };

    if (!options.apiOptions) {
      throw new Error('Unsupported network');
    }

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
      walletService: new WalletService(),
    };

    this.context = new Context(this.network, this.contracts, this.services);
    this.state = new State(this.services);

    if (wallet) {
      this.attachWallet(wallet);
    }
  }

  get api(): ApiService {
    return this.services.apiService;
  }

  destroy(): void {
    this.context.destroy();
  }

  // wallet

  attachWallet(wallet: Wallet): void {
    if (!(wallet instanceof Wallet)) {
      throw new Error('Invalid Wallet object');
    }

    this.services.walletService.attachWallet(wallet);
  }

  // session

  async createSession(ttl: number = null): Promise<Session> {
    await this.require();

    return this.services.authService.createSession(ttl);
  }

  async restoreSession(session: Session): Promise<Session> {
    await this.require();

    return this.services.authService.restoreSession(session);
  }

  // account

  async syncAccount(): Promise<void> {
    await this.require({
      session: true,
    });

    await this.services.accountService.syncAccount();
  }

  async computeContractAccount(sync = true): Promise<Account> {
    await this.require({
      session: sync,
    });

    const { accountService } = this.services;

    accountService.computeContractAccount();

    if (sync) {
      await accountService.syncAccount();
    }

    return this.state.account;
  }

  async joinContractAccount(address: string, sync = true): Promise<Account> {
    await this.require({
      session: sync,
    });

    const { accountService } = this.services;

    accountService.joinContractAccount(address);

    if (sync) {
      await accountService.syncAccount();
    }

    return this.state.account;
  }

  async getConnectedAccounts(page = 1): Promise<Accounts> {
    await this.require({
      session: true,
    });

    return this.services.accountService.getConnectedAccounts(page);
  }

  async getAccount(address: string): Promise<Account> {
    return this.services.accountService.getAccount(address);
  }

  async getAccountMembers(address: string, page = 1): Promise<AccountMembers> {
    return this.services.accountService.getAccountMembers(address, page);
  }

  // ens

  async reserveENSName(name: string): Promise<ENSNode> {
    await this.require({
      session: true,
    });

    return this.services.ensService.createENSSubNode(name);
  }

  async getENSNode(nameOrHashOrAddress: string): Promise<ENSNode> {
    return this.services.ensService.getENSNode(nameOrHashOrAddress);
  }

  // subscriptions

  subscribeNotifications(): Observable<Notification> {
    return this.services.notificationService.subscribeNotifications();
  }

  private async require(
    options: {
      wallet?: boolean;
      session?: boolean;
      contractAccount?: boolean;
    } = {},
  ): Promise<void> {
    options = {
      wallet: true, // require wallet by default
      ...options,
    };

    const { accountService, authService, walletService } = this.services;

    if (options.wallet && !walletService.address) {
      throw new Error('Require wallet');
    }

    if (options.session) {
      await authService.verifySession();
    }

    if (options.contractAccount && (!accountService.account || accountService.account.type !== AccountTypes.Contract)) {
      throw new Error('Require contract account');
    }
  }
}

import { Wallet, BigNumber, BigNumberish, BytesLike } from 'ethers';
import { Observable } from 'rxjs';
import { Account, AccountMembers, Accounts, AccountService, AccountTypes } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { BatchService, Batch } from './batch';
import { Context } from './context';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';
import { DEFAULT_NETWORK_API_OPTIONS, DEFAULT_NETWORK_NAME } from './defaults';
import { ENSNode, ENSService, parseENSName } from './ens';
import { SdkOptions } from './interfaces';
import { createNetwork, Network } from './network';
import { Notification, NotificationService } from './notification';
import { RelayerService, RelayedTransaction } from './relayer';
import { State } from './state';
import { WalletService } from './wallet';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {
  readonly state: State;
  readonly network: Network;

  private readonly context: Context;
  private readonly contracts: Context['contracts'];
  private readonly services: Context['services'];

  constructor(wallet: Wallet, options?: SdkOptions);
  constructor(options?: SdkOptions);
  constructor(...args: any[]) {
    let wallet: Wallet = null;
    let options: SdkOptions = {};

    if (args.length > 0) {
      let optionsIndex = 0;

      if (Wallet.isSigner(args[0])) {
        wallet = args[0] as Wallet;
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
      ensControllerContract: new ENSControllerContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    };

    this.services = {
      accountService: new AccountService(),
      apiService: new ApiService(options.apiOptions),
      authService: new AuthService(),
      batchService: new BatchService(),
      ensService: new ENSService(),
      notificationService: new NotificationService(),
      relayerService: new RelayerService(),
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
    if (!Wallet.isSigner(wallet)) {
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

  // batch

  clearBatch(): void {
    this.services.batchService.clearBatch();
  }

  async estimateBatch(refundToken: string = null): Promise<Batch> {
    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.batchService.estimateBatch(refundToken);
  }

  async submitBatch(gasPrice: BigNumberish = null): Promise<RelayedTransaction> {
    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.batchService.submitBatch(gasPrice ? BigNumber.from(gasPrice) : null);
  }

  // account

  async syncAccount(): Promise<Account> {
    await this.require({
      session: true,
    });

    return this.services.accountService.syncAccount();
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

  // account (batch)

  async batchAddAccountOwner(owner: string): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService, batchService } = this.services;

    return batchService.pushTransactionRequest(
      personalAccountRegistryContract.encodeAddAccountOwner(accountService.accountAddress, owner),
    );
  }

  async batchRemoveAccountOwner(owner: string): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService, batchService } = this.services;

    return batchService.pushTransactionRequest(
      personalAccountRegistryContract.encodeRemoveAccountOwner(accountService.accountAddress, owner),
    );
  }

  async batchExecuteAccountTransaction(to: string, value: BigNumberish, data: BytesLike): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService, batchService } = this.services;

    return batchService.pushTransactionRequest(
      personalAccountRegistryContract.encodeExecuteAccountTransaction(accountService.accountAddress, to, value, data),
    );
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

  // ens (batch)

  async batchClaimENSNode(ensNode: ENSNode): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    if (!ensNode || !ensNode.guardianSignature) {
      throw new Error('Can not clime ens node');
    }

    const { name, guardianSignature } = ensNode;

    const parsedName = parseENSName(name);

    const { ensControllerContract } = this.contracts;
    const { batchService } = this.services;

    return batchService.pushTransactionRequest(
      ensControllerContract.encodeRegisterSubNode(parsedName.root.hash, parsedName.labelHash, guardianSignature),
    );
  }

  // relayer

  async getRelayedTransaction(key: string): Promise<RelayedTransaction> {
    await this.require();

    return this.services.relayerService.getRelayedTransaction(key);
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

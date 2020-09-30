import { Wallet, BigNumber, BigNumberish, BytesLike } from 'ethers';
import { Subject } from 'rxjs';
import { Account, AccountBalances, AccountMembers, Accounts, AccountService, AccountTypes } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { BatchService, Batch } from './batch';
import { BlockService } from './block';
import { Context } from './context';
import { WalletLike, walletFrom, TransactionRequest } from './common';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';
import { ENSNode, ENSService, parseENSName, ENSNodeStates } from './ens';
import { Env } from './env';
import { SdkOptions } from './interfaces';
import { Network, NetworkNames, NetworkService } from './network';
import { Notification, NotificationService } from './notification';
import {
  P2pPaymentService,
  P2PPaymentChannel,
  P2PPaymentChannels,
  P2PPaymentDeposits,
  PaymentHubPayment,
  PaymentHubService,
  PaymentHub,
  PaymentHubs,
  PaymentHubDeposit,
  PaymentHubDeposits,
  PaymentHubPayments,
} from './payments';
import { RelayerService, RelayedTransaction, RelayedTransactions } from './relayer';
import { State } from './state';
import { WalletService } from './wallet';
import { BatchCommitPaymentChannelModes } from './constants';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {
  readonly state: State;

  private readonly context: Context;
  private readonly contracts: Context['contracts'];
  private readonly services: Context['services'];

  constructor(wallet: WalletLike, options?: SdkOptions);
  constructor(options?: SdkOptions);
  constructor(...args: any[]) {
    let wallet: Wallet = null;
    let options: SdkOptions = {};

    if (args.length > 0) {
      let optionsIndex = 0;

      wallet = walletFrom(args[0]);

      if (wallet) {
        ++optionsIndex;
      }

      if (args[optionsIndex] && typeof args[optionsIndex] === 'object') {
        options = args[optionsIndex];
      }
    }

    const env = Env.prepare(options.env);

    this.contracts = {
      ensControllerContract: new ENSControllerContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    };

    this.services = {
      accountService: new AccountService(),
      apiService: new ApiService(env.apiOptions),
      authService: new AuthService(),
      batchService: new BatchService(),
      blockService: new BlockService(),
      ensService: new ENSService(),
      networkService: new NetworkService({
        ...env.networkOptions,
        defaultNetworkName: options.network,
      }),
      notificationService: new NotificationService(),
      p2pPaymentsService: new P2pPaymentService(),
      paymentHubService: new PaymentHubService(),
      relayerService: new RelayerService(),
      walletService: new WalletService(),
    };

    this.context = new Context(this.contracts, this.services);
    this.state = new State(this.services);

    if (wallet) {
      this.attachWallet(wallet);
    }
  }

  // exposes

  get api(): ApiService {
    return this.services.apiService;
  }

  get notifications$(): Subject<Notification> {
    return this.services.notificationService.subscribeNotifications();
  }

  get supportedNetworks(): Network[] {
    return this.services.networkService.supportedNetworks;
  }

  // sdk

  destroy(): void {
    this.context.destroy();
  }

  // wallet

  attachWallet(walletLike: WalletLike): void {
    const wallet = walletFrom(walletLike);

    if (!wallet) {
      throw new Error('Invalid Wallet object');
    }

    this.services.walletService.attachWallet(wallet);
  }

  // network

  switchNetwork(network: NetworkNames | Network = null): Network {
    return this.services.networkService.switchNetwork(network);
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

  async batchTransactionRequest(transactionRequest: TransactionRequest | Promise<TransactionRequest>): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const { batchService } = this.services;

    return batchService.pushTransactionRequest(
      transactionRequest instanceof Promise ? await transactionRequest : transactionRequest,
    );
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

  async getAccountBalances(address: string, tokens: string[] = []): Promise<AccountBalances> {
    return this.services.accountService.getAccountBalances(address, tokens);
  }

  async getAccountMembers(address: string, page = 1): Promise<AccountMembers> {
    return this.services.accountService.getAccountMembers(address, page);
  }

  // account (encode)

  async encodeAddAccountOwner(owner: string): Promise<TransactionRequest> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService } = this.services;

    return personalAccountRegistryContract.encodeAddAccountOwner(accountService.accountAddress, owner);
  }

  async encodeRemoveAccountOwner(owner: string): Promise<TransactionRequest> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService } = this.services;

    return personalAccountRegistryContract.encodeRemoveAccountOwner(accountService.accountAddress, owner);
  }

  async encodeExecuteAccountTransaction(to: string, value: BigNumberish, data: BytesLike): Promise<TransactionRequest> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService } = this.services;

    return personalAccountRegistryContract.encodeExecuteAccountTransaction(
      accountService.accountAddress,
      to,
      value,
      data,
    );
  }

  // account (batch)

  async batchAddAccountOwner(owner: string): Promise<Batch> {
    return this.batchTransactionRequest(this.encodeAddAccountOwner(owner));
  }

  async batchRemoveAccountOwner(owner: string): Promise<Batch> {
    return this.batchTransactionRequest(this.encodeRemoveAccountOwner(owner));
  }

  async batchExecuteAccountTransaction(to: string, value: BigNumberish, data: BytesLike): Promise<Batch> {
    return this.batchTransactionRequest(this.encodeExecuteAccountTransaction(to, value, data));
  }

  // ens

  async reserveENSName(name: string): Promise<ENSNode> {
    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.ensService.createENSSubNode(name);
  }

  async getENSNode(nameOrHashOrAddress: string = null): Promise<ENSNode> {
    await this.require({
      wallet: !nameOrHashOrAddress,
    });

    const { accountService, ensService } = this.services;

    if (!nameOrHashOrAddress) {
      nameOrHashOrAddress = accountService.accountAddress;
    }

    return ensService.getENSNode(nameOrHashOrAddress);
  }

  // ens (encode)

  async encodeClaimENSNode(nameOrHashOrAddress: string = null): Promise<TransactionRequest> {
    await this.require();

    const ensNode = await this.getENSNode(nameOrHashOrAddress);

    if (!ensNode || ensNode.state !== ENSNodeStates.Reserved) {
      throw new Error('Can not clime ens node');
    }

    const { name, guardianSignature } = ensNode;

    const parsedName = parseENSName(name);

    const { ensControllerContract } = this.contracts;

    return ensControllerContract.encodeRegisterSubNode(parsedName.root.hash, parsedName.labelHash, guardianSignature);
  }

  // ens (batch)

  async batchClaimENSNode(nameOrHashOrAddress: string = null): Promise<Batch> {
    return this.batchTransactionRequest(this.encodeClaimENSNode(nameOrHashOrAddress));
  }

  // p2p payments

  async syncP2PPaymentDeposits(tokens: string[] = []): Promise<P2PPaymentDeposits> {
    await this.require({
      session: true,
    });

    const { accountService, p2pPaymentsService } = this.services;

    return p2pPaymentsService.syncP2PPaymentDeposits(accountService.accountAddress, tokens);
  }

  async getP2PPaymentChannel(hash: string): Promise<P2PPaymentChannel> {
    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannel(hash);
  }

  async getP2PPaymentChannels(senderOrRecipient: string = null, page = 1): Promise<P2PPaymentChannels> {
    await this.require({
      wallet: !senderOrRecipient,
    });

    const { accountService, p2pPaymentsService } = this.services;

    if (!senderOrRecipient) {
      senderOrRecipient = accountService.accountAddress;
    }

    return p2pPaymentsService.getP2PPaymentChannels(senderOrRecipient, page);
  }

  async increaseP2PPaymentChannelAmount(
    recipient: string,
    value: BigNumberish,
    token: string = null,
  ): Promise<P2PPaymentChannel> {
    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.increaseP2PPaymentChannelAmount(recipient, token, BigNumber.from(value));
  }

  async updateP2PPaymentChannel(
    recipient: string,
    totalAmount: BigNumberish,
    token: string = null,
  ): Promise<P2PPaymentChannel> {
    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.updateP2PPaymentChannel(recipient, token, BigNumber.from(totalAmount));
  }

  async signP2PPaymentChannel(hash: string): Promise<P2PPaymentChannel> {
    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.signP2PPaymentChannel(hash);
  }

  // p2p payments (encode)

  async encodeCommitP2PPaymentChannel(
    hash: string,
    mode: BatchCommitPaymentChannelModes = BatchCommitPaymentChannelModes.Deposit,
  ): Promise<TransactionRequest> {
    await this.require();

    const paymentChannel = await this.getP2PPaymentChannel(hash);

    if (!paymentChannel) {
      throw new Error('Payment channel not found');
    }

    const {
      sender,
      token,
      uid,
      totalAmount,
      latestPayment: { blockNumber, senderSignature, guardianSignature },
    } = paymentChannel;

    const { paymentRegistryContract } = this.contracts;

    return mode === BatchCommitPaymentChannelModes.Withdraw
      ? paymentRegistryContract.encodeCommitPaymentChannelAndWithdraw(
          sender,
          token,
          uid,
          blockNumber,
          totalAmount,
          senderSignature,
          guardianSignature,
        )
      : paymentRegistryContract.encodeCommitPaymentChannelAndDeposit(
          sender,
          token,
          uid,
          blockNumber,
          totalAmount,
          senderSignature,
          guardianSignature,
        );
  }

  // p2p payments (batch)

  async batchCommitP2PPaymentChannel(
    hash: string,
    mode: BatchCommitPaymentChannelModes = BatchCommitPaymentChannelModes.Deposit,
  ): Promise<Batch> {
    return this.batchTransactionRequest(this.encodeCommitP2PPaymentChannel(hash, mode));
  }

  // hub payments

  async getPaymentHub(hub: string, token: string = null): Promise<PaymentHub> {
    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHub(hub, token);
  }

  async getPaymentHubs(hub: string = null, token?: string, page: number = null): Promise<PaymentHubs> {
    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubs(hub, token, page);
  }

  async getPaymentHubDeposit(hub: string, owner: string = null, token: string = null): Promise<PaymentHubDeposit> {
    await this.require({
      wallet: !owner,
    });

    const {
      paymentHubService,
      accountService: { accountAddress },
    } = this.services;

    return paymentHubService.getPaymentHubDeposit(hub, owner || accountAddress, token);
  }

  async getPaymentHubDeposits(
    hub: string,
    owner: string = null,
    tokens: string[] = [],
    page: number = null,
  ): Promise<PaymentHubDeposits> {
    await this.require({
      wallet: !owner,
    });

    const {
      paymentHubService,
      accountService: { accountAddress },
    } = this.services;

    return paymentHubService.getPaymentHubDeposits(hub, owner || accountAddress, tokens, page);
  }

  async getPaymentHubPayment(hash: string): Promise<PaymentHubPayment> {
    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubPayment(hash);
  }

  async getPaymentHubPayments(
    hub: string,
    senderOrRecipient: string = null,
    token: string = null,
    page: number = null,
  ): Promise<PaymentHubPayments> {
    await this.require({
      wallet: !senderOrRecipient,
    });

    const {
      paymentHubService,
      accountService: { accountAddress },
    } = this.services;

    return paymentHubService.getPaymentHubPayments(hub, senderOrRecipient || accountAddress, token, page);
  }

  async createPaymentHubPayment(
    hub: string,
    recipient: string,
    value: BigNumber,
    token: string = null,
  ): Promise<PaymentHubPayment> {
    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.createPaymentHubPayment(hub, recipient, value, token);
  }

  // relayer

  async getRelayedTransaction(key: string): Promise<RelayedTransaction> {
    return this.services.relayerService.getRelayedTransaction(key);
  }

  async getRelayedTransactions(key: string): Promise<RelayedTransactions> {
    return this.services.relayerService.getRelayedTransactions(key);
  }

  // private

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

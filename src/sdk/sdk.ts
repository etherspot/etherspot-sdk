import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { Subject } from 'rxjs';
import { Account, AccountBalances, AccountMembers, Accounts, AccountService, AccountTypes } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { BatchService, Batch } from './batch';
import { BlockService } from './block';
import { Context } from './context';
import { TransactionRequest } from './common';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';
import { ENSNode, ENSService, parseENSName, ENSNodeStates } from './ens';
import { Env, EnvLike } from './env';
import { Network, NetworkService } from './network';
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
  BatchCommitP2PPaymentChannelModes,
} from './payments';
import { RelayerService, RelayedTransaction, RelayedTransactions } from './relayer';
import { State } from './state';
import { WalletService, WalletOptions, parseWalletOptions } from './wallet';

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

  constructor(walletOptions: WalletOptions, env?: EnvLike);
  constructor(env?: EnvLike);
  constructor(...args: any[]) {
    let walletOptions: WalletOptions = null;
    let envLike: EnvLike = null;

    if (args.length > 0) {
      let optionsIndex = 0;

      walletOptions = parseWalletOptions(args[0]);

      if (walletOptions) {
        ++optionsIndex;
      }

      if (args[optionsIndex]) {
        envLike = args[optionsIndex];
      }
    }

    const env = Env.prepare(envLike);

    this.contracts = {
      ensControllerContract: new ENSControllerContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    };

    const walletService = new WalletService();

    this.services = {
      walletService,
      accountService: new AccountService(),
      apiService: new ApiService(env.apiOptions),
      authService: new AuthService(),
      batchService: new BatchService(),
      blockService: new BlockService(),
      ensService: new ENSService(),
      networkService: new NetworkService(env.networkOptions),
      notificationService: new NotificationService(),
      p2pPaymentsService: new P2pPaymentService(),
      paymentHubService: new PaymentHubService(),
      relayerService: new RelayerService(),
    };

    this.context = new Context(this.contracts, this.services);
    this.state = new State(this.services);

    if (walletOptions) {
      walletService.switchWalletProvider(walletOptions);
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

  switchWalletProvider(walletOptions: WalletOptions): void {
    walletOptions = parseWalletOptions(walletOptions);

    if (!walletOptions) {
      throw new Error('Invalid wallet options');
    }

    this.services.walletService.switchWalletProvider(walletOptions);
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    await this.require();

    return this.services.walletService.personalSignMessage(message);
  }

  async signMessage(message: string): Promise<string> {
    await this.require();

    return this.services.walletService.signMessage(message);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    await this.require();

    return this.services.walletService.signTypedData(typedData);
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

  async batchTransactionRequest(transactionRequest: TransactionRequest): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const { batchService } = this.services;

    return batchService.pushTransactionRequest(transactionRequest);
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

  async joinContractAccountAt(address: string, sync = true): Promise<Account> {
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

  async getAccount(account: string = null): Promise<Account> {
    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccount(this.prepareAccountAddress(account));
  }

  async getAccountBalances(account: string = null, tokens: string[] = []): Promise<AccountBalances> {
    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccountBalances(this.prepareAccountAddress(account), tokens);
  }

  async getAccountMembers(account: string = null, page = 1): Promise<AccountMembers> {
    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccountMembers(this.prepareAccountAddress(account), page);
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
    await this.require({
      wallet: false,
    });

    return this.batchTransactionRequest(await this.encodeAddAccountOwner(owner));
  }

  async batchRemoveAccountOwner(owner: string): Promise<Batch> {
    await this.require({
      wallet: false,
    });

    return this.batchTransactionRequest(await this.encodeRemoveAccountOwner(owner));
  }

  async batchExecuteAccountTransaction(to: string, value: BigNumberish, data: BytesLike): Promise<Batch> {
    await this.require({
      wallet: false,
    });

    return this.batchTransactionRequest(await this.encodeExecuteAccountTransaction(to, value, data));
  }

  // ens

  async reserveENSName(name: string): Promise<ENSNode> {
    await this.require({
      session: true,
    });

    return this.services.ensService.createENSSubNode(name);
  }

  async getENSNode(nameOrHashOrAddress: string = null): Promise<ENSNode> {
    await this.require({
      wallet: !nameOrHashOrAddress,
    });

    const { ensService } = this.services;

    return ensService.getENSNode(this.prepareAccountAddress(nameOrHashOrAddress));
  }

  // ens (encode)

  async encodeClaimENSNode(nameOrHashOrAddress: string = null): Promise<TransactionRequest> {
    await this.require();

    const ensNode = await this.getENSNode(this.prepareAccountAddress(nameOrHashOrAddress));

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
    await this.require({
      wallet: false,
    });

    return this.batchTransactionRequest(await this.encodeClaimENSNode(nameOrHashOrAddress));
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
    await this.require({
      wallet: false,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannel(hash);
  }

  async getP2PPaymentChannels(senderOrRecipient: string = null, page = 1): Promise<P2PPaymentChannels> {
    await this.require({
      wallet: !senderOrRecipient,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannels(this.prepareAccountAddress(senderOrRecipient), page);
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
    mode: BatchCommitP2PPaymentChannelModes = BatchCommitP2PPaymentChannelModes.Deposit,
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

    return mode === BatchCommitP2PPaymentChannelModes.Withdraw
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
    mode: BatchCommitP2PPaymentChannelModes = BatchCommitP2PPaymentChannelModes.Deposit,
  ): Promise<Batch> {
    await this.require({
      wallet: false,
    });

    return this.batchTransactionRequest(await this.encodeCommitP2PPaymentChannel(hash, mode));
  }

  // hub payments

  async getPaymentHub(hub: string = null, token: string = null): Promise<PaymentHub> {
    await this.require({
      wallet: !hub,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHub(this.prepareAccountAddress(hub), token);
  }

  async getPaymentHubs(hub?: string, token?: string, page: number = null): Promise<PaymentHubs> {
    await this.require({
      network: true,
      wallet: typeof hub === 'undefined',
    });

    if (typeof hub === 'undefined') {
      hub = this.prepareAccountAddress(hub);
    }

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubs(hub, token, page);
  }

  async getPaymentHubDeposit(hub: string, owner: string = null, token: string = null): Promise<PaymentHubDeposit> {
    await this.require({
      wallet: !owner,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubDeposit(hub, this.prepareAccountAddress(owner), token);
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

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubDeposits(hub, this.prepareAccountAddress(owner), tokens, page);
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

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubPayments(hub, this.prepareAccountAddress(senderOrRecipient), token, page);
  }

  async createPaymentHubPayment(
    hub: string,
    recipient: string,
    value: BigNumberish,
    token: string = null,
  ): Promise<PaymentHubPayment> {
    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.createPaymentHubPayment(hub, recipient, BigNumber.from(value), token);
  }

  async updatePaymentHub(liquidity: BigNumberish, token: string = null): Promise<PaymentHub> {
    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.updatePaymentHub(BigNumber.from(liquidity), token);
  }

  async updatePaymentHubDeposit(
    hub: string,
    totalAmount: BigNumberish = null,
    token: string = null,
  ): Promise<PaymentHubDeposit> {
    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.updatePaymentHubDeposit(hub, totalAmount ? BigNumber.from(totalAmount) : null, token);
  }

  // relayer

  async getRelayedTransaction(key: string): Promise<RelayedTransaction> {
    await this.require({
      network: true,
      wallet: false,
    });

    return this.services.relayerService.getRelayedTransaction(key);
  }

  async getRelayedTransactions(account: string = null, page: number = null): Promise<RelayedTransactions> {
    await this.require({
      wallet: !account,
    });

    return this.services.relayerService.getRelayedTransactions(this.prepareAccountAddress(account), page);
  }

  // private

  private async require(
    options: {
      network?: boolean;
      wallet?: boolean;
      session?: boolean;
      contractAccount?: boolean;
    } = {},
  ): Promise<void> {
    options = {
      network: true,
      wallet: true,
      ...options,
    };

    const { accountService, authService, networkService, walletService } = this.services;

    if (options.network && !networkService.chainId) {
      throw new Error('Unknown network');
    }

    if (options.wallet && !walletService.walletAddress) {
      throw new Error('Require wallet');
    }

    if (options.session) {
      await authService.verifySession();
    }

    if (options.contractAccount && (!accountService.account || accountService.account.type !== AccountTypes.Contract)) {
      throw new Error('Require contract account');
    }
  }

  private prepareAccountAddress(account: string = null): string {
    const {
      accountService: { accountAddress },
    } = this.services;
    return account || accountAddress;
  }
}

import { Wallet, BigNumber, BigNumberish, BytesLike } from 'ethers';
import { Subject } from 'rxjs';
import { Account, AccountBalance, AccountMembers, Accounts, AccountService, AccountTypes } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { BatchService, Batch } from './batch';
import { BlockService } from './block';
import { Context } from './context';
import { WalletLike, walletFrom } from './common';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';
import { ENSNode, ENSService, parseENSName, ENSNodeStates } from './ens';
import { prepareEnv } from './env';
import { SdkOptions } from './interfaces';
import { Network, NetworkNames, NetworkService } from './network';
import { Notification, NotificationService } from './notification';
import { PaymentService, PaymentDeposit, PaymentChannel, PaymentChannels } from './payment';
import { RelayerService, RelayedTransaction } from './relayer';
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

    const env = prepareEnv(options.env);

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
      paymentService: new PaymentService(),
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

  switchNetwork(networkName: NetworkNames = null): Network {
    return this.services.networkService.switchNetwork(networkName);
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

  async getAccountBalances(address: string, tokens: string[] = []): Promise<AccountBalance[]> {
    return this.services.accountService.getAccountBalances(address, tokens);
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

  // ens (batch)

  async batchClaimENSNode(nameOrHashOrAddress: string): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const ensNode = await this.getENSNode(nameOrHashOrAddress);

    if (!ensNode || ensNode.state !== ENSNodeStates.Reserved) {
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

  // payments

  async syncPaymentDeposits(tokens: string[] = []): Promise<PaymentDeposit[]> {
    await this.require({
      session: true,
    });

    const { accountService, paymentService } = this.services;

    return paymentService.syncPaymentDeposits(accountService.accountAddress, tokens);
  }

  async getPaymentChannel(hash: string): Promise<PaymentChannel> {
    const { paymentService } = this.services;

    return paymentService.getPaymentChannel(hash);
  }

  async getPaymentChannels(senderOrRecipient: string = null, page = 1): Promise<PaymentChannels> {
    await this.require({
      wallet: !senderOrRecipient,
    });

    const { accountService, paymentService } = this.services;

    if (!senderOrRecipient) {
      senderOrRecipient = accountService.accountAddress;
    }

    return paymentService.getPaymentChannels(senderOrRecipient, page);
  }

  async increasePaymentChannelAmount(
    recipient: string,
    value: BigNumberish,
    token: string = null,
  ): Promise<PaymentChannel> {
    await this.require({
      session: true,
    });

    const { paymentService } = this.services;

    return paymentService.increasePaymentChannelAmount(recipient, token, BigNumber.from(value));
  }

  async updatePaymentChannel(
    recipient: string,
    totalAmount: BigNumberish,
    token: string = null,
  ): Promise<PaymentChannel> {
    await this.require({
      session: true,
    });

    const { paymentService } = this.services;

    return paymentService.updatePaymentChannel(recipient, token, BigNumber.from(totalAmount));
  }

  // payments (batch)

  async batchCommitPaymentChannel(
    hash: string,
    mode: BatchCommitPaymentChannelModes = BatchCommitPaymentChannelModes.Deposit,
  ): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    const paymentChannel = await this.getPaymentChannel(hash);

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
    const { batchService } = this.services;

    const transactionRequest =
      mode === BatchCommitPaymentChannelModes.Withdraw
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

    return batchService.pushTransactionRequest(transactionRequest);
  }

  // relayer

  async getRelayedTransaction(key: string): Promise<RelayedTransaction> {
    return this.services.relayerService.getRelayedTransaction(key);
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

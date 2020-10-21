import { BigNumber } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { Account, AccountBalances, AccountMembers, Accounts, AccountService, AccountTypes } from './account';
import { ApiService } from './api';
import { AuthService, Session } from './auth';
import { BatchService, Batch } from './batch';
import { BlockService } from './block';
import { Context } from './context';
import { ErrorSubject, Exception, TransactionRequest, UnChainedTypedData } from './common';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';
import {
  AddAccountOwnerDto,
  ClaimENSNodeDto,
  CommitP2PPaymentChannelDto,
  ComputeContractAccountDto,
  CreatePaymentHubPaymentDto,
  CreateSessionDto,
  EstimateBatchDto,
  ExecuteAccountTransactionDto,
  GetAccountBalancesDto,
  GetAccountDto,
  GetAccountMembersDto,
  GetENSNodeDto,
  GetP2PPaymentChannelDto,
  GetP2PPaymentChannelsDto,
  GetPaymentHubBridgeDto,
  GetPaymentHubBridgesDto,
  GetPaymentHubDepositDto,
  GetPaymentHubDepositsDto,
  GetPaymentHubDto,
  GetPaymentHubPaymentDto,
  GetPaymentHubPaymentsDto,
  GetPaymentHubsDto,
  GetRelayedTransactionDto,
  GetRelayedTransactionsDto,
  IncreaseP2PPaymentChannelAmountDto,
  JoinContractAccountDto,
  PaginationDto,
  RemoveAccountOwnerDto,
  ReserveENSNameDto,
  SignMessageDto,
  SignP2PPaymentChannelDto,
  SubmitBatchDto,
  SyncP2PPaymentDepositsDto,
  TransactionRequestDto,
  TransferPaymentHubDepositDto,
  UpdateP2PPaymentChannelDto,
  UpdatePaymentHubBridgeDto,
  UpdatePaymentHubDepositDto,
  UpdatePaymentHubDto,
  validateDto,
} from './dto';
import { ENSNode, ENSService, parseENSName, ENSNodeStates } from './ens';
import { Env, EnvNames } from './env';
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
  PaymentHubBridge,
  PaymentHubBridges,
} from './payments';
import { RelayerService, RelayedTransaction, RelayedTransactions } from './relayer';
import { State, StateService } from './state';
import { WalletService, WalletOptions, parseWalletOptions } from './wallet';
import { SdkOptions } from './interfaces';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {
  private readonly context: Context;
  private readonly contracts: Context['contracts'];
  private readonly services: Context['services'];

  constructor(walletOptions: WalletOptions, sdkOptions?: EnvNames | SdkOptions);
  constructor(sdkOptions?: EnvNames | SdkOptions);
  constructor(...args: any[]) {
    let walletOptions: WalletOptions = null;
    let sdkOptions: SdkOptions = {};

    if (args.length > 0) {
      let optionsIndex = 0;

      walletOptions = parseWalletOptions(args[0]);

      if (walletOptions) {
        ++optionsIndex;
      }

      if (args[optionsIndex]) {
        switch (typeof args[optionsIndex]) {
          case 'string':
            sdkOptions = {
              env: args[optionsIndex],
            };
            break;

          case 'object':
            sdkOptions = args[optionsIndex];
            break;
        }
      }
    }

    const env = Env.prepare(sdkOptions.env);

    this.contracts = {
      ensControllerContract: new ENSControllerContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    };

    this.services = {
      networkService: new NetworkService(env.networkOptions),
      walletService: new WalletService(walletOptions),
      accountService: new AccountService(),
      apiService: new ApiService(env.apiOptions),
      authService: new AuthService(),
      batchService: new BatchService(),
      blockService: new BlockService(),
      ensService: new ENSService(),
      notificationService: new NotificationService(),
      p2pPaymentsService: new P2pPaymentService(),
      paymentHubService: new PaymentHubService(),
      relayerService: new RelayerService(),
      stateService: new StateService(sdkOptions.state),
    };

    this.context = new Context(this.contracts, this.services);
  }

  // exposes

  get api(): ApiService {
    return this.services.apiService;
  }

  get notifications$(): Subject<Notification> {
    return this.services.notificationService.subscribeNotifications();
  }

  get state(): StateService {
    return this.services.stateService;
  }

  get state$(): BehaviorSubject<State> {
    return this.services.stateService.state$;
  }

  get error$(): ErrorSubject {
    return this.context.error$;
  }

  get supportedNetworks(): Network[] {
    return this.services.networkService.supportedNetworks;
  }

  // sdk

  /**
   * destroys
   */
  destroy(): void {
    this.context.destroy();
  }

  // wallet

  /**
   * switches wallet provider
   * @param walletOptions
   */
  switchWalletProvider(walletOptions: WalletOptions): void {
    walletOptions = parseWalletOptions(walletOptions);

    if (!walletOptions) {
      throw new Exception('Invalid wallet options');
    }

    this.services.walletService.switchWalletProvider(walletOptions);
  }

  /**
   * personal signs message
   * @param dto
   * @return Promise<string>
   */
  async personalSignMessage(dto: SignMessageDto): Promise<string> {
    const { message } = await validateDto(dto, SignMessageDto);

    await this.require({
      network: false,
    });

    return this.services.walletService.personalSignMessage(message);
  }

  /**
   * signs message
   * @param dto
   * @return Promise<string>
   */
  async signMessage(dto: SignMessageDto): Promise<string> {
    const { message } = await validateDto(dto, SignMessageDto);

    await this.require({
      network: false,
    });

    return this.services.walletService.signMessage(message);
  }

  /**
   * sings typed data
   * @param unChainedTypedData
   * @return Promise<string>
   */
  async signTypedData(unChainedTypedData: UnChainedTypedData): Promise<string> {
    await this.require();

    return this.services.walletService.signTypedData(unChainedTypedData);
  }

  // session

  /**
   * creates session
   * @param dto
   * @return Promise<Session>
   */
  async createSession(dto: CreateSessionDto = {}): Promise<Session> {
    const { ttl } = await validateDto(dto, CreateSessionDto);

    await this.require();

    return this.services.authService.createSession(ttl);
  }

  // batch

  /**
   * batch transaction request
   * @param dto
   * @return Promise<Batch>
   */
  async batchTransactionRequest(dto: TransactionRequestDto): Promise<Batch> {
    const { to, data } = await validateDto(dto, TransactionRequestDto);

    await this.require({
      contractAccount: true,
    });

    const { batchService } = this.services;

    return batchService.pushTransactionRequest({
      to,
      data,
    });
  }

  /**
   * estimates batch
   * @param dto
   * @return Promise<Batch>
   */
  async estimateBatch(dto: EstimateBatchDto = {}): Promise<Batch> {
    const { refundToken } = await validateDto(dto, EstimateBatchDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.batchService.estimateBatch(refundToken);
  }

  /**
   * submits batch
   * @param dto
   * @return Promise<Batch>
   */
  async submitBatch(dto: SubmitBatchDto = {}): Promise<RelayedTransaction> {
    const { gasPrice } = await validateDto(dto, SubmitBatchDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.batchService.submitBatch(gasPrice ? BigNumber.from(gasPrice) : null);
  }

  /**
   * clears batch
   */
  clearBatch(): void {
    this.services.batchService.clearBatch();
  }

  // account

  /**
   * syncs account
   * @return Promise<Account>
   */
  async syncAccount(): Promise<Account> {
    await this.require({
      session: true,
    });

    return this.services.accountService.syncAccount();
  }

  /**
   * computes contract account
   * @param dto
   * @return Promise<Account>
   */
  async computeContractAccount(dto: ComputeContractAccountDto = {}): Promise<Account> {
    const { sync } = await validateDto(dto, ComputeContractAccountDto);

    await this.require({
      session: sync,
    });

    const { accountService } = this.services;

    accountService.computeContractAccount();

    if (sync) {
      await accountService.syncAccount();
    }

    return accountService.account;
  }

  /**
   * joins contract account
   * @param dto
   * @return Promise<Account>
   */
  async joinContractAccount(dto: JoinContractAccountDto): Promise<Account> {
    const { address, sync } = await validateDto(dto, JoinContractAccountDto);

    await this.require({
      session: sync,
    });

    const { accountService } = this.services;

    accountService.joinContractAccount(address);

    if (sync) {
      await accountService.syncAccount();
    }

    return accountService.account;
  }

  /**
   * gets connected accounts
   * @param dto
   * @return Promise<Accounts>
   */
  async getConnectedAccounts(dto: PaginationDto = {}): Promise<Accounts> {
    const { page } = await validateDto(dto, PaginationDto);

    await this.require({
      session: true,
    });

    return this.services.accountService.getConnectedAccounts(page || 1);
  }

  /**
   * get account
   * @param dto
   * @return Promise<Account>
   */
  async getAccount(dto: GetAccountDto = {}): Promise<Account> {
    const { address } = await validateDto(dto, GetAccountDto);

    await this.require({
      wallet: !address,
    });

    return this.services.accountService.getAccount(
      this.prepareAccountAddress(address), //
    );
  }

  /**
   * gets account balances
   * @param dto
   * @return Promise<AccountBalances>
   */
  async getAccountBalances(dto: GetAccountBalancesDto = {}): Promise<AccountBalances> {
    const { account, tokens } = await validateDto(dto, GetAccountBalancesDto);

    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccountBalances(
      this.prepareAccountAddress(account), //
      tokens,
    );
  }

  /**
   * gets account members
   * @param dto
   * @return Promise<AccountMembers>
   */
  async getAccountMembers(dto: GetAccountMembersDto = {}): Promise<AccountMembers> {
    const { account, page } = await validateDto(dto, GetAccountMembersDto);

    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccountMembers(
      this.prepareAccountAddress(account), //
      page || 1,
    );
  }

  // account (batch)

  /**
   * batch add account owner
   * @param dto
   * @return Promise<Batch>
   */
  async batchAddAccountOwner(dto: AddAccountOwnerDto): Promise<Batch> {
    const { owner } = await validateDto(dto, AddAccountOwnerDto);

    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService } = this.services;

    return this.batchTransactionRequest(
      personalAccountRegistryContract.encodeAddAccountOwner(accountService.accountAddress, owner),
    );
  }

  /**
   * batch remove account owner
   * @param dto
   * @return Promise<Batch>
   */
  async batchRemoveAccountOwner(dto: RemoveAccountOwnerDto): Promise<Batch> {
    const { owner } = await validateDto(dto, RemoveAccountOwnerDto);

    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService } = this.services;

    return this.batchTransactionRequest(
      personalAccountRegistryContract.encodeRemoveAccountOwner(accountService.accountAddress, owner),
    );
  }

  /**
   * batch execute account transaction
   * @param dto
   * @return Promise<Batch>
   */
  async batchExecuteAccountTransaction(dto: ExecuteAccountTransactionDto): Promise<Batch> {
    const { to, value, data } = await validateDto(dto, ExecuteAccountTransactionDto);

    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService } = this.services;

    return this.batchTransactionRequest(
      personalAccountRegistryContract.encodeExecuteAccountTransaction(
        accountService.accountAddress, //
        to,
        value || 0,
        data || '0x',
      ),
    );
  }

  // ens

  /**
   * reserve ens name
   * @param dto
   * @return Promise<ENSNode>
   */
  async reserveENSName(dto: ReserveENSNameDto): Promise<ENSNode> {
    const { name } = await validateDto(dto, ReserveENSNameDto);

    await this.require({
      session: true,
    });

    return this.services.ensService.createENSSubNode(name);
  }

  /**
   * gets ens node
   * @param dto
   * @return Promise<ENSNode>
   */
  async getENSNode(dto: GetENSNodeDto = {}): Promise<ENSNode> {
    const { nameOrHashOrAddress } = await validateDto(dto, ClaimENSNodeDto);

    await this.require({
      wallet: !nameOrHashOrAddress,
    });

    const { ensService } = this.services;

    return ensService.getENSNode(
      this.prepareAccountAddress(nameOrHashOrAddress), //
    );
  }

  // ens (encode)

  /**
   * encodes claim ens node
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeClaimENSNode(dto: ClaimENSNodeDto = {}): Promise<TransactionRequest> {
    const { nameOrHashOrAddress } = await validateDto(dto, ClaimENSNodeDto);

    await this.require({
      wallet: !nameOrHashOrAddress,
    });

    const ensNode = await this.getENSNode({
      nameOrHashOrAddress,
    });

    if (!ensNode || ensNode.state !== ENSNodeStates.Reserved) {
      throw new Exception('Can not clime ens node');
    }

    const { name, guardianSignature } = ensNode;

    const parsedName = parseENSName(name);

    const { ensControllerContract } = this.contracts;

    return ensControllerContract.encodeRegisterSubNode(
      parsedName.root.hash, //
      parsedName.labelHash,
      guardianSignature,
    );
  }

  // ens (batch)

  /**
   * batch claim ens node
   * @param dto
   * @return Promise<Batch>
   */
  async batchClaimENSNode(dto: ClaimENSNodeDto = {}): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchTransactionRequest(await this.encodeClaimENSNode(dto));
  }

  // p2p payments

  /**
   * syncs p2p payment deposits
   * @param dto
   * @return Promise<P2PPaymentDeposits>
   */
  async syncP2PPaymentDeposits(dto: SyncP2PPaymentDepositsDto = {}): Promise<P2PPaymentDeposits> {
    const { tokens } = await validateDto(dto, SyncP2PPaymentDepositsDto);

    await this.require({
      session: true,
    });

    const { accountService, p2pPaymentsService } = this.services;

    return p2pPaymentsService.syncP2PPaymentDeposits(accountService.accountAddress, tokens);
  }

  /**
   * gets p2p payment channel
   * @param dto
   * @return Promise<P2PPaymentChannel>
   */
  async getP2PPaymentChannel(dto: GetP2PPaymentChannelDto): Promise<P2PPaymentChannel> {
    const { hash } = await validateDto(dto, GetP2PPaymentChannelDto);

    await this.require({
      wallet: false,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannel(hash);
  }

  /**
   * gets p2p payment channels
   * @param dto
   * @return Promise<P2PPaymentChannels>
   */
  async getP2PPaymentChannels(dto: GetP2PPaymentChannelsDto = {}): Promise<P2PPaymentChannels> {
    const { senderOrRecipient, page } = await validateDto(dto, GetP2PPaymentChannelsDto);

    await this.require({
      wallet: !senderOrRecipient,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannels(
      this.prepareAccountAddress(senderOrRecipient), //
      page || 1,
    );
  }

  /**
   * increases p2p payment channel amount
   * @param dto
   * @return Promise<P2PPaymentChannel>
   */
  async increaseP2PPaymentChannelAmount(dto: IncreaseP2PPaymentChannelAmountDto): Promise<P2PPaymentChannel> {
    const { recipient, token, value } = await validateDto(dto, IncreaseP2PPaymentChannelAmountDto);

    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.increaseP2PPaymentChannelAmount(
      recipient, //
      token,
      BigNumber.from(value),
    );
  }

  /**
   * updates p2p payment channel
   * @param dto
   * @return Promise<P2PPaymentChannel>
   */
  async updateP2PPaymentChannel(dto: UpdateP2PPaymentChannelDto): Promise<P2PPaymentChannel> {
    const { recipient, token, totalAmount } = await validateDto(dto, UpdateP2PPaymentChannelDto);

    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.updateP2PPaymentChannel(
      recipient, //
      token,
      BigNumber.from(totalAmount),
    );
  }

  /**
   * signs p2p payment channel
   * @param dto
   * @return Promise<P2PPaymentChannel>
   */
  async signP2PPaymentChannel(dto: SignP2PPaymentChannelDto): Promise<P2PPaymentChannel> {
    const { hash } = await validateDto(dto, SignP2PPaymentChannelDto);

    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.signP2PPaymentChannel(hash);
  }

  // p2p payments (encode)

  /**
   * encodes commit p2p payment channel
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeCommitP2PPaymentChannel(dto: CommitP2PPaymentChannelDto): Promise<TransactionRequest> {
    const { hash, deposit } = await validateDto(dto, CommitP2PPaymentChannelDto);

    await this.require();

    const paymentChannel = await this.getP2PPaymentChannel({
      hash,
    });

    if (!paymentChannel) {
      throw new Exception('Payment channel not found');
    }

    const {
      sender,
      token,
      uid,
      totalAmount,
      latestPayment: { blockNumber, senderSignature, guardianSignature },
    } = paymentChannel;

    const { paymentRegistryContract } = this.contracts;

    return deposit
      ? paymentRegistryContract.encodeCommitPaymentChannelAndDeposit(
          sender,
          token,
          uid,
          blockNumber,
          totalAmount,
          senderSignature,
          guardianSignature,
        )
      : paymentRegistryContract.encodeCommitPaymentChannelAndWithdraw(
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

  /**
   * batch commit p2p payment channel
   * @param dto
   * @return Promise<Batch>
   */
  async batchCommitP2PPaymentChannel(dto: CommitP2PPaymentChannelDto): Promise<Batch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchTransactionRequest(await this.encodeCommitP2PPaymentChannel(dto));
  }

  // hub payments

  /**
   * gets payment hub
   * @param dto
   * @return Promise<PaymentHub>
   */
  async getPaymentHub(dto: GetPaymentHubDto): Promise<PaymentHub> {
    const { hub, token } = await validateDto(dto, GetPaymentHubDto);

    await this.require({
      wallet: !hub,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHub(
      this.prepareAccountAddress(hub), //
      token,
    );
  }

  /**
   * gets payment hubs
   * @param dto
   * @return Promise<PaymentHubs>
   */
  async getPaymentHubs(dto: GetPaymentHubsDto = {}): Promise<PaymentHubs> {
    dto = await validateDto(dto, GetPaymentHubsDto);

    const { token, page } = dto;
    let { hub } = dto;

    await this.require({
      network: true,
      wallet: typeof hub === 'undefined',
    });

    if (typeof hub === 'undefined') {
      hub = this.prepareAccountAddress(hub);
    }

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubs(
      hub, //
      token,
      page || 1,
    );
  }

  /**
   * gets payment hub bridge
   * @param dto
   * @return Promise<PaymentHubBridge>
   */
  async getPaymentHubBridge(dto: GetPaymentHubBridgeDto = {}): Promise<PaymentHubBridge> {
    const { hub, token, acceptedNetworkName, acceptedToken } = await validateDto(dto, GetPaymentHubBridgeDto);

    await this.require({
      wallet: !hub,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubBridge(
      this.prepareAccountAddress(hub), //
      token,
      this.getNetworkChainId(acceptedNetworkName),
      acceptedToken,
    );
  }

  /**
   * gets payment hub bridges
   * @param dto
   * @return Promise<PaymentHubBridges>
   */
  async getPaymentHubBridges(dto: GetPaymentHubBridgesDto): Promise<PaymentHubBridges> {
    const { hub, token, acceptedNetworkName, page } = await validateDto(dto, GetPaymentHubBridgesDto);

    await this.require({
      wallet: !hub,
    });

    let acceptedChainId: number;

    if (typeof acceptedNetworkName === 'undefined') {
      acceptedChainId = this.getNetworkChainId(acceptedNetworkName);
    }

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubBridges(
      this.prepareAccountAddress(hub), //
      token,
      acceptedChainId,
      page || 1,
    );
  }

  /**
   * gets payment hub deposit
   * @param dto
   * @return Promise<PaymentHubDeposit>
   */
  async getPaymentHubDeposit(dto: GetPaymentHubDepositDto): Promise<PaymentHubDeposit> {
    const { hub, token, owner } = await validateDto(dto, GetPaymentHubDepositDto);

    await this.require({
      wallet: !owner,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubDeposit(hub, token, this.prepareAccountAddress(owner));
  }

  /**
   * gets payment hub deposits
   * @param dto
   * @return Promise<PaymentHubDeposits>
   */
  async getPaymentHubDeposits(dto: GetPaymentHubDepositsDto): Promise<PaymentHubDeposits> {
    const { hub, tokens, owner, page } = await validateDto(dto, GetPaymentHubDepositsDto);

    await this.require({
      wallet: !owner,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubDeposits(
      hub, //
      tokens || [],
      this.prepareAccountAddress(owner),
      page || 1,
    );
  }

  /**
   * gets payment hub payment
   * @param dto
   * @return Promise<PaymentHubPayment>
   */
  async getPaymentHubPayment(dto: GetPaymentHubPaymentDto): Promise<PaymentHubPayment> {
    const { hash } = await validateDto(dto, GetPaymentHubPaymentDto);

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubPayment(hash);
  }

  /**
   * gets payment hub payments
   * @param dto
   * @return Promise<PaymentHubPayments>
   */
  async getPaymentHubPayments(dto: GetPaymentHubPaymentsDto): Promise<PaymentHubPayments> {
    const { hub, token, senderOrRecipient, page } = await validateDto(dto, GetPaymentHubPaymentsDto);

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.getPaymentHubPayments(
      hub, //
      token,
      this.prepareAccountAddress(senderOrRecipient),
      page || 1,
    );
  }

  /**
   * creates payment hub payment
   * @param dto
   * @return Promise<PaymentHubPayment>
   */
  async createPaymentHubPayment(dto: CreatePaymentHubPaymentDto): Promise<PaymentHubPayment> {
    const { hub, token, recipient, value } = await validateDto(dto, CreatePaymentHubPaymentDto);

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.createPaymentHubPayment(
      hub, //
      token,
      recipient,
      BigNumber.from(value),
    );
  }

  /**
   * updates payment hub
   * @param dto
   * @return Promise<PaymentHub>
   */
  async updatePaymentHub(dto: UpdatePaymentHubDto = {}): Promise<PaymentHub> {
    const { token, liquidity } = await validateDto(dto, UpdatePaymentHubDto);

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.updatePaymentHub(
      BigNumber.from(liquidity || 0), //
      token,
    );
  }

  /**
   * updates payment hub deposit
   * @param dto
   * @return Promise<PaymentHubDeposit>
   */
  async updatePaymentHubDeposit(dto: UpdatePaymentHubDepositDto): Promise<PaymentHubDeposit> {
    const { hub, token, totalAmount } = await validateDto(dto, UpdatePaymentHubDepositDto);

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.updatePaymentHubDeposit(
      hub, //
      BigNumber.from(totalAmount || 0),
      token,
    );
  }

  /**
   * transfers payment hub deposit
   * @param dto
   * @return Promise<PaymentHubDeposit>
   */
  async transferPaymentHubDeposit(dto: TransferPaymentHubDepositDto): Promise<PaymentHubDeposit> {
    const { hub, token, value, targetNetworkName, targetHub, targetToken } = await validateDto(
      dto,
      TransferPaymentHubDepositDto,
    );

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.transferPaymentHubDeposit(
      hub,
      token,
      BigNumber.from(value),
      this.getNetworkChainId(targetNetworkName),
      targetHub,
      targetToken,
    );
  }

  /**
   * activates payment hub bridge
   * @param dto
   * @return Promise<PaymentHubBridge>
   */
  async activatePaymentHubBridge(dto: UpdatePaymentHubBridgeDto): Promise<PaymentHubBridge> {
    const { token, acceptedNetworkName, acceptedToken } = await validateDto(dto, UpdatePaymentHubBridgeDto);

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.activatePaymentHubBridge(
      token,
      this.getNetworkChainId(acceptedNetworkName),
      acceptedToken,
    );
  }

  /**
   * deactivates payment hub bridge
   * @param dto
   * @return Promise<PaymentHubBridge>
   */
  async deactivatePaymentHubBridge(dto: UpdatePaymentHubBridgeDto): Promise<PaymentHubBridge> {
    const { token, acceptedNetworkName, acceptedToken } = await validateDto(dto, UpdatePaymentHubBridgeDto);

    await this.require({
      session: true,
    });

    const { paymentHubService } = this.services;

    return paymentHubService.deactivatePaymentHubBridge(
      token,
      this.getNetworkChainId(acceptedNetworkName),
      acceptedToken,
    );
  }

  // relayer

  /**
   * gets relayed transaction
   * @param dto
   * @return Promise<RelayedTransaction>
   */
  async getRelayedTransaction(dto: GetRelayedTransactionDto): Promise<RelayedTransaction> {
    const { key } = await validateDto(dto, GetRelayedTransactionDto);

    await this.require({
      wallet: false,
    });

    return this.services.relayerService.getRelayedTransaction(key);
  }

  /**
   * gets relayed transactions
   * @param dto
   * @return Promise<RelayedTransactions>
   */
  async getRelayedTransactions(dto: GetRelayedTransactionsDto = {}): Promise<RelayedTransactions> {
    const { account, page } = await validateDto(dto, GetRelayedTransactionsDto);

    await this.require({
      wallet: !account,
    });

    return this.services.relayerService.getRelayedTransactions(
      this.prepareAccountAddress(account), //
      page || 1,
    );
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
      throw new Exception('Unknown network');
    }

    if (options.wallet && !walletService.walletAddress) {
      throw new Exception('Require wallet');
    }

    if (options.session) {
      await authService.verifySession();
    }

    if (options.contractAccount && (!accountService.account || accountService.account.type !== AccountTypes.Contract)) {
      throw new Exception('Require contract account');
    }
  }

  private prepareAccountAddress(account: string = null): string {
    const {
      accountService: { accountAddress },
    } = this.services;
    return account || accountAddress;
  }

  private getNetworkChainId(networkName: NetworkNames = null): number {
    let result: number;

    if (!networkName) {
      ({ chainId: result } = this.services.networkService);
    } else {
      const network = this.supportedNetworks.find(({ name }) => name === networkName);

      if (!network) {
        throw new Exception('Unsupported network');
      }

      ({ chainId: result } = network);
    }

    return result;
  }
}

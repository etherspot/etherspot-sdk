import { BigNumber, utils, Wallet, Contract as EthersContract } from 'ethers';
import { ContractNames, getContractAbi } from '@etherspot/contracts';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  Account,
  AccountBalances,
  AccountMembers,
  Accounts,
  AccountService,
  AccountSettings,
  AccountTotalBalances,
  AccountTypes,
} from './account';
import { ApiService } from './api';
import { AssetsService, NativeCurrenciesItem, PaginatedTokens, TokenList, TokenListToken } from './assets';
import { BlockService } from './block';
import { addressesEqual, ErrorSubject, Exception, TransactionRequest } from './common';
import { Context } from './context';
import {
  Contract,
  ContractAddresses,
  ContractService,
  ENSControllerContract,
  ENSReverseRegistrarContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contract';
import {
  AddAccountOwnerDto,
  BatchGatewayTransactionRequestDto,
  CallCurrentProjectDto,
  CancelGatewayBatchDto,
  CancelGatewayBatchDto as ForceGatewayBatchDto,
  ClaimENSNodeDto,
  CommitP2PPaymentChannelDto,
  ComputeContractAccountDto,
  ComputeContractAccountByAddressDto,
  CreatePaymentHubPaymentDto,
  CreateSessionDto,
  CustomProjectMetadataDto,
  EncodeGatewayBatchDto,
  EstimateGatewayBatchDto,
  EstimateGatewayKnownOpDto,
  ExecuteAccountTransactionDto,
  GetAccountBalancesDto,
  GetAccountDto,
  GetAccountMembersDto,
  GetCrossChainBridgeRouteDto,
  GetENSNodeDto,
  GetENSRootNodeDto,
  GetExchangeCrossChainQuoteDto,
  GetExchangeOffersDto,
  GetGatewaySubmittedBatchDto,
  GetGatewaySubmittedBatchDto as GetGatewayTransactionDto,
  GetGatewaySupportedTokenDto,
  GetP2PPaymentChannelDto,
  GetP2PPaymentChannelsDto,
  GetP2PPaymentDepositsDto,
  GetPaymentHubBridgeDto,
  GetPaymentHubBridgesDto,
  GetPaymentHubDepositDto,
  GetPaymentHubDepositsDto,
  GetPaymentHubDto,
  GetPaymentHubPaymentDto,
  GetPaymentHubPaymentsDto,
  GetPaymentHubsDto,
  GetProjectDto,
  GetTokenListDto,
  IncreaseP2PPaymentChannelAmountDto,
  IsTokenOnTokenListDto,
  JoinContractAccountDto,
  PaginationDto,
  RemoveAccountOwnerDto,
  ReserveENSNameDto,
  SetENSRecordNameDto,
  SetENSRecordTextDto,
  SignMessageDto,
  SignP2PPaymentChannelDto,
  SwitchCurrentProjectDto,
  TransferPaymentHubDepositDto,
  UpdateAccountSettingsDto,
  UpdateP2PPaymentChannelDto,
  UpdatePaymentHubBridgeDto,
  UpdatePaymentHubDepositDto,
  UpdatePaymentHubDto,
  UpdateProjectDto,
  validateDto,
  WithdrawP2PPaymentDepositDto,
  P2PPaymentDepositWithdrawalDto,
  ENSAddressesLookupDto,
  ENSNamesLookupDto,
  GetTransactionDto,
  GetTransactionsDto,
  GetAccountTotalBalancesDto,
  ReserveENSNameDto as ValidateENSNameDto,
  GetNftListDto,
  IsEligibleForAirdropDto,
  GetCrossChainBridgeTokenListDto,
  GetP2PPaymentChannelsAdminDto,
  CreateStreamTransactionPayloadDto,
  GetCrossChainBridgeSupportedChainsDto,
  DeleteStreamTransactionPayloadDto,
  GetStreamListDto,
  GetExchangeSupportedAssetsDto,
  FetchExchangeRatesDto,
} from './dto';
import { ENSNode, ENSNodeStates, ENSRootNode, ENSService, parseENSName } from './ens';
import { Env, EnvNames } from './env';
import {
  CrossChainBridgeSupportedChain,
  CrossChainBridgeToken,
  CrossChainBridgeRoute,
  ExchangeOffer,
  ExchangeService,
  CrossChainBridgeBuildTXResponse,
  BridgingQuotes,
} from './exchange';

import { FaucetService } from './faucet';
import {
  GatewayBatch,
  GatewayEstimatedKnownOp,
  GatewayGasInfo,
  GatewayService,
  GatewaySubmittedBatch,
  GatewaySubmittedBatches,
  GatewaySubmittedPendingBatches,
  GatewaySupportedToken,
  GatewayTransaction,
} from './gateway';
import { SdkOptions } from './interfaces';
import { Network, NetworkNames, NetworkService } from './network';
import { Notification, NotificationService } from './notification';
import {
  P2PPaymentChannel,
  P2PPaymentChannels,
  P2PPaymentDeposits,
  P2PPaymentService,
  PaymentHub,
  PaymentHubBridge,
  PaymentHubBridges,
  PaymentHubDeposit,
  PaymentHubDeposits,
  PaymentHubPayment,
  PaymentHubPayments,
  PaymentHubs,
  PaymentHubService,
} from './payments';
import { CurrentProject, Project, Projects, ProjectService } from './project';
import { Rates } from './rates';
import { Session, SessionService } from './session';
import {
  Transactions,
  Transaction,
  TransactionsService,
  NftList,
  StreamTransactionPayload,
  StreamList,
} from './transactions';
import { State, StateService } from './state';
import { WalletService, isWalletProvider, WalletProviderLike } from './wallet';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {
  readonly internalContracts: Context['internalContracts'];
  readonly services: Context['services'];

  protected context: Context;

  constructor(walletProvider: WalletProviderLike, optionsLike?: EnvNames | SdkOptions) {
    let options: SdkOptions = {};

    if (!isWalletProvider(walletProvider)) {
      throw new Exception('Invalid wallet provider');
    }

    if (optionsLike) {
      switch (typeof optionsLike) {
        case 'string':
          options = {
            env: optionsLike,
          };
          break;

        case 'object':
          options = optionsLike;
          break;
      }
    }

    const env = Env.prepare(options.env);

    const {
      networkName, //
      omitWalletProviderNetworkCheck,
      projectKey,
      projectMetadata,
      stateStorage,
      sessionStorage,
    } = options;

    const { apiOptions, networkOptions } = env;

    this.internalContracts = {
      ensControllerContract: new ENSControllerContract(),
      ensReverseRegistrarContract: new ENSReverseRegistrarContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    };

    this.services = {
      networkService: new NetworkService(networkOptions, networkName),
      walletService: new WalletService(walletProvider, {
        omitProviderNetworkCheck: omitWalletProviderNetworkCheck,
      }),
      sessionService: new SessionService({
        storage: sessionStorage,
      }),
      accountService: new AccountService(),
      apiService: new ApiService(apiOptions),
      assetsService: new AssetsService(),
      blockService: new BlockService(),
      ensService: new ENSService(),
      exchangeService: new ExchangeService(),
      faucetService: new FaucetService(),
      gatewayService: new GatewayService(),
      notificationService: new NotificationService(),
      p2pPaymentsService: new P2PPaymentService(),
      paymentHubService: new PaymentHubService(),
      projectService: new ProjectService({
        key: projectKey,
        metadata: projectMetadata,
      }),
      transactionsService: new TransactionsService(),
      stateService: new StateService({
        storage: stateStorage,
      }),
      contractService: new ContractService(),
    };

    this.context = new Context(this.internalContracts, this.services);
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

  // session

  /**
   * creates session
   * @param dto
   * @return Promise<Session>
   */
  async createSession(dto: CreateSessionDto = {}): Promise<Session> {
    const { ttl, fcmToken } = await validateDto(dto, CreateSessionDto);

    await this.require();

    return this.services.sessionService.createSession(ttl, fcmToken);
  }

  // gateway

  /**
   * gets gateway supported token
   * @param dto
   * @return Promise<GatewaySupportedToken>
   */
  async getGatewaySupportedToken(dto: GetGatewaySupportedTokenDto): Promise<GatewaySupportedToken> {
    const { token } = await validateDto(dto, GetGatewaySupportedTokenDto, {
      addressKeys: ['token'],
    });

    const { gatewayService } = this.services;

    return gatewayService.getGatewaySupportedToken(token);
  }

  /**
   * gets gateway supported tokens
   * @return Promise<GatewaySupportedToken[]>
   */
  async getGatewaySupportedTokens(): Promise<GatewaySupportedToken[]> {
    return this.services.gatewayService.getGatewaySupportedTokens();
  }

  /**
   * gets gateway submitted batch
   * @param dto
   * @return Promise<GatewaySubmittedBatch>
   */
  async getGatewaySubmittedBatch(dto: GetGatewaySubmittedBatchDto): Promise<GatewaySubmittedBatch> {
    const { hash } = await validateDto(dto, GetGatewaySubmittedBatchDto);

    return this.services.gatewayService.getGatewaySubmittedBatch(hash);
  }

  /**
   * gets gateway submitted batches
   * @param dto
   * @return Promise<GatewaySubmittedBatches>
   */
  async getGatewaySubmittedBatches(dto: PaginationDto = {}): Promise<GatewaySubmittedBatches> {
    const { page } = await validateDto(dto, PaginationDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.gatewayService.getGatewaySubmittedBatches(page || 1);
  }

  /**
   * gets gateway submitted pending batches
   * @param dto
   * @return Promise<GatewaySubmittedPendingBatches>
   */
  async getGatewaySubmittedPendingBatches(dto: PaginationDto = {}): Promise<GatewaySubmittedPendingBatches> {
    const { page } = await validateDto(dto, PaginationDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.gatewayService.getGatewaySubmittedPendingBatches(page || 1);
  }

  /**
   * gets gateway transaction details
   * @param dto
   * @return Promise<GatewayTransaction>
   */
  async getGatewayTransaction(dto: GetGatewayTransactionDto): Promise<GatewayTransaction> {
    const { hash } = await validateDto(dto, GetGatewayTransactionDto);

    return this.services.gatewayService.getGatewayTransaction(hash);
  }

  /**
   * gets gateway's gas info
   * @return Promise<GatewayGasInfo>
   */
  async getGatewayGasInfo(): Promise<GatewayGasInfo> {
    return this.services.gatewayService.getGatewayGasInfo();
  }

  /**
   * batches gateway transaction request
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchGatewayTransactionRequest(dto: BatchGatewayTransactionRequestDto): Promise<GatewayBatch> {
    const { to, data } = await validateDto(dto, BatchGatewayTransactionRequestDto, {
      addressKeys: ['to'],
    });

    await this.require();

    const { gatewayService } = this.services;
    return gatewayService.batchGatewayTransactionRequest({
      to,
      data,
    });
  }

  /**
   * estimates gateway known op
   * @param dto
   * @return Promise<GatewayEstimatedKnownOp>
   */
  async estimateGatewayKnownOp(dto: EstimateGatewayKnownOpDto): Promise<GatewayEstimatedKnownOp> {
    const { op, feeToken } = await validateDto(dto, EstimateGatewayKnownOpDto, {
      addressKeys: ['feeToken'],
    });

    await this.require({
      session: true,
    });

    return this.services.gatewayService.estimateGatewayKnownOp(op, feeToken);
  }

  /**
   * estimates gateway batch
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async estimateGatewayBatch(dto: EstimateGatewayBatchDto = {}): Promise<GatewayBatch> {
    const { feeToken } = await validateDto(dto, EstimateGatewayBatchDto, {
      addressKeys: ['feeToken'],
    });

    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.gatewayService.estimateGatewayBatch(feeToken);
  }

  /**
   * estimates stateless account transactions
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async estimateStatelessAccountTransactions(
    transactionsDto: ExecuteAccountTransactionDto[],
    estimationDto: EstimateGatewayBatchDto = {},
  ): Promise<GatewayBatch> {
    const { gatewayService } = this.services;

    const gatewayBatch: GatewayBatch = {
      requests: [],
      estimation: null,
    };

    const { feeToken } = await validateDto(estimationDto, EstimateGatewayBatchDto, {
      addressKeys: ['feeToken'],
    });

    for (const transactionDto of transactionsDto) {
      const encodedAccountTransaction = await this.encodeExecuteAccountTransaction(transactionDto);
      const { to, data } = encodedAccountTransaction;
      gatewayBatch.requests.push({
        to,
        data: utils.hexlify(data),
      });
    }

    return gatewayService.estimateGatewayBatch(feeToken, gatewayBatch);
  }

  /**
   * submits gateway batch
   * @param dto
   * @return Promise<GatewaySubmittedBatch>
   */
  async submitGatewayBatch(dto: CustomProjectMetadataDto = {}): Promise<GatewaySubmittedBatch> {
    const { customProjectMetadata } = await validateDto(dto, CustomProjectMetadataDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    const { gatewayService, projectService } = this.services;

    return projectService.withCustomProjectMetadata(
      customProjectMetadata, //
      () => gatewayService.submitGatewayBatch(),
    );
  }

  /**
   * cancels gateway batch
   * @param dto
   * @return Promise<GatewaySubmittedBatch>
   */
  async cancelGatewayBatch(dto: CancelGatewayBatchDto): Promise<GatewaySubmittedBatch> {
    const { hash } = await validateDto(dto, CancelGatewayBatchDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    const { gatewayService } = this.services;

    return gatewayService.cancelGatewayBatch(hash);
  }

  /**
   * forces gateway batch
   * @param dto
   * @return Promise<GatewaySubmittedBatch>
   */
  async forceGatewayBatch(dto: ForceGatewayBatchDto): Promise<GatewaySubmittedBatch> {
    const { hash } = await validateDto(dto, ForceGatewayBatchDto);

    await this.require({
      session: true,
      contractAccount: true,
    });

    const { gatewayService } = this.services;

    return gatewayService.forceGatewayBatch(hash);
  }

  /**
   * encodes gateway batch
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeGatewayBatch(dto: EncodeGatewayBatchDto = {}): Promise<TransactionRequest> {
    const { delegate } = await validateDto(dto, EncodeGatewayBatchDto);

    await this.require();

    return this.services.gatewayService.encodeGatewayBatch(delegate);
  }

  /**
   * clears gateway batch
   */
  clearGatewayBatch(): void {
    this.services.gatewayService.clearGatewayBatch();
  }

  // projects

  /**
   * switches current project
   * @param dto
   * @return Promise<CurrentProject>
   */
  async switchCurrentProject(dto: SwitchCurrentProjectDto = null): Promise<CurrentProject> {
    let currentProject: CurrentProject = null;

    if (dto) {
      currentProject = await validateDto(dto, SwitchCurrentProjectDto);
    }

    return this.services.projectService.switchCurrentProject(currentProject);
  }

  /**
   * calls current project
   * @param dto
   * @return Promise<any>
   */
  async callCurrentProject<T extends {} = any>(dto: CallCurrentProjectDto = {}): Promise<T> {
    await this.require({
      session: true,
      currentProject: true,
    });

    const { payload, customProjectMetadata } = await validateDto(dto, CallCurrentProjectDto);

    const { projectService } = this.services;

    return projectService.withCustomProjectMetadata(
      customProjectMetadata, //
      () => projectService.callCurrentProject(payload),
    );
  }

  /**
   * gets project
   * @param dto
   * @return Promise<Project>
   */
  async getProject(dto: GetProjectDto): Promise<Project> {
    const { key } = await validateDto(dto, GetProjectDto);

    return this.services.projectService.getProject(key);
  }

  /**
   * gets projects
   * @param dto
   * @return Promise<Projects>
   */
  async getProjects(dto: PaginationDto): Promise<Projects> {
    await this.require({
      session: true,
    });

    const { page } = await validateDto(dto, PaginationDto);

    return this.services.projectService.getProjects(page || 1);
  }

  /**
   * updates project
   * @param dto
   * @return Promise<Project>
   */
  async updateProject(dto: UpdateProjectDto): Promise<Project> {
    await this.require({
      session: true,
    });

    const { key, privateKey, endpoint } = await validateDto(dto, UpdateProjectDto);

    return this.services.projectService.updateProject(key, privateKey, endpoint);
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
   * computes contract account by custom address
   * @param dto
   * @return Promise<string>
   */
  async computeContractAccountByAddress(dto: ComputeContractAccountByAddressDto): Promise<string> {
    const { address } = await validateDto(dto, ComputeContractAccountByAddressDto);

    const { personalAccountRegistryContract } = this.internalContracts;
    return personalAccountRegistryContract.computeAccountAddress(address);
  }

  /**
   * joins contract account
   * @param dto
   * @return Promise<Account>
   */
  async joinContractAccount(dto: JoinContractAccountDto): Promise<Account> {
    const { address, sync } = await validateDto(dto, JoinContractAccountDto, {
      addressKeys: ['address'],
    });

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
    const { address } = await validateDto(dto, GetAccountDto, {
      addressKeys: ['address'],
    });

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
    const { account, tokens, chainId } = await validateDto(dto, GetAccountBalancesDto, {
      addressKeys: ['account', 'tokens'],
    });

    await this.require({
      wallet: !account,
    });

    const ChainId = chainId ? chainId : this.services.networkService.chainId;

    return this.services.accountService.getAccountBalances(
      this.prepareAccountAddress(account), //
      tokens,
      ChainId,
    );
  }

  /**
   * gets account total balances
   * @param dto
   * @return Promise<AccountTotalBalances>
   */
  async getAccountTotalBalances(dto: GetAccountTotalBalancesDto): Promise<AccountTotalBalances> {
    const { account, currency } = await validateDto(dto, GetAccountTotalBalancesDto, {
      addressKeys: ['account'],
    });

    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccountTotalBalances(
      this.prepareAccountAddress(account), //
      currency,
    );
  }

  /**
   * gets account members
   * @param dto
   * @return Promise<AccountMembers>
   */
  async getAccountMembers(dto: GetAccountMembersDto = {}): Promise<AccountMembers> {
    const { account, page } = await validateDto(dto, GetAccountMembersDto, {
      addressKeys: ['account'],
    });

    await this.require({
      wallet: !account,
    });

    return this.services.accountService.getAccountMembers(
      this.prepareAccountAddress(account), //
      page || 1,
    );
  }

  /**
   * gets delay transaction options
   * @return Promise<number[]>
   */
  async getDelayTransactionOptions(): Promise<number[]> {
    await this.require({
      session: true,
    });

    return this.services.accountService.getDelayTransactionOptions();
  }

  /**
   * gets account settings
   * @return Promise<AccountSettings>
   */
  async getAccountSettings(): Promise<AccountSettings> {
    await this.require({
      contractAccount: true,
    });

    return this.services.accountService.getAccountSettings();
  }

  /**
   * updates account settings
   * @return Promise<AccountSettings>
   */
  async updateAccountSettings(dto: UpdateAccountSettingsDto): Promise<AccountSettings> {
    await this.require({
      contractAccount: true,
    });

    return this.services.accountService.updateAccountSettings(dto);
  }

  /**
   * check if account is eligible for an airdrop
   * @return Promise<boolean>
   */
  async isEligibleForAirdrop(dto: IsEligibleForAirdropDto): Promise<boolean> {
    return this.services.accountService.isEligibleForAirdrop(dto);
  }

  // account (encode)

  /**
   * encodes deploy account
   * @return Promise<TransactionRequest>
   */
  async encodeDeployAccount(): Promise<TransactionRequest> {
    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.internalContracts;
    const { accountService } = this.services;

    return personalAccountRegistryContract.encodeDeployAccount(accountService.accountAddress);
  }

  /**
   * encodes add account owner
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeAddAccountOwner(dto: AddAccountOwnerDto): Promise<TransactionRequest> {
    const { owner } = await validateDto(dto, AddAccountOwnerDto, {
      addressKeys: ['owner'],
    });

    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.internalContracts;
    const { accountService } = this.services;

    return personalAccountRegistryContract.encodeAddAccountOwner(accountService.accountAddress, owner);
  }

  /**
   * encodes remove account owner
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeRemoveAccountOwner(dto: RemoveAccountOwnerDto): Promise<TransactionRequest> {
    const { owner } = await validateDto(dto, RemoveAccountOwnerDto, {
      addressKeys: ['owner'],
    });

    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.internalContracts;
    const { accountService } = this.services;

    return personalAccountRegistryContract.encodeRemoveAccountOwner(accountService.accountAddress, owner);
  }

  /**
   * encodes execute account transaction
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeExecuteAccountTransaction(dto: ExecuteAccountTransactionDto): Promise<TransactionRequest> {
    const { to, value, data } = await validateDto(dto, ExecuteAccountTransactionDto, {
      addressKeys: ['to'],
    });

    await this.require({
      contractAccount: true,
    });

    const { personalAccountRegistryContract } = this.internalContracts;
    const { accountService } = this.services;

    if (addressesEqual(accountService.accountAddress, to)) {
      throw new Exception('Destination address should not be the same as sender address');
    }

    return personalAccountRegistryContract.encodeExecuteAccountTransaction(
      accountService.accountAddress, //
      to,
      value || 0,
      data || '0x',
    );
  }

  // account (batch)

  /**
   * batch deploy account
   * @return Promise<GatewayBatch>
   */
  async batchDeployAccount(): Promise<GatewayBatch> {
    return this.batchGatewayTransactionRequest(await this.encodeDeployAccount());
  }

  /**
   * batch add account owner
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchAddAccountOwner(dto: AddAccountOwnerDto): Promise<GatewayBatch> {
    return this.batchGatewayTransactionRequest(await this.encodeAddAccountOwner(dto));
  }

  /**
   * batch remove account owner
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchRemoveAccountOwner(dto: RemoveAccountOwnerDto): Promise<GatewayBatch> {
    return this.batchGatewayTransactionRequest(await this.encodeRemoveAccountOwner(dto));
  }

  /**
   * batch execute account transaction
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchExecuteAccountTransaction(dto: ExecuteAccountTransactionDto): Promise<GatewayBatch> {
    const transactionRequest = await this.encodeExecuteAccountTransaction(dto);
    return this.batchGatewayTransactionRequest(transactionRequest);
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

    return this.services.ensService.reserveENSNode(name);
  }

  /**
   * validate ens name
   * @param dto
   * @return Promise<ENSNode>
   */
  async validateENSName(dto: ValidateENSNameDto): Promise<boolean> {
    const { name } = await validateDto(dto, ValidateENSNameDto);

    await this.require({
      session: true,
    });

    return this.services.ensService.validateENSNode(name);
  }

  /**
   * gets ens node
   * @param dto
   * @return Promise<ENSNode>
   */
  async getENSNode(dto: GetENSNodeDto = {}): Promise<ENSNode> {
    const { nameOrHashOrAddress } = await validateDto(dto, GetENSNodeDto);

    await this.require({
      wallet: !nameOrHashOrAddress,
    });

    const { ensService } = this.services;

    return ensService.getENSNode(
      this.prepareAccountAddress(nameOrHashOrAddress), //
    );
  }

  /**
   * gets ens root node
   * @param dto
   * @return Promise<ENSRootNode>
   */
  async getENSRootNode(dto: GetENSRootNodeDto): Promise<ENSRootNode> {
    const { name } = await validateDto(dto, GetENSRootNodeDto);

    await this.require({
      wallet: false,
    });

    const { ensService } = this.services;

    return ensService.getENSRootNode(name);
  }

  /**
   * gets ens top level domains
   * @return Promise<string[]>
   */
  async getENSTopLevelDomains(): Promise<string[]> {
    await this.require({
      wallet: false,
    });

    const { ensService } = this.services;

    return ensService.getENSTopLevelDomains();
  }

  /**
   * ens addresses lookup
   * @param dto
   * @return Promise<string[]>
   */
  async ensAddressesLookup(dto: ENSAddressesLookupDto): Promise<string[]> {
    const { names } = await validateDto(dto, ENSAddressesLookupDto);

    await this.require({
      wallet: false,
    });

    const { ensService } = this.services;

    return ensService.ensAddressesLookup(names);
  }

  /**
   * ens names lookup
   * @param dto
   * @return Promise<string[]>
   */
  async ensNamesLookup(dto: ENSNamesLookupDto): Promise<string[]> {
    const { addresses } = await validateDto(dto, ENSNamesLookupDto);

    await this.require({
      wallet: false,
    });

    const { ensService } = this.services;

    return ensService.ensNamesLookup(addresses);
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
      throw new Exception('Can not claim ens node');
    }

    const { name, guardianSignature } = ensNode;

    const parsedName = parseENSName(name);

    const { ensControllerContract } = this.internalContracts;

    return ensControllerContract.encodeRegisterSubNode(
      parsedName.root.hash, //
      parsedName.labelHash,
      guardianSignature,
    );
  }

  /**
   * encodes set ens record name
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeSetENSRecordName(dto: SetENSRecordNameDto = {}): Promise<TransactionRequest> {
    let { name } = await validateDto(dto, SetENSRecordNameDto);
    await this.require();

    const { accountService } = this.services;
    const { accountAddress } = accountService;

    const ensNode = await this.getENSNode({
      nameOrHashOrAddress: accountAddress,
    });

    if (!ensNode) {
      throw new Exception('Can not set ens record name');
    }

    const { hash } = ensNode;

    if (!name) {
      ({ name } = ensNode);
    }

    const { ensControllerContract } = this.internalContracts;

    return ensControllerContract.encodeSetName(hash, name);
  }

  /**
   * encodes set ens record text
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeSetENSRecordText(dto: SetENSRecordTextDto): Promise<TransactionRequest> {
    const { key, value } = await validateDto(dto, SetENSRecordTextDto);

    await this.require();

    const { accountService } = this.services;
    const { accountAddress } = accountService;

    const ensNode = await this.getENSNode({
      nameOrHashOrAddress: accountAddress,
    });

    if (!ensNode) {
      throw new Exception('Can not set ens record text');
    }

    const { hash } = ensNode;

    const { ensControllerContract } = this.internalContracts;

    return ensControllerContract.encodeSetText(hash, key, value);
  }

  /**
   * encodes claim ens reverse name
   * @return Promise<TransactionRequest>
   */
  async encodeClaimENSReverseName(): Promise<TransactionRequest> {
    await this.require();

    const { accountService, ensService } = this.services;
    const { accountAddress } = accountService;

    const ensNode = await this.getENSNode({
      nameOrHashOrAddress: accountAddress,
    });

    if (!ensNode) {
      throw new Exception('Can not claim ens reverse name');
    }

    const { name } = ensNode;

    const { ensReverseRegistrarContract } = this.internalContracts;

    const { data } = ensReverseRegistrarContract.encodeSetName(name);
    const to = await ensService.ensAddrReversOwner;

    const { personalAccountRegistryContract } = this.internalContracts;

    return personalAccountRegistryContract.encodeExecuteAccountTransaction(
      accountService.accountAddress, //
      to,
      0,
      data,
    );
  }

  // ens (batch)

  /**
   * batch claim ens node
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchClaimENSNode(dto: ClaimENSNodeDto = {}): Promise<GatewayBatch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchGatewayTransactionRequest(await this.encodeClaimENSNode(dto));
  }

  /**
   * batch set ens record name
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchSetENSRecordName(dto: SetENSRecordNameDto = {}): Promise<GatewayBatch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchGatewayTransactionRequest(await this.encodeSetENSRecordName(dto));
  }

  /**
   * batch set ens record text
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchSetENSRecordText(dto: SetENSRecordTextDto): Promise<GatewayBatch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchGatewayTransactionRequest(await this.encodeSetENSRecordText(dto));
  }

  /**
   * batch claim ens reverse name
   * @return Promise<GatewayBatch>
   */
  async batchClaimENSReverseName(): Promise<GatewayBatch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchGatewayTransactionRequest(await this.encodeClaimENSReverseName());
  }

  // exchange

  /**
   * gets exchange supported tokens
   * @param dto
   * @return Promise<PaginatedTokens>
   */
  async getExchangeSupportedAssets(dto: GetExchangeSupportedAssetsDto = {}): Promise<PaginatedTokens> {
    const { page, limit, chainId } = await validateDto(dto, GetExchangeSupportedAssetsDto);

    await this.require({
      session: true,
    });

    const getChainId = chainId ? chainId : this.services.networkService.chainId;

    return this.services.exchangeService.getExchangeSupportedAssets(page, limit, getChainId);
  }

  /**
   * gets exchange offers
   * @param dto
   * @return Promise<ExchangeOffer[]>
   */
  async getExchangeOffers(dto: GetExchangeOffersDto): Promise<ExchangeOffer[]> {
    const { fromTokenAddress, toTokenAddress, fromAmount } = await validateDto(dto, GetExchangeOffersDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress'],
    });

    await this.require({
      session: true,
      contractAccount: true,
    });

    return this.services.exchangeService.getExchangeOffers(
      fromTokenAddress, //
      toTokenAddress,
      BigNumber.from(fromAmount),
    );
  }

  getCrossChainBridgeSupportedChains(
    dto?: GetCrossChainBridgeSupportedChainsDto,
  ): Promise<CrossChainBridgeSupportedChain[]> {
    return this.services.exchangeService.getCrossChainBridgeSupportedChains(dto);
  }

  getCrossChainBridgeTokenList(dto: GetCrossChainBridgeTokenListDto): Promise<CrossChainBridgeToken[]> {
    return this.services.exchangeService.getCrossChainBridgeTokenList(dto);
  }

  findCrossChainBridgeRoutes(dto: GetCrossChainBridgeRouteDto): Promise<CrossChainBridgeRoute[]> {
    return this.services.exchangeService.findCrossChainBridgeRoutes(dto);
  }

  buildCrossChainBridgeTransaction(dto: CrossChainBridgeRoute): Promise<CrossChainBridgeBuildTXResponse> {
    return this.services.exchangeService.buildCrossChainBridgeTransaction(dto);
  }

  /**
   * gets multi chain quotes
   * @param dto
   * @return Promise<MutliChainQuotes>
   */
  async getCrossChainQuotes(dto: GetExchangeCrossChainQuoteDto): Promise<BridgingQuotes> {
    const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, fromAmount, serviceProvider } = await validateDto(
      dto,
      GetExchangeCrossChainQuoteDto,
      {
        addressKeys: ['fromTokenAddress', 'toTokenAddress'],
      },
    );

    await this.require({
      session: true,
    });

    let { chainId } = this.services.networkService;
    chainId = fromChainId ? fromChainId : chainId;

    return this.services.exchangeService.getCrossChainQuotes(
      fromTokenAddress,
      toTokenAddress,
      chainId,
      toChainId,
      BigNumber.from(fromAmount),
      serviceProvider,
    );
  }

  // p2p payments

  /**
   * gets p2p payment deposits
   * @param dto
   * @return Promise<P2PPaymentDeposits>
   */
  async getP2PPaymentDeposits(dto: GetP2PPaymentDepositsDto = {}): Promise<P2PPaymentDeposits> {
    const { tokens } = await validateDto(dto, GetP2PPaymentDepositsDto, {
      addressKeys: ['tokens'],
    });

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
    const { senderOrRecipient, uncommittedOnly, page } = await validateDto(dto, GetP2PPaymentChannelsDto, {
      addressKeys: ['senderOrRecipient'],
    });

    await this.require({
      wallet: !senderOrRecipient,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannels(
      this.prepareAccountAddress(senderOrRecipient), //
      { uncommittedOnly },
      page || 1,
    );
  }

  /**
   * gets p2p payment channels admin
   * @param dto
   * @return Promise<P2PPaymentChannels>
   */
  async getP2PPaymentChannelsAdmin(dto: GetP2PPaymentChannelsAdminDto = {}): Promise<P2PPaymentChannels> {
    const validatedDto = await validateDto(dto, GetP2PPaymentChannelsAdminDto, {
      addressKeys: ['sender', 'recipient', 'token'],
    });

    await this.require({
      wallet: true,
      currentProject: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.getP2PPaymentChannelsAdmin(validatedDto);
  }

  /**
   * increases p2p payment channel amount
   * @param dto
   * @return Promise<P2PPaymentChannel>
   */
  async increaseP2PPaymentChannelAmount(dto: IncreaseP2PPaymentChannelAmountDto): Promise<P2PPaymentChannel> {
    const { recipient, token, value } = await validateDto(dto, IncreaseP2PPaymentChannelAmountDto, {
      addressKeys: ['recipient', 'token'],
    });

    await this.require({
      session: true,
      currentProject: true,
    });

    const { accountService, p2pPaymentsService, projectService } = this.services;

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const saltDate = todayUTC.toISOString().slice(0, 10).replace(/-/g, '');

    return p2pPaymentsService.increaseP2PPaymentChannelAmount(
      recipient, //
      token,
      BigNumber.from(value),
      `${accountService.accountAddress}${projectService.currentProject.key}${token}${saltDate}`,
    );
  }

  /**
   * updates p2p payment channel
   * @param dto
   * @return Promise<P2PPaymentChannel>
   */
  async updateP2PPaymentChannel(dto: UpdateP2PPaymentChannelDto): Promise<P2PPaymentChannel> {
    const { recipient, token, totalAmount } = await validateDto(dto, UpdateP2PPaymentChannelDto, {
      addressKeys: ['recipient', 'token'],
    });

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
   * encodes withdraw p2p payment deposit
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeWithdrawP2PPaymentDeposit(dto: WithdrawP2PPaymentDepositDto): Promise<TransactionRequest> {
    const { token, amount } = await validateDto(dto, WithdrawP2PPaymentDepositDto, {
      addressKeys: ['token'],
    });

    await this.require({
      session: true,
    });

    const { p2pPaymentsService } = this.services;

    return p2pPaymentsService.buildP2PPaymentDepositWithdrawalTransactionRequest(
      await p2pPaymentsService.decreaseP2PPaymentDeposit(token, BigNumber.from(amount)),
    );
  }

  /**
   * encodes p2p payment deposit withdrawal
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async encodeP2PPaymentDepositWithdrawal(dto: P2PPaymentDepositWithdrawalDto): Promise<TransactionRequest> {
    const { token } = await validateDto(dto, P2PPaymentDepositWithdrawalDto, {
      addressKeys: ['token'],
    });

    await this.require({
      session: true,
    });

    const { accountService, p2pPaymentsService } = this.services;
    const { accountAddress } = accountService;

    return p2pPaymentsService.buildP2PPaymentDepositWithdrawalTransactionRequest(
      await p2pPaymentsService.syncP2PPaymentDeposit(accountAddress, token),
    );
  }

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

    const { paymentRegistryContract } = this.internalContracts;

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
   * batch withdraw p2p payment deposit
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchWithdrawP2PPaymentDeposit(dto: WithdrawP2PPaymentDepositDto): Promise<GatewayBatch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchGatewayTransactionRequest(await this.encodeWithdrawP2PPaymentDeposit(dto));
  }

  /**
   * batch p2p payment deposit withdrawal
   * @param dto
   * @return Promise<TransactionRequest>
   */
  async batchP2PPaymentDepositWithdrawal(dto: P2PPaymentDepositWithdrawalDto): Promise<GatewayBatch> {
    await this.require({
      contractAccount: true,
    });

    return this.batchGatewayTransactionRequest(await this.encodeP2PPaymentDepositWithdrawal(dto));
  }

  /**
   * batch commit p2p payment channel
   * @param dto
   * @return Promise<GatewayBatch>
   */
  async batchCommitP2PPaymentChannel(dto: CommitP2PPaymentChannelDto): Promise<GatewayBatch> {
    await this.require();

    return this.batchGatewayTransactionRequest(await this.encodeCommitP2PPaymentChannel(dto));
  }

  // hub payments

  /**
   * gets payment hub
   * @param dto
   * @return Promise<PaymentHub>
   */
  async getPaymentHub(dto: GetPaymentHubDto): Promise<PaymentHub> {
    const { hub, token } = await validateDto(dto, GetPaymentHubDto, {
      addressKeys: ['hub', 'token'],
    });

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
    dto = await validateDto(dto, GetPaymentHubsDto, {
      addressKeys: ['hub', 'token'],
    });

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
    const { hub, token, acceptedNetworkName, acceptedToken } = await validateDto(dto, GetPaymentHubBridgeDto, {
      addressKeys: ['hub', 'token', 'acceptedToken'],
    });

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
    const { hub, token, acceptedNetworkName, page } = await validateDto(dto, GetPaymentHubBridgesDto, {
      addressKeys: ['hub', 'token'],
    });

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
    const { hub, token, owner } = await validateDto(dto, GetPaymentHubDepositDto, {
      addressKeys: ['hub', 'token', 'owner'],
    });

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
    const { hub, tokens, owner, page } = await validateDto(dto, GetPaymentHubDepositsDto, {
      addressKeys: ['hub', 'tokens', 'owner'],
    });

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
    const { hub, token, senderOrRecipient, page } = await validateDto(dto, GetPaymentHubPaymentsDto, {
      addressKeys: ['hub', 'token', 'senderOrRecipient'],
    });

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
    const { hub, token, recipient, value } = await validateDto(dto, CreatePaymentHubPaymentDto, {
      addressKeys: ['hub', 'token', 'recipient'],
    });

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
    const { token, liquidity } = await validateDto(dto, UpdatePaymentHubDto, {
      addressKeys: ['token'],
    });

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
    const { hub, token, totalAmount } = await validateDto(dto, UpdatePaymentHubDepositDto, {
      addressKeys: ['hub', 'token'],
    });

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
      {
        addressKeys: ['hub', 'token', 'targetHub', 'targetToken'],
      },
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
    const { token, acceptedNetworkName, acceptedToken } = await validateDto(dto, UpdatePaymentHubBridgeDto, {
      addressKeys: ['token', 'acceptedToken'],
    });

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
    const { token, acceptedNetworkName, acceptedToken } = await validateDto(dto, UpdatePaymentHubBridgeDto, {
      addressKeys: ['token', 'acceptedToken'],
    });

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

  // assets

  /**
   * gets token lists
   * @return Promise<TokenList[]>
   */
  async getTokenLists(): Promise<TokenList[]> {
    await this.require({
      wallet: false,
    });

    return this.services.assetsService.getTokenLists();
  }

  /**
   * gets token list tokens
   * @param dto
   * @return Promise<TokenListToken[]>
   */
  async getTokenListTokens(dto: GetTokenListDto = {}): Promise<TokenListToken[]> {
    const { name } = await validateDto(dto, GetTokenListDto);

    await this.require({
      wallet: false,
    });

    return this.services.assetsService.getTokenListTokens(name);
  }

  /**
   * gets native currencies
   * @return Promise<NativeCurrenciesItem[]>
   */
  async getNativeCurrencies(): Promise<NativeCurrenciesItem[]> {
    return this.services.assetsService.getNativeCurrencies();
  }

  /**
   * gets account token list tokens
   * @param dto
   * @return Promise<TokenListToken[]>
   */
  async getAccountTokenListTokens(dto: GetTokenListDto = {}): Promise<TokenListToken[]> {
    const { name } = await validateDto(dto, GetTokenListDto);

    await this.require({
      session: true,
    });

    return this.services.assetsService.getAccountTokenListTokens(name);
  }

  /**
   * checks if token is on token list
   * @param dto
   * @return Promise<boolean>
   */
  async isTokenOnTokenList(dto: IsTokenOnTokenListDto): Promise<boolean> {
    const { token, name } = await validateDto(dto, IsTokenOnTokenListDto, {
      addressKeys: ['token'],
    });

    await this.require({
      wallet: false,
    });

    return this.services.assetsService.isTokenOnTokenList(token, name);
  }

  // transactions

  /**
   * gets transaction
   * @param dto
   * @return Promise<Transaction>
   */
  async getTransaction(dto: GetTransactionDto): Promise<Transaction> {
    const { hash } = await validateDto(dto, GetTransactionDto);

    await this.require({
      wallet: false,
    });

    return this.services.transactionsService.getTransaction(hash);
  }

  /**
   * gets transactions
   * @param dto
   * @return Promise<Transactions>
   */
  async getTransactions(dto: GetTransactionsDto): Promise<Transactions> {
    const { account } = await validateDto(dto, GetTransactionsDto, {
      addressKeys: ['account'],
    });

    await this.require({
      wallet: !account,
      contractAccount: true,
    });

    return this.services.transactionsService.getTransactions(
      this.prepareAccountAddress(account), //
    );
  }

  /**
   * gets NFT list belonging to account
   * @param dto
   * @return Promise<NftList>
   */
  async getNftList(dto: GetNftListDto): Promise<NftList> {
    const { account } = await validateDto(dto, GetNftListDto, {
      addressKeys: ['account'],
    });

    await this.require({
      wallet: !account,
    });

    return this.services.transactionsService.getNftList(
      this.prepareAccountAddress(account), //
    );
  }

  /**
   * returns transaction payload for creating stream of supertoken
   * @param dto
   * @return Promise<StreamTransactionPayload>
   */

  async createStreamTransactionPayload(dto: CreateStreamTransactionPayloadDto): Promise<StreamTransactionPayload> {
    const { tokenAddress, receiver, amount, account, userData, skipBalanceCheck } = await validateDto(
      dto,
      CreateStreamTransactionPayloadDto,
      {
        addressKeys: ['tokenAddress', 'receiver', 'account'],
      },
    );

    await this.require({
      session: true,
      wallet: !account,
      contractAccount: true,
    });

    return this.services.transactionsService.createStreamTransactionPayload(
      this.prepareAccountAddress(account),
      receiver,
      BigNumber.from(amount),
      tokenAddress,
      userData ? userData : '0x',
      skipBalanceCheck,
    );
  }

  async deleteStreamTransactionPayload(dto: DeleteStreamTransactionPayloadDto): Promise<StreamTransactionPayload> {
    const { tokenAddress, receiver, account, userData } = await validateDto(dto, DeleteStreamTransactionPayloadDto, {
      addressKeys: ['tokenAddress', 'receiver', 'account'],
    });

    await this.require({
      session: true,
      wallet: !account,
      contractAccount: true,
    });

    return this.services.transactionsService.deleteStreamTransactionPayload(
      this.prepareAccountAddress(account),
      receiver,
      tokenAddress,
      userData,
    );
  }

  async modifyStreamTransactionPayload(dto: CreateStreamTransactionPayloadDto): Promise<StreamTransactionPayload> {
    const { tokenAddress, receiver, amount, account, userData } = await validateDto(
      dto,
      CreateStreamTransactionPayloadDto,
      {
        addressKeys: ['tokenAddress', 'receiver', 'account'],
      },
    );

    await this.require({
      session: true,
      wallet: !account,
      contractAccount: true,
    });

    return this.services.transactionsService.modifyStreamTransactionPayload(
      this.prepareAccountAddress(account),
      receiver,
      BigNumber.from(amount),
      tokenAddress,
      userData,
    );
  }

  async getStreamList(dto: GetStreamListDto = {}): Promise<StreamList> {
    const { account } = await validateDto(dto, GetStreamListDto, {
      addressKeys: ['account'],
    });

    await this.require({
      session: true,
      wallet: !account,
      contractAccount: true,
    });

    return this.services.transactionsService.getStreamList(this.prepareAccountAddress(account));
  }

  /**
   * wraps erc20 token to super token
   * @return Promise<string | null>
   */
  async createSuperERC20WrapperTransactionPayload(
    underlyingToken: string,
    underlyingDecimals?: number,
    name?: string,
    symbol?: string,
  ): Promise<StreamTransactionPayload> {
    return this.services.transactionsService.createSuperERC20WrapperTransactionPayload(
      underlyingToken,
      underlyingDecimals,
      name,
      symbol,
    );
  }

  // utils

  /**
   * top-up account
   * @return Promise<string>
   */
  async topUpAccount(): Promise<string> {
    await this.require();

    return this.services.faucetService.topUpAccount();
  }

  /**
   * top-up account
   * @return Promise<string>
   */
  async topUpPaymentDepositAccount(): Promise<string> {
    await this.require();

    return this.services.faucetService.topUpPaymentDepositAccount();
  }

  async topUp(value: string): Promise<void> {
    if (!this.services.accountService.isContractAccount())
      await this.computeContractAccount({
        sync: false,
      });
    const wallet: Partial<Wallet> = this.services.walletService.walletProvider;
    if (!wallet) throw new Exception('The provider is missing');
    const nonce = await wallet.getTransactionCount();
    const account = this.state.accountAddress;
    const response = await wallet.sendTransaction({
      to: account,
      value: utils.parseEther(value),
      nonce,
    });
    await response.wait();
  }

  async topUpP2P(value: string): Promise<void> {
    if (!this.services.accountService.isContractAccount())
      await this.computeContractAccount({
        sync: false,
      });
    const wallet: Partial<Wallet> = this.services.walletService.walletProvider;
    if (!wallet) throw new Exception('The provider is missing');
    const nonce = await wallet.getTransactionCount();
    const account = this.state.p2pPaymentDepositAddress;
    const response = await wallet.sendTransaction({
      to: account,
      value: utils.parseEther(value),
      nonce,
    });
    await response.wait();
  }

  async topUpToken(value: string, contractAddress: string): Promise<void> {
    if (!this.services.accountService.isContractAccount())
      await this.computeContractAccount({
        sync: false,
      });
    const account = this.state.accountAddress;
    await this.transferTokens(account, value, contractAddress);
  }

  async topUpTokenP2P(value: string, contractAddress: string): Promise<void> {
    if (!this.services.accountService.isContractAccount())
      await this.computeContractAccount({
        sync: false,
      });

    const account = this.state.p2pPaymentDepositAddress;
    await this.transferTokens(account, value, contractAddress);
  }

  private async transferTokens(account: string, value: string, contractAddress: string): Promise<void> {
    const provider = this.services.walletService.walletProvider as any;
    const abi = getContractAbi(ContractNames.ERC20Token);
    if (!provider) throw new Exception(`The provider is missing`);
    const contract = new EthersContract(contractAddress, abi, provider);
    const tx = await contract.transfer(account, value);
    await tx.wait();
  }

  /**
   * registers contract
   * @param name
   * @param abi
   * @param addresses
   * @return Contract
   */
  registerContract<T extends {} = {}>(
    name: string,
    abi: any,
    addresses: ContractAddresses = null,
  ): Contract & Partial<T> {
    return this.services.contractService.registerContract<T>(name, abi, addresses);
  }

  // private

  private async require(
    options: {
      network?: boolean;
      wallet?: boolean;
      session?: boolean;
      contractAccount?: boolean;
      currentProject?: boolean;
    } = {},
  ): Promise<void> {
    options = {
      network: true,
      wallet: true,
      ...options,
    };

    const { accountService, networkService, walletService, sessionService, projectService } = this.services;

    if (options.network && !networkService.chainId) {
      throw new Exception('Unknown network');
    }

    if (options.wallet && !walletService.walletAddress) {
      throw new Exception('Require wallet');
    }

    if (options.session) {
      await sessionService.verifySession();
    }

    if (options.contractAccount && (!accountService.account || accountService.account.type !== AccountTypes.Contract)) {
      throw new Exception('Require contract account');
    }

    if (options.currentProject) {
      if (!projectService.currentProject) {
        throw new Exception('Require project');
      }

      const isProjectValid = await projectService.isProjectValid();
      if (!isProjectValid) {
        throw new Exception('Invalid project key');
      }
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

  async fetchExchangeRates(dto: FetchExchangeRatesDto): Promise<Rates> {
    const { tokenList, chainId } = dto;
    if (tokenList.length == 0) throw new Exception(`There are no tokens provided`);

    return await this.services.ratesService.fetchExchangeRates(tokenList, chainId);
  }
}

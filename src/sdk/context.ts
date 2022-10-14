import { AccountService } from './account';
import { ApiService } from './api';
import { AssetsService } from './assets';
import { BlockService } from './block';
import { ENSService } from './ens';
import { ExchangeService } from './exchange';
import { FaucetService } from './faucet';
import { GatewayService } from './gateway';
import { NetworkService } from './network';
import { NotificationService } from './notification';
import { P2PPaymentService, PaymentHubService } from './payments';
import { ProjectService } from './project';
import { ErrorSubject, Service } from './common';
import { SessionService } from './session';
import { TransactionsService } from './transactions';
import { StateService } from './state';
import { WalletService } from './wallet';
import { RatesService } from './rates/rates.service';
import {
  ContractService,
  ENSControllerContract,
  ENSReverseRegistrarContract,
  ERC20TokenContract,
  GatewayContract,
  GatewayV2Contract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contract';

export class Context {
  readonly error$ = new ErrorSubject();

  private readonly attached: Service[] = [];

  constructor(
    readonly internalContracts: {
      ensControllerContract: ENSControllerContract;
      ensReverseRegistrarContract: ENSReverseRegistrarContract;
      erc20TokenContract: ERC20TokenContract;
      gatewayContract: GatewayContract;
      paymentRegistryContract: PaymentRegistryContract;
      personalAccountRegistryContract: PersonalAccountRegistryContract;
      gatewayV2Contract: GatewayV2Contract,
    },
    readonly services: {
      accountService: AccountService;
      apiService: ApiService;
      assetsService: AssetsService;
      blockService: BlockService;
      contractService: ContractService;
      ensService: ENSService;
      exchangeService: ExchangeService;
      faucetService: FaucetService;
      gatewayService: GatewayService;
      networkService: NetworkService;
      notificationService: NotificationService;
      p2pPaymentsService: P2PPaymentService;
      paymentHubService: PaymentHubService;
      projectService: ProjectService;
      ratesService: RatesService;
      sessionService: SessionService;
      transactionsService: TransactionsService;
      stateService: StateService;
      walletService: WalletService;
    },
  ) {
    const items = [...Object.values(internalContracts), ...Object.values(services)];

    for (const item of items) {
      this.attach(item);
    }
  }

  attach<T extends Service>(service: T): void {
    this.attached.push(service);
    service.init(this);
  }

  destroy(): void {
    for (const attached of this.attached) {
      attached.destroy();
    }
  }
}

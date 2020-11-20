import { AccountService } from './account';
import { ApiService } from './api';
import { AssetsService } from './assets';
import { AuthService } from './auth';
import { BlockService } from './block';
import { ENSService } from './ens';
import { GatewayService } from './gateway';
import { NetworkService } from './network';
import { NotificationService } from './notification';
import { P2pPaymentService, PaymentHubService } from './payments';
import { ProjectService } from './project';
import { ErrorSubject, Service } from './common';
import { StateService } from './state';
import { WalletService } from './wallet';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';

export class Context {
  readonly error$ = new ErrorSubject();

  private readonly attached: Service[] = [];

  constructor(
    readonly contracts: {
      ensControllerContract: ENSControllerContract;
      erc20TokenContract: ERC20TokenContract;
      gatewayContract: GatewayContract;
      paymentRegistryContract: PaymentRegistryContract;
      personalAccountRegistryContract: PersonalAccountRegistryContract;
    },
    readonly services: {
      accountService: AccountService;
      blockService: BlockService;
      apiService: ApiService;
      assetsService: AssetsService;
      authService: AuthService;
      ensService: ENSService;
      gatewayService: GatewayService;
      networkService: NetworkService;
      notificationService: NotificationService;
      p2pPaymentsService: P2pPaymentService;
      paymentHubService: PaymentHubService;
      projectService: ProjectService;
      stateService: StateService;
      walletService: WalletService;
    },
  ) {
    const items = [...Object.values(contracts), ...Object.values(services)];

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

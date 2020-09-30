import { AccountService } from './account';
import { ApiService } from './api';
import { AuthService } from './auth';
import { BatchService } from './batch';
import { BlockService } from './block';
import { ENSService } from './ens';
import { NetworkService } from './network';
import { NotificationService } from './notification';
import { P2pPaymentService, PaymentHubService } from './payments';
import { RelayerService } from './relayer';
import { Service } from './common';
import { WalletService } from './wallet';
import {
  ENSControllerContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';

export class Context {
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
      batchService: BatchService;
      blockService: BlockService;
      apiService: ApiService;
      authService: AuthService;
      ensService: ENSService;
      networkService: NetworkService;
      notificationService: NotificationService;
      p2pPaymentsService: P2pPaymentService;
      paymentHubService: PaymentHubService;
      relayerService: RelayerService;
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

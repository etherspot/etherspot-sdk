import { Subscription } from 'rxjs';
import { AccountService } from './account';
import { ApiService } from './api';
import { AuthService } from './auth';
import { BatchService } from './batch';
import { ENSService } from './ens';
import { Network } from './network';
import { NotificationService } from './notification';
import { PaymentsService } from './payments';
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
  private subscriptions: Subscription[] = [];

  constructor(
    readonly network: Network, //
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
      apiService: ApiService;
      authService: AuthService;
      ensService: ENSService;
      notificationService: NotificationService;
      paymentsService: PaymentsService;
      relayerService: RelayerService;
      walletService: WalletService;
    },
  ) {
    this.initServices(Object.values(contracts));
    this.initServices(Object.values(services));
  }

  addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  destroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private initServices(services: Service[]): void {
    for (const service of services) {
      service.init(this);
    }
  }
}

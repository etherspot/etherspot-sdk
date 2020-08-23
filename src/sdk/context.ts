import { AccountService } from './account';
import { ApiService } from './api';
import { AuthService } from './auth';
import { BatchService } from './batch';
import { BlockService } from './block';
import { ENSService } from './ens';
import { Network } from './network';
import { NotificationService } from './notification';
import { PaymentService } from './payment';
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
      blockService: BlockService;
      apiService: ApiService;
      authService: AuthService;
      ensService: ENSService;
      notificationService: NotificationService;
      paymentService: PaymentService;
      relayerService: RelayerService;
      walletService: WalletService;
    },
  ) {
    this.attached = [...Object.values(contracts), ...Object.values(services)];

    for (const attached of this.attached) {
      attached.init(this);
    }
  }

  destroy(): void {
    for (const attached of this.attached) {
      attached.destroy();
    }
  }
}

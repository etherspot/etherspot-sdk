import { AccountService } from './account';
import { ApiService } from './api';
import { AuthService } from './auth';
import { ENSService } from './ens';
import { Network } from './network';
import { Service } from './common';
import { WalletService } from './wallet';
import {
  AccountOwnerRegistryContract,
  AccountProofRegistryContract,
  ENSControllerContract,
  ENSRegistryContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from './contracts';

export class Context {
  constructor(
    readonly network: Network, //
    readonly contracts: {
      accountOwnerRegistryContract: AccountOwnerRegistryContract;
      accountProofRegistryContract: AccountProofRegistryContract;
      ensControllerContract: ENSControllerContract;
      ensRegistryContract: ENSRegistryContract;
      erc20TokenContract: ERC20TokenContract;
      gatewayContract: GatewayContract;
      paymentRegistryContract: PaymentRegistryContract;
      personalAccountRegistryContract: PersonalAccountRegistryContract;
    },
    readonly services: {
      accountService: AccountService;
      apiService: ApiService;
      authService: AuthService;
      ensService: ENSService;
      walletService: WalletService;
    },
  ) {
    this.initServices(Object.values(contracts));
    this.initServices(Object.values(services));
  }

  private initServices(services: Service[]): void {
    for (const service of services) {
      service.init(this);
    }
  }
}

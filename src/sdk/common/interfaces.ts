import { ApiService } from '../api';
import { AuthService } from '../auth';

import {
  AccountOwnerRegistryContract,
  AccountProofRegistryContract,
  ENSControllerContract,
  ENSRegistryContract,
  ERC20TokenContract,
  GatewayContract,
  PaymentRegistryContract,
  PersonalAccountRegistryContract,
} from '../contracts';

export interface Contracts {
  accountOwnerRegistryContract: AccountOwnerRegistryContract;
  accountProofRegistryContract: AccountProofRegistryContract;
  ensControllerContract: ENSControllerContract;
  ensRegistryContract: ENSRegistryContract;
  erc20TokenContract: ERC20TokenContract;
  gatewayContract: GatewayContract;
  paymentRegistryContract: PaymentRegistryContract;
  personalAccountRegistryContract: PersonalAccountRegistryContract;
}

export interface Services {
  apiService: ApiService;
  authService: AuthService;
}

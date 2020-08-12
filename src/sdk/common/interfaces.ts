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

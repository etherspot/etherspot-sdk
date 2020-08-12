import { Context } from './common';
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
import { createNetwork } from './network';
import { DEFAULT_NETWORK_NAME } from './defaults';
import { SdkOptions } from './interfaces';

export class Sdk {
  private context: Context;

  constructor(options: SdkOptions = {}) {
    options = {
      networkName: DEFAULT_NETWORK_NAME,
      ...options,
    };

    this.context = new Context(createNetwork(options.networkName), {
      accountOwnerRegistryContract: new AccountOwnerRegistryContract(),
      accountProofRegistryContract: new AccountProofRegistryContract(),
      ensControllerContract: new ENSControllerContract(),
      ensRegistryContract: new ENSRegistryContract(),
      erc20TokenContract: new ERC20TokenContract(),
      gatewayContract: new GatewayContract(),
      paymentRegistryContract: new PaymentRegistryContract(),
      personalAccountRegistryContract: new PersonalAccountRegistryContract(),
    });
  }
}

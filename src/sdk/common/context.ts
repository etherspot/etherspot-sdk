import { Wallet, utils } from 'ethers';
import { Network } from '../network';
import { AbstractService } from './abstract.service';
import { Contracts, Services } from './interfaces';

export class Context {
  wallet: Wallet;
  signer: utils.SigningKey;

  constructor(
    readonly network: Network, //
    readonly contracts: Contracts,
    readonly services: Services,
  ) {
    Object.values(contracts).forEach((contract: AbstractService) => contract.init(this));
    Object.values(services).forEach((service: AbstractService) => service.init(this));
  }

  setWallet(keyWallet: Wallet): Wallet {
    this.wallet = keyWallet;
    this.signer = new utils.SigningKey(keyWallet.privateKey);

    return this.wallet;
  }
}

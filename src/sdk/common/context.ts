import { Network } from '../network';
import { AbstractContract } from '../contracts';
import { Contracts } from './interfaces';

export class Context {
  constructor(readonly network: Network, readonly contracts: Contracts) {
    Object.values(contracts).forEach((contract: AbstractContract) => contract.init(this));
  }
}

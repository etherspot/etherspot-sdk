import { Contract } from '../contract';

export class ExternalContract extends Contract {
  get address(): string {
    return this.services.networkService.getExternalContractAddress(this.name);
  }
}

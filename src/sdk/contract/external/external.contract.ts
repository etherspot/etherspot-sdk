import { Contract } from '../contract';

export class ExternalContract extends Contract {
  constructor(private readonly name: string, abi: any) {
    super(abi);
  }

  get address(): string {
    return this.services.networkService.getExternalContractAddress(this.name);
  }
}

import { ContractEvent, ContractLog } from '../../interfaces';
import { ExternalContract } from "../external.contract";
import { SuperTokenFactoryABI } from "./abi";

export class SuperTokenFactoryContract extends ExternalContract {
  private _address: string;
  constructor(
    address?: string
  ) {
    super('SuperTokenFactory', SuperTokenFactoryABI);
    this._address = address;
  }

  parseLog(log: ContractLog): ContractEvent {
    return super.parseLog(log);
  }

  parseLogs(logs: ContractLog[]): ContractEvent[] {
    return logs.map(log => this.parseLog(log));
  }

  get address(): string {
    return this._address;
  }
}

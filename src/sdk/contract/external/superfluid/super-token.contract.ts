import { TransactionRequest } from '../../../common';
import { ExternalContract } from "../external.contract";
import { SuperTokenContractABI } from "./abi";

export class SuperTokenContract extends ExternalContract {
  private _address: string;
  constructor(
    address: string
  ) {
    super('SuperTOkenContract', SuperTokenContractABI)
    this._address = address;
  }

  encodeUpgrade?(amount): TransactionRequest;

  get address(): string {
    return this._address;
  }
}
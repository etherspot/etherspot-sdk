import { TransactionRequest } from '../../../common';
import { ExternalContract } from "../external.contract";
import { SuperTokenContractABI } from "./abi";

export class SuperTokenContract extends ExternalContract {
  constructor(
    address: string
  ) {
    super(address, SuperTokenContractABI)
  }

  encodeUpgrade?(amount): TransactionRequest;
}
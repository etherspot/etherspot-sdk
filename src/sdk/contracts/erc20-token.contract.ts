import { BigNumberish } from 'ethers';
import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../common';
import { Contract } from './contract';
import { ERC20TokenFunctionsNames } from './constants';

export class ERC20TokenContract extends Contract<ERC20TokenFunctionsNames> {
  constructor() {
    super(ContractNames.ERC20Token);
  }

  encodeTransfer(token: string, to: string, value: BigNumberish): TransactionRequest {
    return this.encodeContractTransactionRequest(
      token,
      ERC20TokenFunctionsNames.Transfer, //
      to,
      value,
    );
  }
}

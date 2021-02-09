import { BigNumberish } from 'ethers';
import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class ERC20TokenContract extends InternalContract {
  constructor() {
    super(ContractNames.ERC20Token);
  }

  encodeTransfer?(token: string, to: string, value: BigNumberish): TransactionRequest;
}

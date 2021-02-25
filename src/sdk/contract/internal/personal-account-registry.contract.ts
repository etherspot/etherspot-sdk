import { ContractNames } from '@etherspot/contracts';
import { BigNumberish, BytesLike, utils } from 'ethers';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class PersonalAccountRegistryContract extends InternalContract {
  constructor() {
    super(ContractNames.PersonalAccountRegistry);
  }

  encodeDeployAccount?(account: string): TransactionRequest;

  encodeRefundAccountCall?(account: string, refundToken: string, refundAmount: BigNumberish): TransactionRequest;

  encodeAddAccountOwner?(account: string, owner: string): TransactionRequest;

  encodeRemoveAccountOwner?(account: string, owner: string): TransactionRequest;

  encodeExecuteAccountTransaction?(
    account: string,
    to: string,
    value: BigNumberish,
    data: BytesLike,
  ): TransactionRequest;

  computeAccountAddress(saltOwner: string): string {
    let result: string = null;

    const { networkService } = this.services;

    const personalAccountImplementation = networkService.getInternalContractAddress(
      ContractNames.PersonalAccountImplementationV1,
    );

    if (saltOwner && this.address && personalAccountImplementation) {
      result = this.computeCreate2Address(
        ContractNames.Account,
        utils.solidityKeccak256(['address'], [saltOwner]),
        this.address,
        personalAccountImplementation,
      );
    }

    return result;
  }
}

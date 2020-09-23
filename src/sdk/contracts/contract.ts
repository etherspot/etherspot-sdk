import {
  ContractNames,
  getContractAbi,
  getContractByteCodeHash,
  getContractAddress,
  getContractTypedDataDomainName,
  TYPED_DATA_DOMAIN_SALT,
} from '@etherspot/contracts';
import { TypedData, buildTypedData } from 'ethers-typed-data';
import { utils } from 'ethers';
import { Service, TransactionRequest } from '../common';

/**
 * @ignore
 */
export abstract class Contract<F = string> extends Service {
  protected interface: utils.Interface;

  private typedDataDomain: {
    name: string;
    salt: string;
  } = null;

  protected constructor(readonly name: ContractNames) {
    super();
  }

  get address(): string {
    const { chainId } = this.context.services.networkService;
    return getContractAddress(this.name, chainId);
  }

  computeAccountCreate2Address(saltKey: string): string {
    return this.address && saltKey
      ? utils.getCreate2Address(
          this.address,
          utils.solidityKeccak256(['address'], [saltKey]),
          getContractByteCodeHash(ContractNames.Account),
        )
      : null;
  }

  buildTypedData<T extends {} = any>(
    primaryType: string,
    primarySchema: { type: string; name: string }[],
    message: T,
  ): TypedData {
    const { chainId } = this.context.services.networkService;

    return this.typedDataDomain
      ? buildTypedData(
          {
            verifyingContract: this.address,
            chainId,
            ...this.typedDataDomain,
          },
          primaryType,
          primarySchema,
          message,
        )
      : null;
  }

  protected onInit() {
    const abi = getContractAbi(this.name);
    const typedDataDomainName = getContractTypedDataDomainName(this.name);

    if (!abi) {
      throw new Error('No abi has been found');
    }

    if (typedDataDomainName) {
      this.typedDataDomain = {
        name: typedDataDomainName,
        salt: TYPED_DATA_DOMAIN_SALT,
      };
    }

    this.interface = new utils.Interface(abi);
  }

  protected encodeContractTransactionRequest(to: string, name: F, ...args: any[]): TransactionRequest {
    const data = this.interface.encodeFunctionData(name as any, args);

    return {
      to,
      data,
    };
  }

  protected encodeSelfContractTransactionRequest(name: F, ...args: any[]): TransactionRequest {
    return this.encodeContractTransactionRequest(this.address, name, ...args);
  }
}

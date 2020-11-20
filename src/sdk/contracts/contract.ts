import {
  ContractNames,
  getContractAbi,
  getContractTypedDataDomainName,
  getContractTypedDataDomainVersion,
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
    version: string;
    salt: string;
  } = null;

  protected constructor(readonly name: ContractNames = null) {
    super();
  }

  get address(): string {
    const { networkService } = this.context.services;
    return networkService.getContractAddress(this.name);
  }

  computeAccountCreate2Address(saltKey: string): string {
    const { networkService } = this.context.services;

    return this.address && saltKey
      ? utils.getCreate2Address(
          this.address,
          utils.solidityKeccak256(['address'], [saltKey]),
          networkService.getAccountByteCodeHash(),
        )
      : null;
  }

  buildTypedData<T extends {} = any>(
    primaryType: string,
    primarySchema: { type: string; name: string }[],
    message: T,
  ): TypedData {
    let result: TypedData = null;

    const { chainId } = this.context.services.networkService;

    if (chainId && this.address && this.typedDataDomain) {
      result = buildTypedData(
        {
          verifyingContract: this.address,
          chainId,
          ...this.typedDataDomain,
        },
        primaryType,
        primarySchema,
        message,
      );
    }

    return result;
  }

  protected onInit() {
    const abi = getContractAbi(this.name);
    const typedDataDomainName = getContractTypedDataDomainName(this.name);
    const typedDataDomainVersion = getContractTypedDataDomainVersion(this.name);

    if (!abi) {
      throw new Error('No abi has been found');
    }

    if (typedDataDomainName && typedDataDomainVersion) {
      this.typedDataDomain = {
        name: typedDataDomainName,
        version: typedDataDomainVersion,
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
    return !this.address ? null : this.encodeContractTransactionRequest(this.address, name, ...args);
  }
}

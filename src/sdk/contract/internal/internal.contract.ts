import {
  ContractNames,
  getContractAbi,
  getContractTypedDataDomainName,
  getContractTypedDataDomainVersion,
  TYPED_DATA_DOMAIN_SALT,
} from '@etherspot/contracts';
import { TypedData, buildTypedData } from 'ethers-typed-data';
import { utils } from 'ethers';
import { Contract } from '../contract';
import { prepareInputArg } from '../utils';

export class InternalContract extends Contract {
  private readonly typedDataDomain: {
    name: string;
    version: string;
    salt: string;
  } = null;

  constructor(private readonly name: ContractNames) {
    super(getContractAbi(name));

    const typedDataDomainName = getContractTypedDataDomainName(name);
    const typedDataDomainVersion = getContractTypedDataDomainVersion(name);

    if (typedDataDomainName && typedDataDomainVersion) {
      this.typedDataDomain = {
        name: typedDataDomainName,
        version: typedDataDomainVersion,
        salt: TYPED_DATA_DOMAIN_SALT,
      };
    }
  }

  get address(): string {
    return this.services.networkService.getInternalContractAddress(this.name);
  }

  computeAccountCreate2Address(saltKey: string): string {
    const { networkService } = this.context.services;

    return this.address && saltKey
      ? utils.getCreate2Address(
          this.address,
          utils.solidityKeccak256(['address'], [saltKey]),
          networkService.getInternalAccountByteCodeHash(),
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
      for (const { name, type } of primarySchema) {
        message[name] = prepareInputArg(type, message[name]);
      }

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
}

import {
  ContractNames,
  getContractAbi,
  getContractByteCode,
  getContractTypedDataDomainName,
  getContractTypedDataDomainVersion,
  TYPED_DATA_DOMAIN_SALT,
} from '@etherspot/contracts';
import { utils } from 'ethers';
import { buildTypedData, TypedData } from 'ethers-typed-data';
import { concatHex } from '../../common';
import { Contract } from '../contract';
import { prepareInputArg } from '../utils';

export class InternalContract extends Contract<ContractNames> {
  private readonly typedDataDomain: {
    name: string;
    version: string;
    salt: string;
  } = null;

  constructor(name: ContractNames) {
    super(name, getContractAbi(name));

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

  protected computeCreate2Address(
    contractName: ContractNames.Account | ContractNames.PaymentDepositAccount,
    salt: string,
    ...args: string[]
  ): string {
    let result: string = null;

    if (this.address) {
      let byteCode = getContractByteCode(contractName);

      for (const arg of args) {
        byteCode = concatHex(byteCode, utils.hexZeroPad(arg, 32));
      }

      result = utils.getCreate2Address(this.address, salt, utils.solidityKeccak256(['bytes'], [byteCode]));
    }

    return result;
  }
}

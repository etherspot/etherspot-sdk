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
import { AbstractService } from '../common';

/**
 * @ignore
 */
export abstract class AbstractContract extends AbstractService {
  protected interface: utils.Interface;

  private typedDataDomain: {
    name: string;
    chainId: number;
    salt: string;
  } = null;

  protected constructor(readonly name: ContractNames) {
    super();
  }

  get address(): string {
    const { chainId } = this.context.network;
    return getContractAddress(this.name, chainId);
  }

  protected onInit() {
    const { chainId } = this.context.network;

    const abi = getContractAbi(this.name);
    const typedDataDomainName = getContractTypedDataDomainName(this.name);

    if (!abi) {
      throw new Error('No abi has been found');
    }

    if (typedDataDomainName) {
      this.typedDataDomain = {
        chainId,
        name: typedDataDomainName,
        salt: TYPED_DATA_DOMAIN_SALT,
      };
    }

    this.interface = new utils.Interface(abi);
  }

  computeAccountCreate2Address(saltKey: string): string {
    return utils.getCreate2Address(
      this.address,
      utils.solidityKeccak256(['address'], [saltKey]),
      getContractByteCodeHash(ContractNames.Account),
    );
  }

  buildTypedData<T extends {} = any>(
    primaryType: string,
    primarySchema: { type: string; name: string }[],
    message: T,
  ): TypedData {
    return this.typedDataDomain
      ? buildTypedData(
          {
            verifyingContract: this.address,
            ...this.typedDataDomain,
          },
          primaryType,
          primarySchema,
          message,
        )
      : null;
  }
}

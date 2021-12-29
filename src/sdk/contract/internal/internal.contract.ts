import { ContractNames, getContractAbi, getContractByteCode } from '@etherspot/contracts';
import { BigNumber, utils } from 'ethers';
import { NetworkNames, networkNameToChainId } from '../../network';
import { concatHex, prepareAddress } from '../../common';
import { Contract } from '../contract';

export class InternalContract extends Contract<ContractNames> {
  constructor(name: ContractNames) {
    super(name, getContractAbi(name));
  }

  get address(): string {
    return this.services.networkService.getInternalContractAddress(this.name);
  }

  protected hashMessagePayload<T extends {} = any>(
    structName: string,
    structFields: { type: string; name: string }[],
    message: T,
    network?: NetworkNames,
  ): Buffer {
    const chainId = networkNameToChainId(network) ?? this.context.services.networkService.chainId;
    const prefix = `${structName}(${structFields.map(({ type, name }) => `${type} ${name}`).join(',')})`;

    const types = [
      'uint256', //
      'address',
      'bytes32',
      ...structFields.map(({ type }) => type),
    ];

    const values = [
      chainId,
      this.address,
      utils.id(prefix), //
      ...structFields.map(({ name, type }) => {
        let result: any;

        switch (type) {
          case 'address':
            result = prepareAddress(message[name], true);
            break;

          case 'uint256':
            result = BigNumber.from(message[name] || 0).toHexString();
            break;

          case 'address[]':
            result = (message[name] as string[]).map((address) => prepareAddress(address, true));
            break;

          default:
            result = message[name];
        }

        return result;
      }),
    ];

    return Buffer.from(utils.arrayify(utils.solidityKeccak256(types, values)));
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

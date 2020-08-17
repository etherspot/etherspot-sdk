import { utils, BytesLike } from 'ethers';
import { isAddress } from './is-address';
import { isHex } from './is-hex';

/**
 * @ignore
 */
export function keccak256(data: BytesLike): string {
  let result: string = null;

  if (data) {
    switch (typeof data) {
      case 'string':
        if (isAddress(data)) {
          result = utils.solidityKeccak256(['address'], [data]);
        } else if (isHex(data)) {
          result = utils.solidityKeccak256(['bytes'], [data]);
        } else {
          result = utils.solidityKeccak256(['string'], [data]);
        }
        break;
      case 'object':
        result = utils.solidityKeccak256(['bytes'], [data]);
        break;
    }
  }

  return result;
}

import { constants } from 'ethers';
import { isAddress } from './is-address';

/**
 * @ignore
 */
export function prepareAddress(value: string, zeroAddressAsNull = false): string {
  let result: string = null;

  if (isAddress(value) && value !== constants.AddressZero) {
    result = value;
  }

  if (!result && zeroAddressAsNull) {
    result = constants.AddressZero;
  }

  return result;
}

import { constants, utils } from 'ethers';

/**
 * @ignore
 */
export function prepareAddress(value: string, zeroAddressAsNull = false): string {
  let result: string = null;

  try {
    result = utils.getAddress(value);

    if (result === constants.AddressZero) {
      result = null;
    }
  } catch (err) {
    //
  }

  if (!result && zeroAddressAsNull) {
    result = constants.AddressZero;
  }

  return result;
}

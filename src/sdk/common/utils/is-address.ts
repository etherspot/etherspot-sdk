import { utils, constants } from 'ethers';

/**
 * @ignore
 */
export function isAddress(value: string): boolean {
  let result = false;

  if (value && value !== constants.AddressZero) {
    try {
      const address = utils.getAddress(value);

      if (address) {
        result = address === value;
      }
    } catch (err) {
      result = false;
    }
  } else if (value === constants.AddressZero) {
    result = true;
  }

  return result;
}

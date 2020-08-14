import { utils } from 'ethers';

/**
 * @ignore
 */
export function isAddress(value: string): boolean {
  let result = true;

  if (value) {
    try {
      const address = utils.getAddress(value);
      result = address === value;
    } catch (err) {
      result = false;
    }
  }

  return result;
}

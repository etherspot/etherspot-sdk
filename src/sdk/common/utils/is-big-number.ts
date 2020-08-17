import { BigNumber } from 'ethers';

/**
 * @ignore
 */
export function isBigNumber(value: any): boolean {
  return value instanceof BigNumber;
}

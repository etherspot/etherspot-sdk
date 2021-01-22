import { utils } from 'ethers';

export function randomAddress(): string {
  return utils.getAddress(utils.hexlify(utils.randomBytes(20)));
}

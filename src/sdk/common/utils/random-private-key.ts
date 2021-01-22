import { utils } from 'ethers';

export function randomPrivateKey(): string {
  return utils.hexlify(utils.randomBytes(32));
}

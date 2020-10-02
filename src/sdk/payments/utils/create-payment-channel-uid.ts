import { utils } from 'ethers';
import { DEFAULT_PAYMENT_CHANNEL_UID_SALT } from '../constants';

export function createPaymentChannelUid(salt: string = null): string {
  return utils.solidityKeccak256(['string'], [salt || DEFAULT_PAYMENT_CHANNEL_UID_SALT]);
}

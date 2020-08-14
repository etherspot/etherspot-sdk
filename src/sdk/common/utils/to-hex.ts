import { BytesLike, utils } from 'ethers';
import { isHex } from './is-hex';

/**
 * @ignore
 */
export function toHex(data: BytesLike): string {
  let result: string = null;

  if (data !== null) {
    switch (typeof data) {
      case 'string':
        if (isHex(data)) {
          result = data;
        } else {
          result = utils.hexlify(utils.toUtf8Bytes(data));
        }
        break;

      case 'object':
        try {
          result = utils.hexlify(data as any);
        } catch (err) {
          result = null;
        }
        break;
    }
  }

  if (!result) {
    throw new Error('invalid hex data');
  }

  return result;
}

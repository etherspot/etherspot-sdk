import { BigNumber } from 'ethers';
import { prepareAddress } from '../../common';

export function prepareInputArg(type: string, arg: any): any {
  let result = arg;

  switch (type) {
    case 'address':
      result = prepareAddress(arg, true);
      break;

    case 'bytes':
      result = arg || '0x';
      break;

    default:
      if (!type.endsWith(']')) {
        if (type.startsWith('uint')) {
          result = BigNumber.from(arg || 0).toHexString();
        }
      }
  }

  return result;
}

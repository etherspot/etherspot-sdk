import { BigNumber } from 'ethers';
import { Transform, TransformationType } from 'class-transformer';
import { isBigNumber } from '../utils';

/**
 * @ignore
 */
export function TransformBigNumber(): Function {
  return Transform((params) => {
    const { type, value } = params;

    let result: any = null;

    switch (type) {
      case TransformationType.PLAIN_TO_CLASS:
        result = value ? BigNumber.from(value) : null;
        break;

      case TransformationType.CLASS_TO_CLASS:
        result = value;
        break;

      case TransformationType.CLASS_TO_PLAIN:
        result = isBigNumber(value) ? BigNumber.from(value).toHexString() : '0x00';
        break;
    }

    return result;
  });
}

import { BigNumber } from 'ethers';
import { isBigNumber } from './is-big-number';

/**
 * @ignore
 */
export function deepCompare(a: any, b: any): boolean {
  let result = false;

  const aType = typeof a;
  if (aType === typeof b) {
    switch (aType) {
      case 'object':
        if (a === null || b === null) {
          result = a === b;
        } else if (a === b) {
          result = true;
        } else if (isBigNumber(a) && isBigNumber(b)) {
          result = (a as BigNumber).eq(b);
        } else if (a instanceof Date && b instanceof Date) {
          result = a.getTime() === b.getTime();
        } else {
          const aIsArray = Array.isArray(a);
          const bIsArray = Array.isArray(b);

          if (aIsArray && bIsArray) {
            const aLength = a.length;
            const bLength = b.length;

            if (aLength === bLength) {
              result = true;

              for (let index = 0; index < aLength; index += 1) {
                if (!deepCompare(a[index], b[index])) {
                  result = false;
                  break;
                }
              }
            }
          } else if (!aIsArray && !bIsArray) {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);

            if (aKeys.length === bKeys.length) {
              result = true;

              for (const key of aKeys) {
                if (!deepCompare(a[key], b[key])) {
                  result = false;
                  break;
                }
              }
            }
          }
        }
        break;

      case 'function':
        result = true;
        break;

      default:
        result = a === b;
    }
  }

  return result;
}

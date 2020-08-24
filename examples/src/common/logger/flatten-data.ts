import { BigNumber } from 'ethers';

export function flattenData(data: any): any {
  let result: any;

  if (data && typeof data === 'object') {
    if (BigNumber.isBigNumber(data)) {
      result = `[BigNumber] ${(data as BigNumber).toString()}`;
    } else if (data instanceof Date) {
      result = `[Date] ${data.toJSON()}`;
    } else if (Array.isArray(data)) {
      result = data.map(flattenData);
    } else {
      const entries = Object.entries(data);
      const obj: object = {};

      for (const [key, value] of entries) {
        obj[key] = flattenData(value);
      }

      result = obj;
    }
  } else {
    result = data;
  }

  return result;
}

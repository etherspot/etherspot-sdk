import { BigNumber } from 'ethers';

export function prepareApiVariables(variables: { [keys: string]: any }): { [key: string]: any } {
  const result: { [key: string]: any } = {};
  const keys = Object.keys(variables);

  for (const key of keys) {
    let value: any;
    if (BigNumber.isBigNumber(variables[key])) {
      value = BigNumber.from(variables[key]).toHexString();
    } else {
      value = variables[key];
    }
    result[key] = value;
  }

  return result;
}

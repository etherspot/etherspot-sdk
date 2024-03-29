import { utils } from 'ethers';
import { keccak256 } from '../../common';
import { ParsedResolutionName } from './interfaces';

export function parseResolutionName(name: string): ParsedResolutionName {
  let result: ParsedResolutionName = null;

  const parts = name
    .split('.')
    .map((name) => utils.nameprep(name))
    .filter((name) => !!name);

  if (parts.length > 1) {
    const name = parts.join('.');
    const rootName = parts.slice(1).join('.');

    result = {
      name,
      label: parts[0],
      labelHash: keccak256(parts[0]),
      hash: utils.namehash(name),
      root: {
        name: rootName,
        hash: utils.namehash(rootName),
      }
    };
  }

  return result;
}

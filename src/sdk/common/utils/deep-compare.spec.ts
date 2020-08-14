import { BigNumber } from 'ethers';
import { deepCompare } from './deep-compare';

describe('deepCompare()', () => {
  it('expect to return false for different types', () => {
    expect(deepCompare(1, 'a')).toBeFalsy();
    expect(deepCompare(false, 'a')).toBeFalsy();
    expect(deepCompare({}, 1)).toBeFalsy();
  });

  it('expect to return true for the same primitive types', () => {
    expect(deepCompare(1, 1)).toBeTruthy();
    expect(deepCompare('a', 'a')).toBeTruthy();
    expect(deepCompare(true, true)).toBeTruthy();
  });

  it('expect to return true for the same object', () => {
    expect(
      deepCompare(
        {
          a: 1,
          b: 'b',
          c: true,
        },
        {
          a: 1,
          b: 'b',
          c: true,
        },
      ),
    ).toBeTruthy();
  });

  it('expect to return true for the same array', () => {
    expect(deepCompare([1, 2, 3, 'c'], [1, 2, 3, 'c'])).toBeTruthy();
  });

  it('expect to return true for the same BigNumber', () => {
    expect(deepCompare(BigNumber.from(1), BigNumber.from(1))).toBeTruthy();
  });
});

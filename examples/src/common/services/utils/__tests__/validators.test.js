// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
import {
  validatePin,
  isValidAddress,
  isValidAddressOrEnsName,
  hasAllValues,
  isValidEmail,
  isValidPhone,
} from 'utils/validators';
import t from 'translations/translate';

describe('Validators', () => {
  describe('validatePin', () => {
    it('should validate the length of provided pincode', () => {
      const pin = '1234';
      const requiredLength = 4;
      const expectedErrorMessage = t('auth:error.invalidPin.tooLong', { requiredLength });
      expect(validatePin(pin, requiredLength)).toHaveLength(0);
      expect(validatePin('12345', requiredLength)).toBe(expectedErrorMessage);
    });

    it('should allow only digits', () => {
      const expectedErrorMessage = t('auth:error.invalidPin.useNumericSymbolsOnly');
      expect(validatePin('1asd', 4)).toBe(expectedErrorMessage);
    });
  });

  describe('isValidAddress', () => {
    it('should return true for the valid ETH address', () => {
      expect(isValidAddress('0xb0604b2d7FBD6cD53f00fA001504135b7aEC9B4D')).toBeTruthy();
    });

    it('should return false for the valid ENS name', () => {
      expect(isValidAddress('test.eth')).toBeFalsy();
      expect(isValidAddress('pillar.test.eth')).toBeFalsy();
    });

    it('should return false for the invalid ETH address', () => {
      expect(isValidAddress('Jon Snow')).toBeFalsy();
    });
  });

  describe('isValidAddressOrEnsName', () => {
    it('should return true for the valid ETH address', () => {
      expect(isValidAddressOrEnsName('0xb0604b2d7FBD6cD53f00fA001504135b7aEC9B4D')).toBeTruthy();
    });

    it('should return true for the valid ENS .eth name', () => {
      expect(isValidAddressOrEnsName('test.eth')).toBeTruthy();
    });

    it('should return true for the valid ENS .crypto name', () => {
      expect(isValidAddressOrEnsName('test.crypto')).toBeTruthy();
    });

    it('should return true for the valid ENS .zil name', () => {
      expect(isValidAddressOrEnsName('test.zil')).toBeTruthy();
    });

    it('should return true for the valid ENS name with subdomain', () => {
      expect(isValidAddressOrEnsName('pillar.test.eth')).toBeTruthy();
    });

    it('should return false for the unsupported ENS name', () => {
      expect(isValidAddressOrEnsName('test.com')).toBeFalsy();
    });

    it('should return false for the wrong ENS name', () => {
      expect(isValidAddressOrEnsName('testeth')).toBeFalsy();
    });

    it('should return false for the invalid ETH address', () => {
      expect(isValidAddressOrEnsName('Jon Snow')).toBeFalsy();
    });
  });

  describe('hasAllValues', () => {
    it('should return true for an object with all values', () => {
      const object = { foo: 1, bar: false };
      expect(hasAllValues(object)).toBeTruthy();
    });
    it('should return false for an object without all values', () => {
      const object = { foo: 1, bar: false, baz: '' };
      expect(hasAllValues(object)).toBeFalsy();
    });
  });

  describe('validateEmail', () => {
    it('should return false for jon@', () => {
      const email = 'jon@';
      expect(isValidEmail(email)).toBeFalsy();
    });

    it('should return true for jon@snow.com', () => {
      const email = 'jon@snow.com';
      expect(isValidEmail(email)).toBeTruthy();
    });

    it('should return false for the email with leading spaces', () => {
      const email = '    jon@snow.com';
      expect(isValidEmail(email)).toBeFalsy();
    });
  });

  describe('isValidPhone', () => {
    it('should return true as valid number', () => {
      const phone = '+447473222885';
      expect(isValidPhone(phone)).toBeTruthy();
    });
  });

  it('should return false for missing +', () => {
    const phone = '447473222885';
    expect(isValidPhone(phone)).toBeFalsy();
  });
});

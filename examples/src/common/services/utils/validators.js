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
import { utils } from 'ethers';
import { ETH } from 'constants/assetsConstants';
import { pipe, decodeETHAddress } from 'utils/common';
import t from 'translations/translate';
import * as tForm from 'tcomb-form-native';

// types
import type { TranslatedString } from 'models/Translations';


type AddressValidator = {
  validator: (address: string) => boolean,
  message: string,
};

export const validatePin = (pin: string, maxPinLength: number): string => {
  if (pin.length !== maxPinLength) {
    return t('auth:error.invalidPin.tooLong', { requiredLength: maxPinLength });
  } else if (!pin.match(/^\d+$/)) {
    return t('auth:error.invalidPin.useNumericSymbolsOnly');
  }
  return '';
};

export const validatePinWithConfirmation = (pin: string, confirmationPin: string, maxPinLength: number): string => {
  if (confirmationPin && pin !== confirmationPin) {
    return t('auth:error.invalidPin.doesNotMatchPrevious');
  }

  return validatePin(pin, maxPinLength);
};


const supportedDomains = [
  'eth',
  'crypto',
  'zil',
];

export const isEnsName = (input: ?string): boolean => {
  if (!input || !input.toString().includes('.')) return false;

  const domain = input.split('.').pop().toLowerCase();

  return supportedDomains.includes(domain);
};

export const isValidAddress = (input: ?string): boolean => {
  if (!input) return false;

  try {
    utils.getAddress(input);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidAddressOrEnsName = (input: ?string): boolean => {
  return isEnsName(input) || isValidAddress(input);
};

export const supportedAddressValidator = (address: string): boolean => {
  if (pipe(decodeETHAddress, isValidAddressOrEnsName)(address)) {
    return true;
  }
  return false;
};

export const addressValidator = (token: string): AddressValidator => {
  const validators = {
    [ETH]: {
      validator: isValidAddressOrEnsName,
      message: t('auth:error.invalidEthereumAddress.default'),
    },
  };

  const validator = validators[token];
  if (validator) {
    return validator;
  }

  return {
    validator: isValidAddressOrEnsName,
    message: t('auth:error.invalidAddress.default'),
  };
};

export function hasAllValues(object: ?Object) {
  object = object || {};
  const keys = Object.keys(object);
  const values = Object.values(object).filter((value) => value !== undefined && value !== '');
  return keys.length === values.length;
}

export function isValidEmail(email: string) {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function isValidPhone(phone: string) {
  const re = /^(\+\d{10,20}\b)/;
  return re.test(phone);
}

export function isValidPhoneWithoutCountryCode(phone: string) {
  const re = /^(\d{5,20}$)/;
  return re.test(phone);
}

export function isValidFiatValue(value: string) {
  const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;
  return regex.test(value);
}

export function isValidURL(url: string) {
  const regex = /^(http|https):\/\/[^ "]+$/;
  return regex.test(url);
}

export const MIN_USERNAME_LENGTH = 4;
export const MAX_USERNAME_LENGTH = 30;

export const validateUsername = (
  username: ?string,
  minLength: number = MIN_USERNAME_LENGTH,
  maxLength: number = MAX_USERNAME_LENGTH,
): ?TranslatedString => {
  const usernameRegex = /^[a-z]+([a-z0-9-]+[a-z0-9])?$/i;
  const startsWithNumberRegex = /^[0-9]/i;
  const startsOrEndsWithDash = /(^-|-$)/i;

  if (!username) {
    return t('auth:error.missingData', { missingData: t('auth:formData.username') });
  } else if (username.length < minLength) {
    return t('auth:error.invalidUsername.tooShort', { requiredLength: MIN_USERNAME_LENGTH - 1 });
  } else if (username.length > maxLength) {
    return t('auth:error.invalidUsername.tooLong', { requiredLength: MAX_USERNAME_LENGTH + 1 });
  } else if (!usernameRegex.test(username)) {
    if (startsWithNumberRegex.test(username)) return t('auth:error.invalidUsername.cantStartWithNumber');
    if (startsOrEndsWithDash.test(username)) return t('auth:error.invalidUsername.cantStartEndWithDash');
    return t('auth:error.invalidUsername.useAlphanumericSymbolsOnly');
  }

  return null;
};

const EmailStructDef = tForm.refinement(tForm.String, (email: string = ''): boolean => {
  const maxLength = 100;
  return isValidEmail(email) && email.length <= maxLength;
});

const PhoneStructDef = tForm.refinement(tForm.Object, ({ input }): boolean => {
  return isValidPhoneWithoutCountryCode(input);
});

EmailStructDef.getValidationErrorMessage = (email): string => {
  const maxLength = 100;
  if (email && !isValidEmail(email)) {
    return t('auth:error.invalidEmailAddress.default');
  } else if (email && email.length > maxLength) {
    return t('auth:error.invalidEmailAddress.tooLong', { requiredLength: maxLength });
  }
  return '';
};

PhoneStructDef.getValidationErrorMessage = (phone): string => {
  if (phone && !isValidPhoneWithoutCountryCode(phone)) {
    return t('auth:error.invalidPhoneNumber.default');
  }
  return '';
};

export const EmailStruct = EmailStructDef;
export const PhoneStruct = PhoneStructDef;

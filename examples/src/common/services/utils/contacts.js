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
import t from 'translations/translate';

// components
import Toast from 'components/Toast';

// types
import type { Contact } from 'models/Contact';

// utils
import { resolveEnsName } from './common';
import { isValidAddress, isEnsName } from './validators';

export function getContactTitle(contact: Contact) {
  return contact.name || contact.ensName || contact.ethAddress;
}

export function getContactKey(contact: Contact) {
  return contact.ethAddress || contact.ensName || contact.name;
}

type ResolveContactOptions = {|
  showNotification: boolean;
|};

/**
 * Returns contact with resolved `ethAddress` (from ENS name).
 *
 * If `ethAddress` is ENS name it will be resolved.
 * If `ethAddress` is a valid hex address this will return the input.
 *
 * @returns {Contact} with `ethAddress` being correct hex address`.
 * @returns {null} if ENS name resultion fails or `ethAddress` is neither valid address nor valid ENS name.
 */
export const resolveContact = async (contact: ?Contact, options?: ResolveContactOptions): Promise<?Contact> => {
  if (!contact) return null;

  const showNotificationOption = options?.showNotification ?? true;

  if (isValidAddress(contact.ethAddress)) {
    return contact;
  }

  if (isEnsName(contact.ethAddress)) {
    const resolvedAddress = await resolveEnsName(contact.ethAddress);

    if (!resolvedAddress && showNotificationOption) {
      Toast.show({
        message: t('toast.ensNameNotFound'),
        emoji: 'woman-shrugging',
      });
    }

    return resolvedAddress ? { ...contact, ethAddress: resolvedAddress, ensName: contact.ethAddress } : null;
  }

  return null;
};

export const getReceiverWithEnsName = async (
  ethAddressOrEnsName: ?string,
  showNotification: boolean = true,
): Promise<?{ receiverEnsName?: string, receiver: ?string}> => {
  if (!ethAddressOrEnsName) return null;

  if (isEnsName(ethAddressOrEnsName)) {
    const resolvedAddress = await resolveEnsName(ethAddressOrEnsName);

    if (!resolvedAddress && showNotification) {
      Toast.show({
        message: t('toast.ensNameNotFound'),
        emoji: 'woman-shrugging',
      });
      return null;
    }

    return {
      receiverEnsName: ethAddressOrEnsName,
      receiver: resolvedAddress,
    };
  }

  return { receiver: ethAddressOrEnsName };
};

const isMatchingContact = (contact: Contact, query: ?string) => {
  if (!query) return true;

  return contact.name.toUpperCase().includes(query.toUpperCase())
    || contact.ethAddress.toUpperCase().includes(query.toUpperCase())
    || contact.ensName?.toUpperCase().includes(query.toUpperCase());
};

const isExactMatch = (contact: Contact, query: ?string) => {
  if (!query) return false;

  return (
    contact.name.toUpperCase() === query.toUpperCase() ||
    contact.ethAddress.toUpperCase() === query.toUpperCase() ||
    contact.ensName?.toUpperCase() === query.toUpperCase()
  );
};

// Filter by query and put exact matches at the beginning of the list.
export const filterContacts = (contacts: Contact[], query: ?string): Contact[] => {
  if (!query) return contacts;

  return contacts
    .filter((contact) => isMatchingContact(contact, query))
    .sort((contact) => isExactMatch(contact, query) ? 0 : 1);
};

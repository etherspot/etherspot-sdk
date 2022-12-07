import { mockService } from '../../../testing';
import { SynchronizedSubject } from '../../common';
import { Account, AccountMember } from '../classes';

const account$ = new SynchronizedSubject<Account>();
const accountMember$ = new SynchronizedSubject<AccountMember>();
const accountAddress$ = account$.observeKey('address');

const mocked = {
  account$,
  accountMember$,
  accountAddress$,
  computeContractAccount: jest.fn(),
  joinContractAccount: jest.fn(),
  syncAccount: jest.fn(),
  getConnectedAccounts: jest.fn(),
  getAccount: jest.fn(),
  getAccountBalances: jest.fn(),
  getAccountMembers: jest.fn(),
  getAccountInvestments: jest.fn(),
};

Object.defineProperty(mocked, 'account', {
  get: jest.fn(() => account$.value),
});

Object.defineProperty(mocked, 'accountMember', {
  get: jest.fn(() => accountMember$.value),
});

Object.defineProperty(mocked, 'accountAddress', {
  get: jest.fn(() => account$?.value?.address),
});

export const AccountService = mockService(mocked);

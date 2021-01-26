import { mockService } from '../../../testing';
import { ObjectSubject } from '../../common';
import { NetworkNames } from '../constants';
import { Network } from '../interfaces';

const network$ = new ObjectSubject<Network>(null);
const chainId$ = network$.observeKey('chainId');
const defaultNetwork: Network = {
  name: NetworkNames.LocalA,
  chainId: 9999,
};

const supportedNetworks = [defaultNetwork];

const mocked = {
  network$,
  chainId$,
  defaultNetwork,
  supportedNetworks,
  useDefaultNetwork: jest.fn(),
  switchNetwork: jest.fn(),
  isNetworkNameSupported: jest.fn(),
  getContractAddress: jest.fn(),
  getAccountByteCodeHash: jest.fn(),
};

Object.defineProperty(mocked, 'network', {
  get: jest.fn(() => network$.value),
});

Object.defineProperty(mocked, 'chainId', {
  get: jest.fn(() => network$?.value?.chainId),
});

export const NetworkService = mockService(mocked);

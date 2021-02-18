import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../../testing';

export const PersonalAccountRegistryContract = mockContract(ContractNames.PersonalAccountRegistry, {
  encodeDeployAccount: jest.fn(),
  encodeRefundAccountCall: jest.fn(),
  encodeAddAccountOwner: jest.fn(),
  encodeRemoveAccountOwner: jest.fn(),
  encodeExecuteAccountTransaction: jest.fn(),
  computeAccountAddress: jest.fn(),
});

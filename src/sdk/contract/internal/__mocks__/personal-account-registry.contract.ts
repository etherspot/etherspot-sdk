import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../../testing';

export const PersonalAccountRegistryContract = mockContract(ContractNames.PersonalAccountRegistry, {
  encodeRefundAccountCall: jest.fn(),
  encodeAddAccountOwner: jest.fn(),
  encodeRemoveAccountOwner: jest.fn(),
  encodeExecuteAccountTransaction: jest.fn(),
});

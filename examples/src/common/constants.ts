import { ContractNames, getContractAddress } from '@etherspot/contracts';
import { PROVIDER_CHAIN_ID } from './config';

export const TOKEN_ADDRESS = getContractAddress(ContractNames.WrappedWeiToken, PROVIDER_CHAIN_ID);

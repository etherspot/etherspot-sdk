import { NetworkNames, NETWORK_NAME_TO_CHAIN_ID } from '../constants';

export function networkNameToChainId(networkName: NetworkNames): number {
  console.log(networkName);
  return NETWORK_NAME_TO_CHAIN_ID[networkName] || null;
}

export { NETWORK_NAME_TO_CHAIN_ID };

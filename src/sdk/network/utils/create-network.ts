import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames } from '../constants';
import { Network } from '../interfaces';

/**
 * @ignore
 */
export function createNetwork(name: NetworkNames): Network {
  const chainId = NETWORK_NAME_TO_CHAIN_ID[name] || null;
  return {
    name,
    chainId,
  };
}

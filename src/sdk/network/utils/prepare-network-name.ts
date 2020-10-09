import { NetworkNames, NETWORK_NAME_TO_CHAIN_ID, CHAIN_ID_TO_NETWORK_NAME } from '../constants';

export function prepareNetworkName(networkNameOrChainId: string | number): NetworkNames {
  let result: NetworkNames = null;

  if (networkNameOrChainId) {
    if (typeof networkNameOrChainId === 'string') {
      if (networkNameOrChainId.startsWith('0x')) {
        networkNameOrChainId = parseInt(networkNameOrChainId.slice(2), 16) || 0;
      } else {
        const chainId = NETWORK_NAME_TO_CHAIN_ID[networkNameOrChainId];

        networkNameOrChainId = chainId ? chainId : parseInt(networkNameOrChainId, 10) || 0;
      }
    }

    if (typeof networkNameOrChainId === 'number') {
      result = CHAIN_ID_TO_NETWORK_NAME[networkNameOrChainId] || null;
    }
  }

  return result;
}

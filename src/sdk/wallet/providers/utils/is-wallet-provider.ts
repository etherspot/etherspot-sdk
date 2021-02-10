import { utils } from 'ethers';
import { WalletLike, WalletProvider, WalletProviderLike } from '../interfaces';

export function isWalletProvider(provider: WalletProviderLike): boolean {
  let result = false;

  if (provider) {
    switch (typeof provider) {
      case 'string':
        result = utils.isHexString(provider, 32);
        break;

      case 'object':
        const { privateKey } = provider as WalletLike;
        if (utils.isHexString(privateKey, 32)) {
          result = true;
        } else {
          const { type, personalSignMessage, signMessage, signTypedData } = provider as WalletProvider;

          result =
            !!type &&
            typeof personalSignMessage === 'function' &&
            typeof signMessage === 'function' &&
            typeof signTypedData === 'function';
        }
        break;
    }
  }

  return result;
}

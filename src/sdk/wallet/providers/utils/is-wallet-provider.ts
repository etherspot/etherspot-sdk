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
          const { type, signMessage } = provider as WalletProvider;

          result = !!type && typeof signMessage === 'function';
        }
        break;
    }
  }

  return result;
}

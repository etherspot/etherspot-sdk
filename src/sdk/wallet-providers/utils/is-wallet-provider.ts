import { utils } from 'ethers';
import { WalletProviderLike } from '../interfaces';

export function isWalletProvider(provider: WalletProviderLike): boolean {
  let result = false;

  if (provider) {
    switch (typeof provider) {
      case 'string':
        result = utils.isHexString(provider, 32);
        break;

      case 'object':
        result =
          provider.type &&
          typeof provider.personalSignMessage === 'function' &&
          typeof provider.signMessage === 'function' &&
          typeof provider.signTypedData === 'function';
    }
  }

  return result;
}

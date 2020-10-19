import { utils } from 'ethers';
import { WalletOptions } from '../interfaces';
import { KeyWalletProviderOptions, WalletProvider, WalletProviderLike, isWalletProvider } from '../../wallet-providers';

export function parseWalletOptions(options: WalletOptions): WalletOptions {
  let result: WalletOptions = null;

  try {
    if (options) {
      if (typeof options === 'string') {
        options = {
          privateKey: options,
        };
      }

      if (typeof options === 'object') {
        if (isWalletProvider(options as WalletProviderLike)) {
          result = options as WalletProvider;
        } else {
          const { privateKey, networkName } = options as KeyWalletProviderOptions;

          if (privateKey && utils.isHexString(privateKey, 32)) {
            result = {
              privateKey,
              networkName,
            };
          }
        }
      }
    }
  } catch (err) {
    //
  }

  return result;
}
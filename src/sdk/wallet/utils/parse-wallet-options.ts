import { utils } from 'ethers';
import { WalletOptions } from '../interfaces';
import { WalletProvider } from '../providers';

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
        if (options instanceof WalletProvider) {
          result = options;
        } else {
          const { privateKey } = options;

          if (privateKey && utils.isHexString(privateKey, 32)) {
            result = {
              privateKey,
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

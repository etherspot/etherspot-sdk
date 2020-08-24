import { Wallet, utils } from 'ethers';
import { WalletLike } from '../interfaces';

export function walletFrom(walletLike: WalletLike): Wallet {
  let result: Wallet = null;

  try {
    if (utils.isHexString(walletLike.privateKey, 32)) {
      result = new Wallet(walletLike.privateKey);
    }
  } catch (err) {
    result = null;
  }

  return result;
}

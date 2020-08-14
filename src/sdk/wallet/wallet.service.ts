import { utils, Wallet, BytesLike } from 'ethers';
import { Service } from '../common';
import { CreateWalletOptions } from './interfaces';

export class WalletService extends Service {
  private wallet: Wallet;
  private signer: utils.SigningKey;

  get address(): string {
    return this.wallet ? this.wallet.address : null;
  }

  createWallet(options: CreateWalletOptions = {}): Wallet {
    let wallet: Wallet;

    const { privateKey, mnemonic } = options;

    if (privateKey) {
      wallet = new Wallet(privateKey);
    } else if (mnemonic) {
      wallet = Wallet.fromMnemonic(mnemonic);
    } else {
      wallet = Wallet.createRandom();
    }

    this.wallet = wallet;

    const { accountService } = this.services;

    accountService.createAccountFromWallet(wallet);

    return wallet;
  }

  personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }
}

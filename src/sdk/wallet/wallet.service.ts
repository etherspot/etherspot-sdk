import { utils, Wallet, BytesLike } from 'ethers';
import { Service } from '../common';
import { CreateWalletOptions } from './interfaces';

export class WalletService extends Service {
  private wallet: Wallet;
  private signer: utils.SigningKey;

  get address(): string {
    return this.wallet ? this.wallet.address : null;
  }

  attachWallet(wallet: Wallet): void {
    const { accountService } = this.services;

    accountService.createAccountFromWallet(wallet);
    this.wallet = wallet;
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

    this.attachWallet(wallet);

    return wallet;
  }

  personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }
}

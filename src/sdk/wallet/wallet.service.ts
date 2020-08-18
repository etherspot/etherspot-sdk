import { utils, Wallet, BytesLike } from 'ethers';
import { Service } from '../common';

export class WalletService extends Service {
  private wallet: Wallet;
  private signer: utils.SigningKey;

  get address(): string {
    return this.wallet ? this.wallet.address : null;
  }

  attachWallet(wallet: Wallet): void {
    this.wallet = wallet;
    this.signer = new utils.SigningKey(wallet.privateKey);
    this.services.accountService.createAccountFromWallet(wallet);
  }

  personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }
}

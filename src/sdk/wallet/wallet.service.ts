import { utils, Wallet, BytesLike } from 'ethers';
import { Service } from '../common';

export class WalletService extends Service {
  private signer: utils.SigningKey;

  get address(): string {
    return this.wallet ? this.wallet.address : null;
  }
  constructor(private wallet: Wallet) {
    super();

    this.signer = new utils.SigningKey(wallet.privateKey);
  }

  protected onInit(): void {
    const { accountService } = this.services;

    accountService.createAccountFromWallet(this.wallet);
  }

  personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }
}

import { utils, Wallet, BytesLike } from 'ethers';
import { Service, UniqueSubject } from '../common';

export class WalletService extends Service {
  readonly address$ = new UniqueSubject<string>();

  private wallet: Wallet;
  private signer: utils.SigningKey;

  get address(): string {
    return this.address$.value;
  }

  attachWallet(wallet: Wallet): void {
    this.wallet = wallet;
    this.signer = new utils.SigningKey(wallet.privateKey);

    const { address } = wallet;

    this.address$.next(address);
  }

  personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }
}

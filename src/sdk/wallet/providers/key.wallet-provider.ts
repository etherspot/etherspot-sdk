import { Wallet, BytesLike } from 'ethers';
import { WalletProvider } from './interfaces';

export class KeyWalletProvider implements WalletProvider {
  readonly type = 'Key';
  readonly address: string;

  readonly wallet: Wallet;

  constructor(privateKey: string) {
    this.wallet = new Wallet(privateKey);

    const { address } = this.wallet;

    this.address = address;
  }

  async signMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }
}

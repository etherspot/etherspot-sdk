import { utils, Wallet, BytesLike } from 'ethers';
import { hashTypedData, TypedData } from 'ethers-typed-data';
import { Service, UniqueSubject, isHex, keccak256 } from '../common';

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

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }

  async signMessage(message: string): Promise<string> {
    const hex = isHex(message, 32) ? message : keccak256(message);
    const signature = this.signer.signDigest(utils.arrayify(hex));

    return utils.joinSignature(signature);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    const hash = hashTypedData(typedData);

    return this.signMessage(hash);
  }
}

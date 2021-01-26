import { Wallet, utils, BytesLike } from 'ethers';
import { hashTypedData, TypedData } from 'ethers-typed-data';
import { isHex, keccak256, toHex } from '../common';
import { WalletProvider } from './interfaces';

export class KeyWalletProvider implements WalletProvider {
  readonly type = 'Key';
  readonly address: string;

  private readonly wallet: Wallet;
  private readonly signer: utils.SigningKey;

  constructor(privateKey: string) {
    this.wallet = new Wallet(privateKey);
    this.signer = new utils.SigningKey(privateKey);

    const { address } = this.wallet;

    this.address = address;
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }

  async signMessage(message: BytesLike): Promise<string> {
    let hex = toHex(message);

    hex = isHex(hex, 32) ? hex : keccak256(hex);

    const signature = this.signer.signDigest(utils.arrayify(hex));

    return utils.joinSignature(signature);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    const hash = hashTypedData(typedData);

    return this.signMessage(hash);
  }
}

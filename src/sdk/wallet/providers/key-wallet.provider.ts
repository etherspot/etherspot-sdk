import { Wallet, utils, BytesLike } from 'ethers';
import { hashTypedData, TypedData } from 'ethers-typed-data';
import { isHex, keccak256 } from '../../common';
import { KeyWalletProviderOptions } from './interfaces';
import { WalletProvider } from './wallet.provider';

export class KeyWalletProvider extends WalletProvider {
  private readonly wallet: Wallet;
  private readonly signer: utils.SigningKey;

  constructor(options: KeyWalletProviderOptions) {
    super();

    const { privateKey } = options;

    this.wallet = new Wallet(privateKey);
    this.signer = new utils.SigningKey(privateKey);

    const { address } = this.wallet;

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

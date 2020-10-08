import { Wallet, utils, BytesLike } from 'ethers';
import { hashTypedData, TypedData } from 'ethers-typed-data';
import { isHex, keccak256, toHex } from '../common';
import { NetworkNames } from '../network';
import { KeyWalletProviderOptions } from './interfaces';
import { WalletProvider } from './wallet-provider';

export class KeyWalletProvider extends WalletProvider {
  readonly address: string;
  readonly networkName: NetworkNames;

  private readonly wallet: Wallet;
  private readonly signer: utils.SigningKey;

  constructor(options: KeyWalletProviderOptions) {
    super('Key');

    const { privateKey, networkName } = options;

    this.wallet = new Wallet(privateKey);
    this.signer = new utils.SigningKey(privateKey);

    const { address } = this.wallet;

    this.address = address;
    this.networkName = networkName || null;
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

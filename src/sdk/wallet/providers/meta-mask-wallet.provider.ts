import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { WalletProvider } from './wallet.provider';

export class MetaMaskWalletProvider extends WalletProvider {
  constructor() {
    super();

    throw new Error('MetaMask currently not supported');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async personalSignMessage(message: BytesLike): Promise<string> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signMessage(message: string): Promise<string> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signTypedData(typedData: TypedData): Promise<string> {
    return null;
  }
}

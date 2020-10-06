import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { isHex, keccak256, toHex } from '../../common/utils';
import { WalletProvider } from './wallet.provider';
import { MetaMaskWindow } from './interfaces';

export class MetaMaskWalletProvider extends WalletProvider {
  static detect(): boolean {
    const win = (window as any) as MetaMaskWindow;
    return typeof win !== 'undefined' && !!win?.ethereum?.isMetaMask;
  }

  static async connect(): Promise<MetaMaskWalletProvider> {
    if (!this.instance) {
      if (!this.detect()) {
        throw new Error('MetaMask not found');
      }

      this.instance = new MetaMaskWalletProvider();

      await this.instance.connect();
    }

    return this.instance;
  }

  private static get ethereum(): MetaMaskWindow['ethereum'] {
    return ((window as any) as MetaMaskWindow).ethereum;
  }

  private static instance: MetaMaskWalletProvider;

  private connected = false;

  protected constructor() {
    super();
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.sendRequest('personal_sign', [
      this.address, //
      toHex(message),
    ]);
  }

  async signMessage(message: string): Promise<string> {
    return this.sendRequest('eth_sign', [
      this.address, //
      isHex(message, 32) ? message : keccak256(message),
    ]);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    return this.sendRequest('eth_signTypedData_v4', [
      this.address, //
      JSON.stringify(typedData),
    ]);
  }

  protected async connect(): Promise<void> {
    MetaMaskWalletProvider.ethereum.autoRefreshOnNetworkChange = false;
    MetaMaskWalletProvider.ethereum.on<string>('accountsChanged', ([address]) => this.address$.next(address));

    try {
      const [address] = await this.sendRequest<string[]>('eth_requestAccounts');

      if (address) {
        this.address$.next(address);
        this.connected = true;
      }
    } catch (err) {
      //
    }

    if (!this.connected) {
      throw new Error('Can not connect to MetaMask');
    }
  }

  protected async sendRequest<T = any>(method: string, params?: any): Promise<T> {
    const { result, error } = await MetaMaskWalletProvider.ethereum.send(method, params);

    if (error) {
      throw new Error(error.message);
    }

    return result;
  }
}

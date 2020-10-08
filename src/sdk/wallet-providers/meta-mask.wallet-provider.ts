import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { isHex, keccak256, toHex } from '../common';
import { DynamicWalletProvider } from './dynamic.wallet-provider';

declare const window: Window & {
  ethereum: {
    isMetaMask: boolean;
    autoRefreshOnNetworkChange: boolean;
    networkVersion: string;
    selectedAddress: string;

    enable(): Promise<string[]>;

    on<T>(event: string, callback: (data: T) => any): void;

    request<T = any>(args: { method: string; params?: any[] }): Promise<T>;
  };
};

export class MetaMaskWalletProvider extends DynamicWalletProvider {
  static detect(): boolean {
    return !!window?.ethereum?.isMetaMask;
  }

  static async connect(): Promise<MetaMaskWalletProvider> {
    if (!this.instance) {
      if (!this.detect()) {
        throw new Error('MetaMask not found');
      }

      this.instance = new MetaMaskWalletProvider();

      await this.instance.connect();
    }

    if (!this.instance.address) {
      throw new Error('Can not connect to MetaMask');
    }

    return this.instance;
  }

  private static instance: MetaMaskWalletProvider;

  protected constructor() {
    super('MetaMask');
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.sendRequest('personal_sign', [
      this.address, //
      toHex(message),
    ]);
  }

  async signMessage(message: BytesLike): Promise<string> {
    const hex = toHex(message);

    return this.sendRequest('eth_sign', [
      this.address, //
      isHex(hex, 32) ? hex : keccak256(hex),
    ]);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    console.log(typedData);
    return this.sendRequest('eth_signTypedData_v4', [
      this.address, //
      JSON.stringify(typedData),
    ]);
  }

  protected async connect(): Promise<void> {
    const { ethereum } = window;

    ethereum.autoRefreshOnNetworkChange = false;
    ethereum.on<string>('accountsChanged', ([address]) => this.setAddress(address));
    ethereum.on<string>('chainChanged', () => {
      window.location.reload();
    });

    try {
      const chainId = await this.sendRequest<string>('eth_chainId');

      this.setNetworkName(chainId);

      const [address] = await this.sendRequest<string[]>('eth_requestAccounts');

      this.setAddress(address);
    } catch (err) {
      //
    }
  }

  protected async sendRequest<T = any>(method: string, params?: any): Promise<T> {
    const { ethereum } = window;

    return ethereum.request({
      method,
      params,
    });
  }
}

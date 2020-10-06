import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { isHex, keccak256, toHex, UniqueSubject } from '../../common';
import { NetworkNames } from '../../network';
import { WalletProvider } from './wallet.provider';

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

export class MetaMaskProvider extends WalletProvider {
  static detect(): boolean {
    return !!window?.ethereum?.isMetaMask;
  }

  static async connect(): Promise<MetaMaskProvider> {
    if (!this.instance) {
      if (!this.detect()) {
        throw new Error('MetaMask not found');
      }

      this.instance = new MetaMaskProvider();

      await this.instance.connect();
    }

    return this.instance;
  }

  private static instance: MetaMaskProvider;

  readonly type = 'MetaMask';
  readonly address$? = new UniqueSubject<string>();
  readonly networkName$? = new UniqueSubject<NetworkNames>();

  private connected = false;

  protected constructor() {
    super();
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.sendRequest('personal_sign', [
      this.getAddress(), //
      toHex(message),
    ]);
  }

  async signMessage(message: string): Promise<string> {
    return this.sendRequest('eth_sign', [
      this.getAddress(), //
      isHex(message, 32) ? message : keccak256(message),
    ]);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    return this.sendRequest('eth_signTypedData_v4', [
      this.getAddress(), //
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
      const chainId = await this.sendRequest<string[]>('eth_chainId');
      const [address] = await this.sendRequest<string[]>('eth_requestAccounts');

      this.setNetworkName(chainId);

      if (address) {
        this.setAddress(address);

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
    const { ethereum } = window;
    return ethereum.request({
      method,
      params,
    });
  }
}

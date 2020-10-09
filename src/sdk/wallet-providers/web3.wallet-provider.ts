import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { isHex, keccak256, prepareAddress, toHex, UniqueSubject } from '../common';
import { NetworkNames, prepareNetworkName } from '../network';
import { WalletProvider } from './wallet-provider';
import { Web3Provider } from './interfaces';

export class Web3WalletProvider extends WalletProvider {
  static async connect(provider: Web3Provider, type = 'Web3'): Promise<Web3WalletProvider> {
    const result = new Web3WalletProvider(provider, type);
    const connected = await result.refresh();
    return connected ? result : null;
  }

  readonly address$ = new UniqueSubject<string>();
  readonly networkName$ = new UniqueSubject<NetworkNames>();

  constructor(readonly provider: Web3Provider, type = 'Web3') {
    super(type);
  }

  get address(): string {
    return this.address$.value;
  }

  get networkName(): NetworkNames {
    return this.networkName$.value;
  }

  async refresh(): Promise<boolean> {
    let result = false;

    const chainId = await this.sendRequest<string>('eth_chainId');
    const networkName = prepareNetworkName(chainId);

    if (networkName) {
      const accounts = await this.sendRequest<string[]>('eth_accounts');

      if (Array.isArray(accounts) && accounts.length) {
        const address = prepareAddress(accounts[0]);

        if (address) {
          this.address$.next(address);
          this.networkName$.next(networkName);

          result = true;
        }
      }
    }

    return result;
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.sendRequest(
      'personal_sign',
      [
        this.address, //
        toHex(message),
      ],
      this.address,
    );
  }

  async signMessage(message: BytesLike): Promise<string> {
    const hex = toHex(message);

    return this.sendRequest(
      'eth_sign',
      [
        this.address, //
        isHex(hex, 32) ? hex : keccak256(hex),
      ],
      this.address,
    );
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    return this.sendRequest(
      'eth_signTypedData_v4',
      [
        this.address, //
        JSON.stringify(typedData),
      ],
      this.address,
    );
  }

  protected async sendRequest<T = any>(method: string, params: any[] = [], from?: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = Date.now();

      this.provider.send(
        {
          jsonrpc: '2.0',
          method,
          params,
          id,
          from,
        },
        (err: Error, response: { result: T }) => {
          if (err) {
            reject(err);
            return;
          }

          let result: T;

          try {
            ({ result } = response);
          } catch (err) {
            result = null;
          }

          resolve(result || null);
        },
      );
    });
  }
}

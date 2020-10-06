import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { Service, ObjectSubject } from '../common';
import { WalletProviderTypes } from './constants';
import { WalletOptions, Wallet } from './interfaces';
import { WalletProvider, KeyWalletProvider, MetaMaskWalletProvider } from './providers';

export class WalletService extends Service {
  readonly wallet$ = new ObjectSubject<Wallet>();
  readonly walletAddress$: Observable<string>;

  private provider: WalletProvider;

  constructor(walletOptions: WalletOptions) {
    super();

    this.walletAddress$ = this.wallet$.observeKey('address');

    if (walletOptions) {
      this.switchWalletProvider(walletOptions);
    }
  }

  get wallet(): Wallet {
    return this.wallet$.value;
  }

  get walletAddress(): string {
    return this.wallet ? this.wallet.address : null;
  }

  switchWalletProvider(options: WalletOptions): void {
    let provider: WalletProvider = null;
    let providerType: WalletProviderTypes = null;

    if (options && typeof options === 'object') {
      if (options instanceof WalletProvider) {
        providerType =
          options instanceof MetaMaskWalletProvider ? WalletProviderTypes.MetaMask : WalletProviderTypes.Custom;
        provider = options;
      } else {
        providerType = WalletProviderTypes.Key;
        provider = new KeyWalletProvider(options);
      }
    }

    if (!provider) {
      this.provider = null;
      this.wallet$.next(null);

      this.removeSubscriptions();
    } else {
      this.provider = provider;

      this.replaceSubscriptions(
        this.provider.address$
          .pipe(
            map((address) => ({
              address,
              providerType,
            })),
          )
          .subscribe(this.wallet$),
      );
    }
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    return this.provider ? this.provider.personalSignMessage(message) : null;
  }

  async signMessage(message: string): Promise<string> {
    return this.provider ? this.provider.signMessage(message) : null;
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    return this.provider ? this.provider.signTypedData(typedData) : null;
  }
}

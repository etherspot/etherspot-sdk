import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { Service, ObjectSubject } from '../common';
import { WalletOptions, Wallet } from './interfaces';
import { WalletProvider, KeyWalletProvider } from './providers';

export class WalletService extends Service {
  readonly wallet$ = new ObjectSubject<Wallet>();
  readonly walletAddress$: Observable<string>;

  private provider: WalletProvider;

  constructor() {
    super();

    this.walletAddress$ = this.wallet$.observeKey('address');
  }

  get wallet(): Wallet {
    return this.wallet$.value;
  }

  get walletAddress(): string {
    return this.wallet ? this.wallet.address : null;
  }

  switchWalletProvider(options: WalletOptions): void {
    let provider: WalletProvider = null;

    if (options && typeof options === 'object') {
      if (options instanceof WalletProvider) {
        provider = options;
      } else {
        provider = new KeyWalletProvider(options);
      }
    }

    if (!provider) {
      this.wallet$.next(null);

      this.removeSubscriptions();
    } else {
      const { type: providerType } = provider;
      const { networkService } = this.services;

      const subscriptions: Subscription[] = [];

      const { address, address$, networkName, networkName$ } = provider;

      if (typeof address !== 'undefined') {
        this.wallet$.next({
          address,
          providerType,
        });
      } else if (typeof address$ !== 'undefined') {
        subscriptions.push(
          address$
            .pipe(
              map((address) => ({
                address,
                providerType,
              })),
            )
            .subscribe(this.wallet$),
        );
      } else {
        throw new Error('Invalid wallet address');
      }

      if (typeof networkName !== 'undefined') {
        if (networkName) {
          networkService.switchNetwork(networkName);
        } else {
          networkService.useDefaultNetwork();
        }
      } else if (typeof networkName$ !== 'undefined') {
        subscriptions.push(
          networkName$.pipe(tap((networkName) => networkService.switchNetwork(networkName))).subscribe(),
        );
      } else {
        throw new Error('Invalid wallet networkName');
      }

      this.replaceSubscriptions(...subscriptions);
    }

    this.provider = provider;
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

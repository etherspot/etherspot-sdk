import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BytesLike } from 'ethers';
import { Service, ObjectSubject, UnChainedTypedData } from '../common';
import {
  WalletProvider,
  KeyWalletProvider,
  KeyWalletProviderOptions,
  WalletProviderLike,
  isWalletProvider,
} from '../wallet-providers';
import { WalletOptions, Wallet } from './interfaces';

export class WalletService extends Service {
  readonly wallet$ = new ObjectSubject<Wallet>();
  readonly walletAddress$: Observable<string>;

  private provider: WalletProvider;

  constructor(private options: WalletOptions) {
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
      if (isWalletProvider(options as WalletProviderLike)) {
        provider = options as WalletProvider;
      } else {
        provider = new KeyWalletProvider(options as KeyWalletProviderOptions);
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

      if (typeof address$ !== 'undefined') {
        subscriptions.push(
          address$
            .pipe(
              map((address) => ({
                address,
                providerType,
              })),
            )
            .subscribe((wallet) => this.wallet$.next(wallet)),
        );
      } else if (typeof address !== 'undefined') {
        this.wallet$.next({
          address,
          providerType,
        });
      } else {
        throw new Error('Invalid wallet address');
      }

      if (typeof networkName$ !== 'undefined') {
        subscriptions.push(
          networkName$
            .pipe(
              tap((networkName) => networkService.switchNetwork(networkName)), //
            )
            .subscribe(),
        );
      } else if (typeof networkName !== 'undefined') {
        if (networkName) {
          networkService.switchNetwork(networkName);
        } else {
          networkService.useDefaultNetwork();
        }
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

  async signMessage(message: BytesLike): Promise<string> {
    return this.provider ? this.provider.signMessage(message) : null;
  }

  async signTypedData(unChainedTypedData: UnChainedTypedData): Promise<string> {
    let result: string = null;

    if (this.provider) {
      const { chainId } = this.services.networkService;

      if (chainId) {
        const { domain, ...typedData } = unChainedTypedData;

        result = await this.provider.signTypedData({
          domain: {
            ...domain,
            chainId,
          },
          ...typedData,
        });
      }
    }

    return result;
  }

  protected onInit() {
    if (this.options) {
      this.switchWalletProvider(this.options);
      this.options = null;
    }
  }
}

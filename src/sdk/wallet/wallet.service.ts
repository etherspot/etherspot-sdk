import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BytesLike, Wallet as EtherWallet } from 'ethers';
import { Service, ObjectSubject } from '../common';
import { WalletProvider, WalletProviderLike, KeyWalletProvider, WalletLike } from './providers';
import { Wallet, WalletOptions } from './interfaces';

export class WalletService extends Service {
  readonly wallet$ = new ObjectSubject<Wallet>();
  readonly walletAddress$: Observable<string>;

  private provider: WalletProvider;

  constructor(private providerLike: WalletProviderLike, private options: WalletOptions) {
    super();

    this.walletAddress$ = this.wallet$.observeKey('address');
  }

  get wallet(): Wallet {
    return this.wallet$.value;
  }

  get etherWallet(): Partial<EtherWallet> {
    return this.wallet$.value;
  }

  get walletAddress(): string {
    return this.wallet ? this.wallet.address : null;
  }

  get walletProvider(): WalletProvider {
    return this.provider ? this.provider : null;
  }

  async signMessage(message: BytesLike): Promise<string> {
    return this.provider ? this.provider.signMessage(message) : null;
  }

  protected switchWalletProvider(providerLike: WalletProviderLike): void {
    let provider: WalletProvider = null;
    if (providerLike) {
      switch (typeof providerLike) {
        case 'object': {
          const { privateKey } = providerLike as WalletLike;
          const walletLike = providerLike as EtherWallet;
          const isNotJsonRpcProvider = walletLike.provider?.constructor.name !== 'JsonRpcProvider';
          if (privateKey && isNotJsonRpcProvider) {
            provider = new KeyWalletProvider(privateKey);
          } else {
            provider = providerLike as WalletProvider;
          }
          break;
        }

        case 'string':
          provider = new KeyWalletProvider(providerLike);
          break;
      }
    }

    if (!provider) {
      this.wallet$.next(null);

      this.removeSubscriptions();
    } else {
      const { type: providerType } = provider;
      const { networkService } = this.services;

      const subscriptions: Subscription[] = [];
      const { address, address$, networkName$ } = provider;

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
        const { omitProviderNetworkCheck } = this.options;

        if (omitProviderNetworkCheck) {
          networkService.useDefaultNetwork();
        } else {
          subscriptions.push(
            networkName$
              .pipe(
                tap((networkName) => {
                  networkService.switchNetwork(networkName);
                }),
              )
              .subscribe(),
          );
        }
      } else {
        networkService.useDefaultNetwork();
      }

      this.replaceSubscriptions(...subscriptions);
    }

    this.provider = provider;
  }

  protected onInit() {
    if (this.providerLike) {
      this.switchWalletProvider(this.providerLike);
      this.providerLike = null;
    }
  }
}

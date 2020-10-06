import { Observable } from 'rxjs';
import { Service, ObjectSubject } from '../common';
import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames } from './constants';
import { Network, NetworkOptions } from './interfaces';

export class NetworkService extends Service {
  readonly network$ = new ObjectSubject<Network>(null);
  readonly chainId$: Observable<number>;
  readonly supportedNetworks: Network[];

  constructor(options: NetworkOptions) {
    super();

    const { supportedNetworkNames } = options;

    this.supportedNetworks = supportedNetworkNames
      .map((name) => {
        const chainId = NETWORK_NAME_TO_CHAIN_ID[name];
        return !chainId
          ? null
          : {
              chainId,
              name,
            };
      })
      .filter((value) => !!value);

    if (!this.supportedNetworks.length) {
      throw new Error(`Invalid network config`);
    }

    this.chainId$ = this.network$.observeKey('chainId');
  }

  get network(): Network {
    return this.network$.value;
  }

  get chainId(): number {
    return this.network ? this.network.chainId : null;
  }

  useDefaultNetwork(): void {
    this.network$.next(this.supportedNetworks[0]);
  }

  switchNetwork(networkName: NetworkNames): void {
    this.network$.next(this.supportedNetworks.find(({ name }) => name === networkName) || null);
  }

  isNetworkNameSupported(networkName: string): boolean {
    return !!this.supportedNetworks.find(({ name }) => name === networkName);
  }
}

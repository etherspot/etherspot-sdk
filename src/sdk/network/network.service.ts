import { Observable } from 'rxjs';
import { Service, ObjectSubject } from '../common';
import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames } from './constants';
import { Network, NetworkOptions } from './interfaces';

export class NetworkService extends Service {
  readonly network$ = new ObjectSubject<Network>(null);
  readonly chainId$: Observable<number>;
  readonly supportedNetworks: Network[];

  private readonly defaultNetwork: Network;

  constructor(options: NetworkOptions) {
    super();

    const { defaultNetworkName, supportedNetworkNames } = options;

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

    let defaultNetwork: Network;

    if (defaultNetworkName) {
      defaultNetwork = this.supportedNetworks.find(({ name }) => name === defaultNetworkName);

      if (!defaultNetwork) {
        throw new Error(`Unsupported network`);
      }
    } else {
      defaultNetwork = this.supportedNetworks[0];
    }

    this.defaultNetwork = defaultNetwork;
    this.network$.next(defaultNetwork);
    this.chainId$ = this.network$.observeKey('chainId');
  }

  get network(): Network {
    return this.network$.value;
  }

  get chainId(): number {
    const { chainId } = this.network;
    return chainId;
  }

  switchNetwork(network: NetworkNames | Network = null): Network {
    let result: Network = null;

    if (!network) {
      result = this.defaultNetwork;
    } else {
      let networkName: string;

      switch (typeof network) {
        case 'string':
          networkName = network;
          break;
        case 'object':
          networkName = network.name;
          break;
      }

      if (networkName) {
        result = this.supportedNetworks.find(({ name }) => name === networkName);
      }

      if (!result) {
        throw new Error(`Unsupported network`);
      }
    }

    this.network$.next(result);

    return result;
  }
}

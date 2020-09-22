import { Service, UniqueSubject } from '../common';
import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames } from './constants';
import { Network, NetworkOptions } from './interfaces';

export class NetworkService extends Service {
  readonly network$ = new UniqueSubject<Network>(null);
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
  }

  get network(): Network {
    return this.network$.value;
  }

  switchNetwork(networkName: NetworkNames = null): Network {
    let network: Network;

    if (!networkName) {
      network = this.defaultNetwork;
    } else {
      network = this.supportedNetworks.find(({ name }) => name === networkName);
    }

    if (!network) {
      throw new Error(`Unsupported network`);
    }

    this.network$.next(network);

    return this.network;
  }
}

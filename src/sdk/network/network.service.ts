import { ContractNames, getContractAddress, getContractByteCodeHash } from '@etherspot/contracts';
import { Observable } from 'rxjs';
import { ObjectSubject, Service } from '../common';
import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames } from './constants';
import { Network, NetworkOptions } from './interfaces';

export class NetworkService extends Service {
  readonly network$ = new ObjectSubject<Network>(null);
  readonly chainId$: Observable<number>;
  readonly defaultNetwork: Network;
  readonly supportedNetworks: Network[];

  constructor(private options: NetworkOptions, defaultNetworkName?: NetworkNames) {
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
      throw new Error('Invalid network config');
    }

    this.defaultNetwork = defaultNetworkName
      ? this.supportedNetworks.find(({ name }) => name === defaultNetworkName)
      : this.supportedNetworks[0];

    if (!this.defaultNetwork) {
      throw new Error('Unsupported network');
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
    this.network$.next(this.defaultNetwork);
  }

  switchNetwork(networkName: NetworkNames): void {
    this.network$.next(this.supportedNetworks.find(({ name }) => name === networkName) || null);
  }

  isNetworkNameSupported(networkName: string): boolean {
    return !!this.supportedNetworks.find(({ name }) => name === networkName);
  }

  getExternalContractAddress(contractName: string): string {
    return null;
  }

  getInternalContractAddress(contractName: ContractNames): string {
    let result: string = null;

    if (this.network) {
      const { chainId, name } = this.network;
      const { internalContracts } = this.options;

      if (internalContracts && internalContracts[name] && internalContracts[name][contractName]) {
        result = internalContracts[name][contractName];
      } else {
        result = getContractAddress(contractName, chainId);
      }
    }

    return result;
  }

  getInternalAccountByteCodeHash(): string {
    let result: string = null;

    if (this.network) {
      const { name } = this.network;
      const { internalContracts } = this.options;

      if (internalContracts && internalContracts[name] && internalContracts[name].accountByteCodeHash) {
        result = internalContracts[name].accountByteCodeHash;
      } else {
        result = getContractByteCodeHash(ContractNames.Account);
      }
    }

    return result;
  }
}

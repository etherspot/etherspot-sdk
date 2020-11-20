import { ContractNames, getContractAddress, getContractByteCodeHash } from '@etherspot/contracts';
import { Observable } from 'rxjs';
import { ObjectSubject, Service } from '../common';
import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames } from './constants';
import { Network, NetworkOptions } from './interfaces';

export class NetworkService extends Service {
  readonly network$ = new ObjectSubject<Network>(null);
  readonly chainId$: Observable<number>;
  readonly supportedNetworks: Network[];

  constructor(private options: NetworkOptions) {
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

  getContractAddress(contractName: ContractNames): string {
    let result: string = null;

    if (this.network) {
      const { chainId, name } = this.network;
      const { contracts } = this.options;

      if (contracts && contracts[name] && contracts[name][contractName]) {
        result = contracts[name][contractName];
      } else {
        result = getContractAddress(contractName, chainId);
      }
    }

    return result;
  }

  getAccountByteCodeHash(): string {
    let result: string = null;

    if (this.network) {
      const { name } = this.network;
      const { contracts } = this.options;

      if (contracts && contracts[name] && contracts[name].accountByteCodeHash) {
        result = contracts[name].accountByteCodeHash;
      } else {
        result = getContractByteCodeHash(ContractNames.Account);
      }
    }

    return result;
  }
}

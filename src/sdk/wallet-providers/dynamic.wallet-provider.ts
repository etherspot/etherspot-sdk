import { NetworkNames, prepareNetworkName } from '../network';
import { prepareAddress, UniqueSubject } from '../common';
import { WalletProvider } from './wallet-provider';

export abstract class DynamicWalletProvider extends WalletProvider {
  readonly address$ = new UniqueSubject<string>();
  readonly networkName$ = new UniqueSubject<NetworkNames>();

  get address(): string {
    return this.address$.value;
  }

  get networkName(): NetworkNames {
    return this.networkName$.value;
  }

  setAddress(address: string): void {
    this.address$.next(prepareAddress(address));
  }

  setNetworkName(networkNameOrChainId: string | number): void {
    this.networkName$.next(prepareNetworkName(networkNameOrChainId));
  }
}

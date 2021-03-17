import { NetworkNames, prepareNetworkName } from '../../network';
import { prepareAddress, UniqueSubject } from '../../common';
import { WalletProvider } from './interfaces';

export abstract class DynamicWalletProvider implements WalletProvider {
  readonly address$ = new UniqueSubject<string>();
  readonly networkName$ = new UniqueSubject<NetworkNames>();

  protected constructor(readonly type: string) {
    //
  }

  get address(): string {
    return this.address$.value;
  }

  get networkName(): NetworkNames {
    return this.networkName$.value;
  }

  abstract signMessage(message: any): Promise<string>;

  protected setAddress(address: string): void {
    this.address$.next(prepareAddress(address));
  }

  protected setNetworkName(networkNameOrChainId: string | number): void {
    this.networkName$.next(prepareNetworkName(networkNameOrChainId));
  }
}

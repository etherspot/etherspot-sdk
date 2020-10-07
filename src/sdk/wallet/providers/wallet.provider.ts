import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { NetworkNames, prepareNetworkName } from '../../network';
import { prepareAddress, UniqueSubject } from '../../common';
import { WalletProviderLike } from './interfaces';

export abstract class WalletProvider implements WalletProviderLike {
  static isWalletProvider(provider: WalletProviderLike): boolean {
    return (
      provider && //
      typeof provider === 'object' &&
      typeof provider.personalSignMessage === 'function' &&
      typeof provider.signMessage === 'function' &&
      typeof provider.signTypedData === 'function'
    );
  }

  readonly type: string = 'Custom';
  readonly address?: string;
  readonly address$?: UniqueSubject<string>;
  readonly networkName?: NetworkNames;
  readonly networkName$?: UniqueSubject<NetworkNames>;

  abstract personalSignMessage(message: BytesLike): Promise<string>;

  abstract signMessage(message: BytesLike): Promise<string>;

  abstract signTypedData(typedData: TypedData): Promise<string>;

  protected getAddress(): string {
    return this.address$ ? this.address$.value : this.address || null;
  }

  protected setAddress(address: string): void {
    if (this.address$) {
      this.address$.next(prepareAddress(address));
    }
  }

  protected setNetworkName(networkNameOrChainId: any): void {
    if (this.networkName$) {
      this.networkName$.next(prepareNetworkName(networkNameOrChainId));
    }
  }
}

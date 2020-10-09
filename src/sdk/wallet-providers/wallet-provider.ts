import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { NetworkNames } from '../network';
import { UniqueSubject } from '../common';
import { WalletProviderLike } from './interfaces';

export abstract class WalletProvider implements WalletProviderLike {
  readonly address: string;
  readonly address$?: UniqueSubject<string>;
  readonly networkName: NetworkNames;
  readonly networkName$?: UniqueSubject<NetworkNames>;

  protected constructor(readonly type = 'Custom') {
    //
  }

  abstract personalSignMessage(message: BytesLike): Promise<string>;

  abstract signMessage(message: BytesLike): Promise<string>;

  abstract signTypedData(typedData: TypedData): Promise<string>;
}

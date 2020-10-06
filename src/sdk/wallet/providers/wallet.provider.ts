import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { Service, UniqueSubject } from '../../common';

export abstract class WalletProvider extends Service {
  readonly address$ = new UniqueSubject<string>();

  get address(): string {
    return this.address$.value;
  }

  abstract personalSignMessage(message: BytesLike): Promise<string>;

  abstract signMessage(message: string): Promise<string>;

  abstract signTypedData(typedData: TypedData): Promise<string>;
}

import { TransformBigNumber, WithTypename } from '../../common';
import { BigNumber } from 'ethers';

export class RelayedAccount extends WithTypename {
  account: string;

  @TransformBigNumber()
  nonce: BigNumber;
}

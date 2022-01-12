import { BaseClass } from '../../common';
import { TokenTypes } from '../constants';
import { Nft } from './nft';

export class NftCollection extends BaseClass<NftCollection> {
  contractName: string;

  contractSymbol: string;

  contractAddress: string;

  tokenType: TokenTypes;

  nftVersion: string;

  nftDescription: string;

  balance: number;

  items: Nft[];
}

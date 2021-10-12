import { IsOptional } from 'class-validator';
import { BaseClass } from '../../common';
import { TokenTypes } from '../constants';
import { Nft } from './nft';

export class NftCollection extends BaseClass<NftCollection> {
  @IsOptional()
  contractName?: string;

  @IsOptional()
  contractSymbol?: string;

  contractAddress: string;

  balance: number;

  tokenType: TokenTypes;

  items: Nft[];
}

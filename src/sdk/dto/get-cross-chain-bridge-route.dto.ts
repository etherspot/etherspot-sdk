import { IsBoolean, IsPositive, IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsBigNumberish } from './validators';


export class GetCrossChainBridgeRouteDto {
  // @IsAddress()
  fromTokenAddress: string;

  @IsPositive()
  fromChainId: number;

  // @IsAddress()
  toTokenAddress: string;

  @IsPositive()
  toChainId: number;

  @IsBigNumberish()
  fromAmount?: BigNumberish = null;

  // @IsAddress()
  userAddress: string;

  @IsOptional()
  @IsBoolean()
  disableSwapping: boolean;
}
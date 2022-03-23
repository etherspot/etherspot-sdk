import { IsBoolean, IsPositive, IsOptional } from 'class-validator';


export class GetCrossChainBridgeRouteDto {
  // @IsAddress()
  fromTokenAddress: string;

  
  fromChainId?: number;

  // @IsAddress()
  toTokenAddress: string;

  @IsPositive()
  toChainId?: number;

  fromAmount: string;

  // @IsAddress()
  userAddress: string;

  @IsOptional()
  @IsBoolean()
  disableSwapping: boolean;
}
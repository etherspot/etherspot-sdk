import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { SocketTokenDirection } from '../exchange/constants';

export class GetCrossChainBridgeTokenListDto {
  @IsEnum(SocketTokenDirection)
  direction: SocketTokenDirection;

  @IsInt()
  @IsPositive()
  fromChainId: number;

  @IsInt()
  @IsPositive()
  toChainId: number;

  @IsOptional()
  @IsBoolean()
  disableSwapping?: boolean;
}

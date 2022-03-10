import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { SocketTokenDirection } from '../exchange/constants';

export class GetCrossChainBridgeTokenListDto {
  @IsEnum(SocketTokenDirection)
  direction: SocketTokenDirection;

  @IsInt()
  fromChainId: number;

  @IsInt()
  toChainId: number;

  @IsOptional()
  @IsBoolean()
  disableSwapping?: boolean;
}

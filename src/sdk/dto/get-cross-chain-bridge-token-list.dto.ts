import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { SocketTokenDirection, CrossChainServiceProvider } from '../exchange/constants';

export class GetCrossChainBridgeTokenListDto {
  @IsEnum(SocketTokenDirection)
  direction: SocketTokenDirection;

  @IsInt()
  fromChainId: number;

  @IsInt()
  toChainId?: number;

  @IsOptional()
  @IsBoolean()
  disableSwapping?: boolean;

  @IsOptional()
  @IsEnum(CrossChainServiceProvider)
  serviceProvider?: CrossChainServiceProvider;
}

import { IsEnum, IsOptional } from 'class-validator';
import { CrossChainServiceProvider } from '../exchange/constants';

export class GetCrossChainBridgeSupportedChainsDto {
  @IsOptional()
  @IsEnum(CrossChainServiceProvider)
  serviceProvider?: CrossChainServiceProvider;
}

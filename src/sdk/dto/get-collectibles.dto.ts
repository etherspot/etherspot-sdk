import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetCollectiblesDto {
  @IsOptional()
  @IsAddress()
  account?: string;
}

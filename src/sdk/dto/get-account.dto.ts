import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetAccountDto {
  @IsAddress()
  @IsOptional()
  address?: string = null;
}

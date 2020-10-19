import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class EstimateBatchDto {
  @IsOptional()
  @IsAddress()
  refundToken?: string = null;
}

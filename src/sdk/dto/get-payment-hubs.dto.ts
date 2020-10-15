import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetPaymentHubsDto extends PaginationDto {
  @IsOptional()
  @IsAddress()
  hub?: string;

  @IsOptional()
  @IsAddress()
  token?: string;
}

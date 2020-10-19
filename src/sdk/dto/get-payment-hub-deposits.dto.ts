import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetPaymentHubDepositsDto extends PaginationDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress({
    each: true,
  })
  tokens?: string[] = [];

  @IsOptional()
  @IsAddress()
  owner?: string = null;
}

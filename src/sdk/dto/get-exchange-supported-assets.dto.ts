import { IsOptional, IsPositive } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class GetExchangeSupportedAssetsDto extends PaginationDto {
  @IsOptional()
  @IsPositive()
  chainId?: number;
}

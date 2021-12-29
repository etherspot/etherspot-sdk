import { IsOptional, IsPositive, IsInt, Max } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class PaginationDto extends NetworkNameDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  page?: number = null;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Max(100)
  limit?: number = null;
}

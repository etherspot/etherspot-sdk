import { IsOptional, IsPositive, IsInt, Max } from 'class-validator';

export class PaginationDto {
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

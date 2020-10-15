import { IsOptional, IsPositive, IsInt } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  page?: number = null;
}

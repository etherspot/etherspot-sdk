import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetAccountMembersDto extends PaginationDto {
  @IsOptional()
  @IsAddress()
  account?: string = null;
}

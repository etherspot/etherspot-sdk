import { IsOptional, IsBoolean } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetP2PPaymentChannelsAdminDto extends PaginationDto {
  @IsOptional()
  @IsAddress()
  sender?: string = null;

  @IsOptional()
  @IsAddress()
  recipient?: string = null;

  @IsOptional()
  @IsAddress()
  token?: null | string = undefined;

  @IsOptional()
  @IsBoolean()
  uncommittedOnly?: boolean = null;
}

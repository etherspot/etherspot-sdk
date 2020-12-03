import { IsOptional, IsBoolean } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetP2PPaymentChannelsDto extends PaginationDto {
  @IsOptional()
  @IsAddress()
  senderOrRecipient?: string = null;

  @IsOptional()
  @IsBoolean()
  uncommittedOnly?: boolean = null;
}

import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetPaymentHubPaymentsDto extends PaginationDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsAddress()
  senderOrRecipient?: string = null;
}

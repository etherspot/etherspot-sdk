import { NetworkNameDto } from './network-name.dto';
import { IsHex32 } from './validators';

export class GetGatewaySubmittedBatchDto extends NetworkNameDto {
  @IsHex32()
  hash: string;
}

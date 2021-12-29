import { NetworkNameDto } from './network-name.dto';
import { IsHex32 } from './validators';

export class CancelGatewayBatchDto extends NetworkNameDto {
  @IsHex32()
  hash: string;
}

import { IsHex32 } from './validators';

export class CancelGatewayBatchDto {
  @IsHex32()
  hash: string;
}

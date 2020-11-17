import { IsHex32 } from './validators';

export class GetGatewaySubmittedBatchDto {
  @IsHex32()
  hash: string;
}

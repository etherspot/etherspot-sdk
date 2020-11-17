import { IsAddress, IsHex } from './validators';

export class BatchGatewayTransactionRequestDto {
  @IsAddress()
  to: string;

  @IsHex()
  data: string;
}

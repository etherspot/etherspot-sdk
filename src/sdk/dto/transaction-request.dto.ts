import { IsAddress, IsHex } from './validators';

export class TransactionRequestDto {
  @IsAddress()
  to: string;

  @IsHex()
  data: string;
}

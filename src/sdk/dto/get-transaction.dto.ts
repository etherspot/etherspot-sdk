import { IsHex32 } from './validators';

export class GetTransactionDto {
  @IsHex32()
  hash: string;
}

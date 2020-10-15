import { IsHex32 } from './validators';

export class GetRelayedTransactionDto {
  @IsHex32()
  key: string;
}

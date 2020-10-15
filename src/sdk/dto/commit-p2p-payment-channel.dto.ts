import { IsOptional, IsBoolean } from 'class-validator';
import { IsHex32 } from './validators';

export class CommitP2PPaymentChannelDto {
  @IsHex32()
  hash: string;

  @IsOptional()
  @IsBoolean()
  deposit?: boolean = true;
}

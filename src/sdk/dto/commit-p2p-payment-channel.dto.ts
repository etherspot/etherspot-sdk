import { IsOptional, IsBoolean } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsHex32 } from './validators';

export class CommitP2PPaymentChannelDto extends NetworkNameDto {
  @IsHex32()
  hash: string;

  @IsOptional()
  @IsBoolean()
  deposit?: boolean = true;
}

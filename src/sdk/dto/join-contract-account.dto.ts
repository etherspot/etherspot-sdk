import { IsBoolean, IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class JoinContractAccountDto extends NetworkNameDto {
  @IsAddress()
  address: string;

  @IsOptional()
  @IsBoolean()
  sync?: boolean = true;
}

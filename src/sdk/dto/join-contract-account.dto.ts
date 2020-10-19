import { IsBoolean, IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class JoinContractAccountDto {
  @IsAddress()
  address: string;

  @IsOptional()
  @IsBoolean()
  sync?: boolean = true;
}

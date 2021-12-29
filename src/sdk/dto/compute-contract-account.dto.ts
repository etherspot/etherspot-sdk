import { IsBoolean, IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class ComputeContractAccountDto extends NetworkNameDto {
  @IsOptional()
  @IsBoolean()
  sync?: boolean = true;
}

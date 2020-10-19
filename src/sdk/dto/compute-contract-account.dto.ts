import { IsBoolean, IsOptional } from 'class-validator';

export class ComputeContractAccountDto {
  @IsOptional()
  @IsBoolean()
  sync?: boolean = true;
}

import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsBigNumberish } from './validators';
import { WithCustomProjectMetadataDto } from './with-custom-project-metadata.dto';

export class SubmitBatchDto extends WithCustomProjectMetadataDto {
  @IsOptional()
  @IsBigNumberish()
  gasPrice?: BigNumberish = null;
}

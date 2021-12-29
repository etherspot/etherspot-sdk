import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress, IsBigNumberish } from './validators';

export class CreatePaymentHubPaymentDto extends NetworkNameDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsAddress()
  recipient: string;

  @IsBigNumberish({
    positive: true,
  })
  value: BigNumberish;
}

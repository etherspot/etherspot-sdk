import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress, IsBigNumberish } from './validators';

export class IncreaseP2PPaymentChannelAmountDto extends NetworkNameDto {
  @IsAddress()
  recipient: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsBigNumberish({
    positive: true,
  })
  value: BigNumberish;
}

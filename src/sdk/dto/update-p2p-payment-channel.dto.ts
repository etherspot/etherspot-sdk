import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class UpdateP2PPaymentChannelDto {
  @IsAddress()
  recipient: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsBigNumberish({
    positive: true,
  })
  totalAmount: BigNumberish;
}

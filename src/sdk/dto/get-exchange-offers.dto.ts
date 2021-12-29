import { BigNumberish } from 'ethers';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress, IsBigNumberish } from './validators';

export class GetExchangeOffersDto extends NetworkNameDto {
  @IsAddress()
  fromTokenAddress: string;

  @IsAddress()
  toTokenAddress: string;

  @IsBigNumberish({
    positive: true,
  })
  fromAmount: BigNumberish;
}

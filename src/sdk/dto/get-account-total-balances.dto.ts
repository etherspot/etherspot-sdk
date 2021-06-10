import { IsAddress } from './validators';
import { IsEnum } from 'class-validator';
import { GetAccountDto } from './get-account.dto';
import { Currencies } from '../account';

export class GetAccountTotalBalancesDto extends GetAccountDto {
  @IsEnum(Currencies)
  currency: Currencies;

  @IsAddress()
  account: string;
}

import { IsAddress } from './validators';
import { ArrayNotEmpty, IsInt, IsPositive } from 'class-validator';

export class FetchExchangeRatesDto {
  @IsAddress({
    each: true,
  })
  @ArrayNotEmpty()
  tokenList: Array<string>;

  @IsInt()
  @IsPositive()
  chainId: number;
}

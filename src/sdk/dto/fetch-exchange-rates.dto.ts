import { IsAddress } from './validators';
import { ArrayNotEmpty, IsInt, IsPositive } from 'class-validator';

export class FetchExchangeRatesDto {
  @IsAddress({
    each: true,
  })
  @ArrayNotEmpty()
  tokens: Array<string>;

  @IsInt()
  @IsPositive()
  chainId: number;
}

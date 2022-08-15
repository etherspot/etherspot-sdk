import { IsAddress } from './validators';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsInt, IsPositive } from 'class-validator';

export class FetchExchangeRatesDto {
  @IsAddress({
    each: true,
  })
  @ArrayNotEmpty()
  tokenList: Array<string>;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  chainId: number;
}

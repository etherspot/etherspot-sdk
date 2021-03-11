import { IsNotEmpty, ArrayUnique } from 'class-validator';
import { IsAddress } from './validators';

export class ENSNamesLookupDto {
  @IsNotEmpty()
  @ArrayUnique()
  @IsAddress({
    each: true,
  })
  addresses: string[];
}

import { IsString, IsNotEmpty, ArrayUnique } from 'class-validator';

export class ENSAddressesLookupDto {
  @IsNotEmpty()
  @ArrayUnique()
  @IsString({
    each: true,
  })
  names: string[];
}

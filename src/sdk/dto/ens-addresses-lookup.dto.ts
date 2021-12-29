import { IsString, IsNotEmpty, ArrayUnique } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class ENSAddressesLookupDto extends NetworkNameDto {
  @IsNotEmpty()
  @ArrayUnique()
  @IsString({
    each: true,
  })
  names: string[];
}

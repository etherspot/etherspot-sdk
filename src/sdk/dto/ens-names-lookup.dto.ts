import { IsNotEmpty, ArrayUnique } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class ENSNamesLookupDto extends NetworkNameDto {
  @IsNotEmpty()
  @ArrayUnique()
  @IsAddress({
    each: true,
  })
  addresses: string[];
}

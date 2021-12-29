import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class ComputeContractAccountByAddressDto extends NetworkNameDto {
  @IsAddress()
  address: string;
}

import { IsAddress } from './validators';

export class ComputeContractAccountByAddressDto {
  @IsAddress()
  address: string;
}

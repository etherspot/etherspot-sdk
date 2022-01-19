import { IsAddress } from './validators';

export class IsEligibleForAirdropDto {
  @IsAddress()
  address: string;
}

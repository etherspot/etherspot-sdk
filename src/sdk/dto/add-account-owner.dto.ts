import { IsAddress } from './validators';

export class AddAccountOwnerDto {
  @IsAddress()
  owner: string;
}

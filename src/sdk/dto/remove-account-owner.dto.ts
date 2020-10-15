import { IsAddress } from './validators';

export class RemoveAccountOwnerDto {
  @IsAddress()
  owner: string;
}

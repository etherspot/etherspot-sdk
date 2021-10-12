import { IsAddress } from './validators';

export class GetNftListDto {
  @IsAddress()
  account: string;
}

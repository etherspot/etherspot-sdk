import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetNftListDto extends NetworkNameDto {
  @IsAddress()
  account: string;
}

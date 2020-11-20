import { IsAddress } from './validators';
import { GetTokenListDto } from './get-token-list.dto';

export class IsTokenOnTokenListDto extends GetTokenListDto {
  @IsAddress()
  token: string;
}

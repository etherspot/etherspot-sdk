import { IsAddress } from './validators';
import { GetTokensListDto } from './get-tokens-list.dto';

export class IsTokenOnTokensListDto extends GetTokensListDto {
  @IsAddress()
  token: string;
}

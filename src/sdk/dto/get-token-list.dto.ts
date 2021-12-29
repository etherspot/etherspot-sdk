import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { TOKEN_LIST_MIN_NAME_LENGTH, TOKEN_LIST_MAX_NAME_LENGTH } from '../assets';
import { NetworkNameDto } from './network-name.dto';

export class GetTokenListDto extends NetworkNameDto {
  @IsOptional()
  @IsString()
  @MinLength(TOKEN_LIST_MIN_NAME_LENGTH)
  @MaxLength(TOKEN_LIST_MAX_NAME_LENGTH)
  name?: string = null;
}

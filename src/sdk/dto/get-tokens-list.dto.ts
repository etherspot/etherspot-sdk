import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { TOKENS_LIST_MIN_NAME_LENGTH, TOKENS_LIST_MAX_NAME_LENGTH } from '../assets';

export class GetTokensListDto {
  @IsOptional()
  @IsString()
  @MinLength(TOKENS_LIST_MIN_NAME_LENGTH)
  @MaxLength(TOKENS_LIST_MAX_NAME_LENGTH)
  name?: string = null;
}

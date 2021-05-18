import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { IsAddress } from './validators';

export class GetAccountDashboardDto {
  @IsAddress()
  account: string = null;

  @IsString()
  currency: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  days?: number;
}

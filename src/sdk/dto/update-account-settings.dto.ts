import { IsNumber, IsOptional, IsString } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class UpdateAccountSettingsDto extends NetworkNameDto {
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @IsOptional()
  @IsNumber()
  delayTransactions?: number;
}

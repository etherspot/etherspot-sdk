import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAccountSettingsDto {
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @IsOptional()
  @IsNumber()
  delayTransactions?: number;
}

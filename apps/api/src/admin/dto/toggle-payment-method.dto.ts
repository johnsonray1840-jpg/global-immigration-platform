import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TogglePaymentMethodDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  suspensionMessage?: string;
}
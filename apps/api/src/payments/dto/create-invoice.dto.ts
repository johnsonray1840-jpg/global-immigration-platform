import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  caseId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsObject()
  breakdown?: Record<string, any>;

  @IsOptional()
  @IsString()
  promoCode?: string;
}
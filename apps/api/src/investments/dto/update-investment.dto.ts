import { IsString, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';
import { InvestmentStatus, InvestmentType } from '@prisma/client';

export class UpdateInvestmentDto {
  @IsEnum(InvestmentType)
  @IsOptional()
  type?: InvestmentType;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsObject()
  @IsOptional()
  propertyDetails?: any;

  @IsObject()
  @IsOptional()
  fundDetails?: any;

  @IsObject()
  @IsOptional()
  businessDetails?: any;

  @IsObject()
  @IsOptional()
  donationDetails?: any;

  @IsObject()
  @IsOptional()
  bondDetails?: any;

  @IsString()
  @IsOptional()
  notes?: string;
}

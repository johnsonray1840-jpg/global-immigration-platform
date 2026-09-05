import { IsString, IsNumber, IsEnum, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { InvestmentType } from '@prisma/client';

export class CreateInvestmentDto {
  @IsEnum(InvestmentType)
  type: InvestmentType;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @IsString()
  @IsOptional()
  programId?: string;

  @IsString()
  caseId?: string;

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
}

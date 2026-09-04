import { IsString, IsNumber, IsOptional, IsEnum, IsObject, IsDateString } from 'class-validator';
import { InvestmentType, MilestoneStatus } from '@prisma/client';

export class CreateInvestmentDto {
  @IsString()
  programId: string;

  @IsOptional()
  @IsString()
  caseId?: string;

  @IsEnum(InvestmentType)
  investmentType: InvestmentType;

  @IsNumber()
  targetAmount: number;

  @IsOptional()
  @IsNumber()
  investedAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(InvestmentType)
  expectedROI?: number;

  @IsOptional()
  @IsNumber()
  lockPeriodMonths?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  maturityDate?: string;

  @IsOptional()
  @IsObject()
  assetDetails?: any;

  @IsOptional()
  @IsObject()
  propertyDetails?: any;

  @IsOptional()
  @IsObject()
  businessDetails?: any;

  @IsOptional()
  @IsString()
  riskRating?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInvestmentDto {
  @IsOptional()
  @IsNumber()
  investedAmount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  actualROI?: number;

  @IsOptional()
  @IsDateString()
  exitDate?: string;

  @IsOptional()
  @IsObject()
  complianceChecks?: any;

  @IsOptional()
  @IsObject()
  assetDetails?: any;

  @IsOptional()
  @IsObject()
  propertyDetails?: any;

  @IsOptional()
  @IsObject()
  businessDetails?: any;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateMilestoneDto {
  @IsString()
  investmentId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @IsOptional()
  @IsString()
  evidenceRequired?: boolean;
}

export class UpdateMilestoneDto {
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  evidenceProvided?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddTransactionDto {
  @IsString()
  investmentId: string;

  @IsString()
  type: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsDateString()
  transactionDate: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  proofOfPayment?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UploadInvestmentDocumentDto {
  @IsString()
  investmentId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class LogPerformanceDto {
  @IsString()
  investmentId: string;

  @IsNumber()
  currentValue: number;

  @IsOptional()
  @IsNumber()
  accruedReturns?: number;

  @IsOptional()
  @IsNumber()
  roiPercentage?: number;

  @IsOptional()
  @IsString()
  marketConditions?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

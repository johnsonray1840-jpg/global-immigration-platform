import { IsString, IsEnum, IsOptional } from 'class-validator';
import { InvestmentStatus } from '@prisma/client';

export class ReviewInvestmentDto {
  @IsEnum([InvestmentStatus.APPROVED, InvestmentStatus.REJECTED, InvestmentStatus.COMPLETED, InvestmentStatus.UNDER_REVIEW])
  status: InvestmentStatus;
  
  @IsString()
  @IsOptional()
  rejectionReason?: string;
  
  @IsString()
  @IsOptional()
  notes?: string;
}

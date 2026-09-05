import { IsString, IsEnum, IsOptional } from 'class-validator';
import { InvestmentStatus } from '@prisma/client';

export class ReviewInvestmentDto {
  @IsEnum(InvestmentStatus)
  status: InvestmentStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

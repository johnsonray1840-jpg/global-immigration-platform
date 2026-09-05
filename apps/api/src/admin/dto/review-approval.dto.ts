import { IsString, IsOptional } from 'class-validator';

export class ReviewApprovalDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
import { IsString, IsOptional, IsEnum, IsDateString, IsInt } from 'class-validator';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  consultantId: string;

  @IsOptional()
  @IsString()
  caseId?: string;

  @IsEnum(AppointmentType)
  type: AppointmentType;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsInt()
  durationMin?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ScholarshipLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  MASTERS = 'MASTERS',
  PHD = 'PHD',
  RESEARCH = 'RESEARCH',
}

export class CreateScholarshipDto {
  @ApiProperty({ description: 'Scholarship title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Full description of the scholarship' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Country offering the scholarship' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'University or institution name' })
  @IsString()
  @IsNotEmpty()
  university: string;

  @ApiProperty({ description: 'Scholarship level', enum: ScholarshipLevel, required: false })
  @IsOptional()
  @IsEnum(ScholarshipLevel)
  level?: ScholarshipLevel;

  @ApiProperty({ description: 'Amount covered (e.g., "Full Tuition", "$5000")' })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'Application deadline', required: false })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiProperty({ description: 'Eligibility requirements' })
  @IsString()
  @IsNotEmpty()
  eligibility: string;

  @ApiProperty({ description: 'Application URL', required: false })
  @IsOptional()
  @IsString()
  applicationUrl?: string;

  @ApiProperty({ description: 'Is the scholarship active?', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Logo or image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateScholarshipDto {
  @ApiProperty({ description: 'Scholarship title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Full description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'University', required: false })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiProperty({ description: 'Level', enum: ScholarshipLevel, required: false })
  @IsOptional()
  @IsEnum(ScholarshipLevel)
  level?: ScholarshipLevel;

  @ApiProperty({ description: 'Amount covered', required: false })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiProperty({ description: 'Deadline', required: false })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiProperty({ description: 'Eligibility', required: false })
  @IsOptional()
  @IsString()
  eligibility?: string;

  @ApiProperty({ description: 'Application URL', required: false })
  @IsOptional()
  @IsString()
  applicationUrl?: string;

  @ApiProperty({ description: 'Is active?', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

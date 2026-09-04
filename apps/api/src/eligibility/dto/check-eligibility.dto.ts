import { IsString, IsInt, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CheckEligibilityDto {
  @IsString()
  originCountryCode: string;   // ISO code of user's nationality

  @IsString()
  destinationCountryCode: string;

  @IsInt()
  age: number;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsInt()
  workExperienceYears?: number;

  @IsOptional()
  @IsNumber()
  annualIncome?: number;

  @IsOptional()
  @IsString()
  languageTest?: string;       // e.g. "IELTS 7.0"

  @IsOptional()
  @IsNumber()
  investmentBudget?: number;

  @IsOptional()
  @IsString()
  purpose?: string;            // work, study, family, etc.

  @IsOptional()
  @IsInt()
  familySize?: number;
}
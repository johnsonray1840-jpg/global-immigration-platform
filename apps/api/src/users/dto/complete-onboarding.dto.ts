import { IsString, IsOptional, IsNumber, IsDateString, IsArray, IsBoolean } from 'class-validator';

export class CompleteOnboardingDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() educationLevel?: string;
  @IsOptional() @IsNumber() annualIncome?: number;
  @IsOptional() @IsString() maritalStatus?: string;
  @IsOptional() @IsString() languageTest?: string;
  @IsOptional() @IsNumber() investmentBudget?: number;
  @IsOptional() @IsNumber() familySize?: number;

  @IsOptional() @IsString() migrationPurpose?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) preferredDestinations?: string[];
}

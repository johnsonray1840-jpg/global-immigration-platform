import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() addressLine1?: string;
  @IsOptional() @IsString() addressLine2?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() educationLevel?: string;
  @IsOptional() @IsNumber() annualIncome?: number;
  @IsOptional() @IsString() maritalStatus?: string;
  @IsOptional() @IsString() languageTest?: string;
  @IsOptional() @IsNumber() investmentBudget?: number;
}
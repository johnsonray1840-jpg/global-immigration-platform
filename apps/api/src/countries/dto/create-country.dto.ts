import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  continent?: string;

  @IsOptional()
  @IsNumber()
  passportRank?: number;

  @IsOptional()
  @IsNumber()
  safetyIndex?: number;

  @IsOptional()
  @IsNumber()
  livingCostIndex?: number;

  @IsOptional()
  @IsNumber()
  healthcareIndex?: number;

  @IsOptional()
  @IsNumber()
  educationIndex?: number;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  climate?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
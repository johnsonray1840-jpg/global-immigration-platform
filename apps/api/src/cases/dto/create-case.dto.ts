import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  originCountryId: string;

  @IsString()
  destinationCountryId: string;

  @IsOptional()
  @IsString()
  visaRuleId?: string;

  @IsOptional()
  @IsString()
  eligibilityLabel?: string;
}
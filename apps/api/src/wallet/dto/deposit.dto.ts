import { IsNumber, IsString, IsOptional } from 'class-validator';

export class DepositDto {
  @IsNumber()
  amount: number;

  @IsString()
  paymentMethodType: string;

  @IsOptional()
  @IsString()
  promoCode?: string;
}
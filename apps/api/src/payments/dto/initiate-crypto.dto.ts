import { IsString, IsNumber } from 'class-validator';

export class InitiateCryptoDto {
  @IsString()
  invoiceId: string;

  @IsString()
  currency: string;

  @IsNumber()
  amount: number;
}
import { IsString } from 'class-validator';

export class InitiateWireDto {
  @IsString()
  invoiceId: string;
}
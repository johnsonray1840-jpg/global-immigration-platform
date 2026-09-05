import { IsOptional, IsString } from 'class-validator';

export class RequestApprovalDto {
  @IsString()
  invoiceId: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}
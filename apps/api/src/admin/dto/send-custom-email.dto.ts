import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class SendCustomEmailDto {
  @IsNotEmpty()
  @IsString()
  recipientEmail: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsString()
  badge?: string;
}

import { IsString, IsOptional, IsArray } from 'class-validator';

export class ChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;

  @IsOptional()
  @IsString()
  language?: string; // e.g., 'en', 'fr', 'es', 'de', 'zh', 'ar'
}
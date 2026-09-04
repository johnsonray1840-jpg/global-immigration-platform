import { Controller, Post, Body, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import type { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(@Body() dto: ChatDto) {
    return this.aiService.chat(dto.message, dto.history, dto.language);
  }

  @Post('chat/stream')
  async streamChat(@Body() dto: ChatDto, @Res() res: Response) {
    await this.aiService.streamChat(dto.message, dto.history || [], dto.language || 'en', res);
  }
}
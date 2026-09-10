import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(@Body() dto: ChatDto, @Req() req: Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.aiService.chat(dto.message, dto.history, dto.language, {
      sessionId: dto.sessionId,
      userId: dto.userId,
      userName: dto.userName,
      userEmail: dto.userEmail,
      ipAddress,
      userAgent,
    });
  }

  @Post('chat/stream')
  async streamChat(@Body() dto: ChatDto, @Res() res: Response, @Req() req: Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await this.aiService.streamChat(dto.message, dto.history || [], dto.language || 'en', res, {
      sessionId: dto.sessionId,
      userId: dto.userId,
      userName: dto.userName,
      userEmail: dto.userEmail,
      ipAddress,
      userAgent,
    });
  }

  // ──────────────────────────────────────────────
  // Admin AI Chat Log Management Endpoints
  // ──────────────────────────────────────────────

  @Get('admin/logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'COMPLIANCE')
  async getAdminLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('userType') userType?: string,
  ) {
    return this.aiService.getChatLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search || '',
      userType || 'all',
    );
  }

  @Get('admin/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'COMPLIANCE')
  async getAdminSessions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.aiService.getChatSessions(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search || '',
    );
  }

  @Get('admin/sessions/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'COMPLIANCE')
  async getSessionHistory(@Param('sessionId') sessionId: string) {
    return this.aiService.getSessionHistory(sessionId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'COMPLIANCE')
  async getAdminChatStats() {
    return this.aiService.getChatStats();
  }

  @Delete('admin/logs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async deleteChatLog(@Param('id') id: string) {
    return this.aiService.deleteChatLog(id);
  }

  @Delete('admin/sessions/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async deleteSessionLogs(@Param('sessionId') sessionId: string) {
    return this.aiService.deleteSessionLogs(sessionId);
  }
}
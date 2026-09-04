import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('conversation/:otherId')
  getConversation(@Req() req, @Param('otherId') otherId: string) {
    return this.messagesService.getConversation(req.user.id, otherId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat-list')
  getChatList(@Req() req) {
    return this.messagesService.getChatList(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  send(@Req() req, @Body() body: { receiverId: string; content: string }) {
    return this.messagesService.sendMessage(req.user.id, body.receiverId, body.content);
  }
}
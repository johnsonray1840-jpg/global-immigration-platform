import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getNotifications(@Req() req) {
    return this.notificationsService.getNotifications(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}

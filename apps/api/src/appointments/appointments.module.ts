import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [MailModule, NotificationsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, CalendarService],
})
export class AppointmentsModule {}
import { Module } from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { ConsultantController } from './consultant.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ConsultantController],
  providers: [ConsultantService],
})
export class ConsultantModule {}
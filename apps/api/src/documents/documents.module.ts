import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { StorageService } from './storage.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { OcrService } from './ocr.service';


@Module({
  imports: [NotificationsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, StorageService, OcrService,],
})
export class DocumentsModule {}
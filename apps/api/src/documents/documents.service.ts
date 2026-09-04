import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { EventsGateway } from '../real-time/events.gateway';
import * as uuid from 'uuid';
import { NotificationsService } from '../notifications/notifications.service';
import { OcrService } from './ocr.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
    private ocrService: OcrService,
  ) {}

  async directUpload(
    userId: string,
    caseId: string,
    file: Express.Multer.File,
    type: string,
  ) {
    const caseExists = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
    });
    if (!caseExists) throw new NotFoundException('Case not found');

    if (!file) throw new BadRequestException('No file uploaded');

    // Store file locally (or use S3 if configured)
    let fileUrl: string;
    try {
      fileUrl = await this.storage.uploadLocal(file);
    } catch (storageError) {
      // fallback to direct path
      const uploadDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${file.originalname}`;
      await fs.writeFile(path.join(uploadDir, fileName), file.buffer);
      fileUrl = `/uploads/${fileName}`;
    }

    const doc = await this.prisma.document.create({
      data: {
        caseId,
        userId,
        name: file.originalname,
        type: type || 'other',
        fileUrl,
        status: 'UPLOADED',
      },
    });

    // OCR (optional, fail silently)
    try {
      const ocrResult = await this.ocrService.extractText(fileUrl);
      if (ocrResult.text) {
        await this.prisma.document.update({
          where: { id: doc.id },
          data: {
            ocrText: ocrResult.text,
            expiryDate: ocrResult.expiryDate || null,
          },
        });
      }
    } catch (ocrError) {
      console.warn('OCR failed:', ocrError);
    }

    this.eventsGateway.emitToUser(userId, 'document-uploaded', doc);
    await this.notificationsService.createNotification(
      userId,
      'Document Uploaded',
      `Your document "${file.originalname}" has been uploaded successfully.`,
      { documentId: doc.id },
    );

    return doc;
  }

  async createUploadUrl(
    userId: string,
    caseId: string,
    name: string,
    type: string,
    contentType: string,
  ) {
    const caseExists = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
    });
    if (!caseExists) throw new NotFoundException('Case not found');

    const key = `${userId}/${caseId}/${uuid.v4()}-${name}`;
    const url = await this.storage.getPresignedUrl(key, contentType);

    return { uploadUrl: url, key, method: 'PUT' };
  }

  async confirmUpload(
    userId: string,
    caseId: string,
    key: string,
    name: string,
    type: string,
  ) {
    const doc = await this.prisma.document.create({
      data: {
        caseId,
        userId,
        name,
        type,
        fileUrl: key,
        status: 'UPLOADED',
      },
    });

    const ocrResult = await this.ocrService.extractText(key);
    const updatedDoc = await this.prisma.document.update({
      where: { id: doc.id },
      data: {
        ocrText: ocrResult.text,
        expiryDate: ocrResult.expiryDate || null,
      },
    });

    this.eventsGateway.emitToUser(userId, 'document-uploaded', updatedDoc);
    await this.notificationsService.createNotification(
      userId,
      'Document Uploaded',
      `Your document "${name}" has been uploaded successfully.`,
      { documentId: doc.id },
    );

    return updatedDoc;
  }

  async getCaseDocuments(userId: string, caseId: string) {
    return this.prisma.document.findMany({
      where: { caseId, userId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async getChecklist(caseId: string, userId: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
      include: { visaRule: true },
    });
    if (!caseData || !caseData.visaRule) {
      throw new NotFoundException('Case or visa rule not found');
    }

    const requiredDocs = (caseData.visaRule.requiredDocs as string[]) || [];
    const existingDocs = await this.prisma.document.findMany({
      where: { caseId },
    });
    const providedTypes = existingDocs.map((d) => d.type);

    return requiredDocs.map((docType) => ({
      documentName: docType,
      isProvided: providedTypes.includes(docType),
    }));
  }
}
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

    let fileUrl: string;
    try {
      fileUrl = await this.storage.uploadLocal(file);
    } catch (storageError) {
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
        status: 'PENDING_REVIEW',
      },
    });

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
        status: 'PENDING_REVIEW',
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
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const canViewAll = ['SUPER_ADMIN', 'ADMIN', 'CONSULTANT', 'COMPLIANCE', 'DOCUMENT_VERIFIER'].includes(user?.role || '');
    const where = canViewAll ? { caseId } : { caseId, userId };
    return this.prisma.document.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async getChecklist(caseId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const canViewAll = ['SUPER_ADMIN', 'ADMIN', 'CONSULTANT', 'COMPLIANCE', 'DOCUMENT_VERIFIER'].includes(user?.role || '');
    const caseWhere = canViewAll ? { id: caseId } : { id: caseId, userId };
    const caseData = await this.prisma.case.findFirst({
      where: caseWhere,
      include: { visaRule: true },
    });
    if (!caseData || !caseData.visaRule) throw new NotFoundException('Case or visa rule not found');

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

  async getCaseDocumentsAdmin(caseId: string) {
    return this.prisma.document.findMany({
      where: { caseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async reviewDocument(
    documentId: string,
    status: string,
    reviewerId: string,
    reason?: string,
  ) {
    const validStatuses = ['VERIFIED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status. Must be VERIFIED or REJECTED');
    }

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { case: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Lookup consultant profile if the reviewer is a consultant
    const consultant = await this.prisma.consultantProfile.findUnique({
      where: { userId: reviewerId },
    });

    const updatedDoc = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: status as 'VERIFIED' | 'REJECTED',
        reviewedById: consultant?.id || null,
        verifiedById: status === 'VERIFIED' ? consultant?.id || null : null,
        reviewStatus: status,
        reviewNotes: reason || null,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        case: true,
      },
    });

    this.eventsGateway.emitToUser(document.userId, 'document-reviewed', {
      documentId: document.id,
      status,
      reason,
    });

    const notificationMessage = status === 'VERIFIED'
      ? `Your document "${document.name}" has been verified successfully.`
      : `Your document "${document.name}" was rejected. Reason: ${reason || 'Please review requirements and resubmit.'}`;

    await this.notificationsService.createNotification(
      document.userId,
      status === 'VERIFIED' ? 'Document Verified' : 'Document Rejected',
      notificationMessage,
      { documentId: document.id, status, reason },
    );

    if (status === 'VERIFIED') {
      const caseDocs = await this.prisma.document.findMany({
        where: { caseId: document.caseId },
      });
      const allVerified = caseDocs.length > 0 && caseDocs.every(d => d.status === 'VERIFIED');
      
      if (allVerified) {
        await this.prisma.case.update({
          where: { id: document.caseId },
          data: { status: 'DOCUMENTS_VERIFIED' },
        });
      }
    } else if (status === 'REJECTED') {
      await this.prisma.case.update({
        where: { id: document.caseId },
        data: { status: 'DOCUMENTS_PENDING' },
      });
    }

    return updatedDoc;
  }

  async getAllDocumentsForReview(statusFilter?: string) {
    const where: any = {};
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }

    return this.prisma.document.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        case: {
          select: {
            id: true,
            status: true,
            destinationCountry: {
              select: {
                name: true,
              },
            },
            originCountry: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async getDocumentById(documentId: string) {
    return this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        case: {
          select: {
            id: true,
            status: true,
            destinationCountry: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { OcrService } from './ocr.service';
export declare class DocumentsService {
    private prisma;
    private storage;
    private eventsGateway;
    private notificationsService;
    private ocrService;
    constructor(prisma: PrismaService, storage: StorageService, eventsGateway: EventsGateway, notificationsService: NotificationsService, ocrService: OcrService);
    directUpload(userId: string, caseId: string, file: Express.Multer.File, type: string): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        type: string;
        expiryDate: Date | null;
        fileUrl: string;
        ocrText: string | null;
        uploadedAt: Date;
        caseId: string;
        verifiedById: string | null;
    }>;
    createUploadUrl(userId: string, caseId: string, name: string, type: string, contentType: string): Promise<{
        uploadUrl: string;
        key: string;
        method: string;
    }>;
    confirmUpload(userId: string, caseId: string, key: string, name: string, type: string): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        type: string;
        expiryDate: Date | null;
        fileUrl: string;
        ocrText: string | null;
        uploadedAt: Date;
        caseId: string;
        verifiedById: string | null;
    }>;
    getCaseDocuments(userId: string, caseId: string): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        type: string;
        expiryDate: Date | null;
        fileUrl: string;
        ocrText: string | null;
        uploadedAt: Date;
        caseId: string;
        verifiedById: string | null;
    }[]>;
    getChecklist(caseId: string, userId: string): Promise<{
        documentName: string;
        isProvided: boolean;
    }[]>;
}

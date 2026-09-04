import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
    directUpload(req: any, caseId: string, file: Express.Multer.File, type: string): Promise<{
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
}

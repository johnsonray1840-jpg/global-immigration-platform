"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("./storage.service");
const events_gateway_1 = require("../real-time/events.gateway");
const uuid = __importStar(require("uuid"));
const notifications_service_1 = require("../notifications/notifications.service");
const ocr_service_1 = require("./ocr.service");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let DocumentsService = class DocumentsService {
    prisma;
    storage;
    eventsGateway;
    notificationsService;
    ocrService;
    constructor(prisma, storage, eventsGateway, notificationsService, ocrService) {
        this.prisma = prisma;
        this.storage = storage;
        this.eventsGateway = eventsGateway;
        this.notificationsService = notificationsService;
        this.ocrService = ocrService;
    }
    async directUpload(userId, caseId, file, type) {
        const caseExists = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
        });
        if (!caseExists)
            throw new common_1.NotFoundException('Case not found');
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        let fileUrl;
        try {
            fileUrl = await this.storage.uploadLocal(file);
        }
        catch (storageError) {
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
        }
        catch (ocrError) {
            console.warn('OCR failed:', ocrError);
        }
        this.eventsGateway.emitToUser(userId, 'document-uploaded', doc);
        await this.notificationsService.createNotification(userId, 'Document Uploaded', `Your document "${file.originalname}" has been uploaded successfully.`, { documentId: doc.id });
        return doc;
    }
    async createUploadUrl(userId, caseId, name, type, contentType) {
        const caseExists = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
        });
        if (!caseExists)
            throw new common_1.NotFoundException('Case not found');
        const key = `${userId}/${caseId}/${uuid.v4()}-${name}`;
        const url = await this.storage.getPresignedUrl(key, contentType);
        return { uploadUrl: url, key, method: 'PUT' };
    }
    async confirmUpload(userId, caseId, key, name, type) {
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
        await this.notificationsService.createNotification(userId, 'Document Uploaded', `Your document "${name}" has been uploaded successfully.`, { documentId: doc.id });
        return updatedDoc;
    }
    async getCaseDocuments(userId, caseId) {
        return this.prisma.document.findMany({
            where: { caseId, userId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async getChecklist(caseId, userId) {
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
            include: { visaRule: true },
        });
        if (!caseData || !caseData.visaRule) {
            throw new common_1.NotFoundException('Case or visa rule not found');
        }
        const requiredDocs = caseData.visaRule.requiredDocs || [];
        const existingDocs = await this.prisma.document.findMany({
            where: { caseId },
        });
        const providedTypes = existingDocs.map((d) => d.type);
        return requiredDocs.map((docType) => ({
            documentName: docType,
            isProvided: providedTypes.includes(docType),
        }));
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        events_gateway_1.EventsGateway,
        notifications_service_1.NotificationsService,
        ocr_service_1.OcrService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map
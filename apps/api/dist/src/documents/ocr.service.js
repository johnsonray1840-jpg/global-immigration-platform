"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_service_1 = require("./storage.service");
const documentai_1 = require("@google-cloud/documentai");
let OcrService = class OcrService {
    configService;
    storageService;
    client = null;
    processorName;
    constructor(configService, storageService) {
        this.configService = configService;
        this.storageService = storageService;
        const projectId = this.configService.get('GOOGLE_PROJECT_ID');
        const location = this.configService.get('GOOGLE_DOCAI_LOCATION');
        const processorId = this.configService.get('GOOGLE_DOCAI_PROCESSOR_ID');
        if (projectId && location && processorId) {
            this.client = new documentai_1.DocumentProcessorServiceClient({
                projectId,
                apiEndpoint: `${location}-documentai.googleapis.com`,
            });
            this.processorName = `projects/${projectId}/locations/${location}/processors/${processorId}`;
            console.log('✅ Google Document AI configured');
        }
        else {
            console.warn('⚠️ Google Document AI not configured. OCR will use mock text.');
        }
    }
    async extractText(fileUrl) {
        if (!this.client || !this.processorName) {
            return { text: `OCR pending for ${fileUrl} (no Google Document AI configured)` };
        }
        try {
            const buffer = await this.storageService.downloadBuffer(fileUrl);
            const encoded = Buffer.from(buffer).toString('base64');
            const request = {
                name: this.processorName,
                rawDocument: {
                    content: encoded,
                    mimeType: 'application/pdf',
                },
            };
            const [result] = await this.client.processDocument(request);
            const document = result.document;
            const text = document?.text || '';
            let expiryDate;
            const expiryMatch = text.match(/(?:expiry|expiration|expires)[^\n]*?(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
            if (expiryMatch) {
                expiryDate = new Date(expiryMatch[1]);
            }
            return { text, expiryDate };
        }
        catch (error) {
            console.error('OCR processing failed:', error);
            return { text: `OCR failed: ${error.message}` };
        }
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        storage_service_1.StorageService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
export declare class OcrService {
    private configService;
    private storageService;
    private client;
    private processorName;
    constructor(configService: ConfigService, storageService: StorageService);
    extractText(fileUrl: string): Promise<{
        text: string;
        expiryDate?: Date;
    }>;
}

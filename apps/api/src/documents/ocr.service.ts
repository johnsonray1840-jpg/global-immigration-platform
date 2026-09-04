import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

@Injectable()
export class OcrService {
  private client: DocumentProcessorServiceClient | null = null;
  private processorName: string;

  constructor(
    private configService: ConfigService,
    private storageService: StorageService,
  ) {
    const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
    const location = this.configService.get<string>('GOOGLE_DOCAI_LOCATION');
    const processorId = this.configService.get<string>('GOOGLE_DOCAI_PROCESSOR_ID');

    if (projectId && location && processorId) {
      this.client = new DocumentProcessorServiceClient({
        projectId,
        apiEndpoint: `${location}-documentai.googleapis.com`,
      });
      this.processorName = `projects/${projectId}/locations/${location}/processors/${processorId}`;
      console.log('✅ Google Document AI configured');
    } else {
      console.warn('⚠️ Google Document AI not configured. OCR will use mock text.');
    }
  }

  async extractText(fileUrl: string): Promise<{ text: string; expiryDate?: Date }> {
    if (!this.client || !this.processorName) {
      // Fallback: return mock text for development
      return { text: `OCR pending for ${fileUrl} (no Google Document AI configured)` };
    }

    try {
      // Download file from MinIO/S3
      const buffer = await this.storageService.downloadBuffer(fileUrl);

      // Encode to base64
      const encoded = Buffer.from(buffer).toString('base64');

      const request = {
        name: this.processorName,
        rawDocument: {
          content: encoded,
          mimeType: 'application/pdf', // adjust based on file type
        },
      };

      const [result] = await this.client.processDocument(request);
      const document = result.document;
      const text = document?.text || '';

      // Attempt to extract expiry date from text (basic regex)
      let expiryDate: Date | undefined;
      const expiryMatch = text.match(/(?:expiry|expiration|expires)[^\n]*?(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
      if (expiryMatch) {
        expiryDate = new Date(expiryMatch[1]);
      }

      return { text, expiryDate };
    } catch (error) {
      console.error('OCR processing failed:', error);
      return { text: `OCR failed: ${error.message}` };
    }
  }
}
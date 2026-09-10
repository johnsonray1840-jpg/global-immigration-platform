import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, R2_BUCKET_NAME } from '../config/s3.config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  private bucket = R2_BUCKET_NAME;
  private useR2 = !!process.env.R2_ACCOUNT_ID;

  async getPresignedUrl(key: string, contentType: string) {
    if (!this.useR2) {
      // Local fallback
      return `http://localhost:3001/uploads/${key}`;
    }
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType: string) {
    if (!this.useR2) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, path.basename(key));
      await fs.writeFile(filePath, buffer);
      return `/uploads/${path.basename(key)}`;
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${this.bucket}/${key}`;
  }

  async downloadBuffer(key: string): Promise<Buffer> {
    if (!this.useR2) {
      const filePath = path.join(process.cwd(), 'uploads', path.basename(key));
      return fs.readFile(filePath);
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const response = await s3Client.send(command);
    const stream = response.Body as any;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async uploadLocal(file: Express.Multer.File): Promise<string> {
    if (this.useR2) {
      const key = `uploads/${Date.now()}-${file.originalname}`;
      return this.uploadBuffer(key, file.buffer, file.mimetype);
    }

    // Local fallback
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);
    return `/uploads/${fileName}`;
  }

  async deleteFile(key: string) {
    if (!this.useR2) return;
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
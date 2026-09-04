import { Injectable } from '@nestjs/common';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/s3.config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  private bucket = process.env.S3_BUCKET_NAME || 'immigration-docs';

  async getPresignedUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType: string) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return `${s3Client.config.endpoint}/${this.bucket}/${key}`;
  }

  async downloadBuffer(key: string): Promise<Buffer> {
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
    // Save file to local uploads folder
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);
    return `/uploads/${fileName}`;
  }
}
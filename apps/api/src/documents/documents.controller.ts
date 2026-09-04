import { Controller, Get, Post, Param, Body, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import type { Express } from 'express';

@Controller('cases/:caseId/documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  // Existing upload-url, confirm, get, checklist endpoints...

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  async directUpload(
    @Req() req,
    @Param('caseId') caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    return this.documentsService.directUpload(req.user.id, caseId, file, type);
  }
}
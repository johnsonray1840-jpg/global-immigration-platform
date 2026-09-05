import { Controller, Get, Post, Param, Body, UseGuards, Req, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'COMPLIANCE', 'DOCUMENT_VERIFIER')
  @Get()
  async getAllDocumentsForCase(@Param('caseId') caseId: string) {
    return this.documentsService.getCaseDocumentsAdmin(caseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'COMPLIANCE', 'DOCUMENT_VERIFIER')
  @Patch(':id/review')
  async reviewDocument(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
    @Req() req,
  ) {
    return this.documentsService.reviewDocument(
      id,
      body.status,
      req.user.id,
      body.reason,
    );
  }
}
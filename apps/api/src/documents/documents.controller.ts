import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentsService } from './documents.service';
import type { Express } from 'express';

@Controller('cases/:caseId/documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  // Presigned upload URL (existing)
  @UseGuards(JwtAuthGuard)
  @Post('upload-url')
  async getUploadUrl(
    @Req() req,
    @Param('caseId') caseId: string,
    @Body() body: { name: string; type: string; contentType: string },
  ) {
    return this.documentsService.createUploadUrl(
      req.user.id,
      caseId,
      body.name,
      body.type,
      body.contentType,
    );
  }

  // Confirm presigned upload (existing)
  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirmUpload(
    @Req() req,
    @Param('caseId') caseId: string,
    @Body() body: { key: string; name: string; type: string },
  ) {
    return this.documentsService.confirmUpload(
      req.user.id,
      caseId,
      body.key,
      body.name,
      body.type,
    );
  }

  // Direct upload fallback (existing)
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

  // Get documents for a case (client – own case only, admin – all)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getDocuments(@Req() req, @Param('caseId') caseId: string) {
    return this.documentsService.getCaseDocuments(req.user.id, caseId);
  }

  // Get document checklist for a case (client – own case only, admin – all)
  @UseGuards(JwtAuthGuard)
  @Get('checklist')
  async getChecklist(@Req() req, @Param('caseId') caseId: string) {
    return this.documentsService.getChecklist(caseId, req.user.id);
  }

  // Admin/Consultant: review a document (approve/reject)
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

  // Admin: get all documents for a case (explicit admin endpoint)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'COMPLIANCE', 'DOCUMENT_VERIFIER')
  @Get('admin')
  async getAllDocumentsForCase(@Param('caseId') caseId: string) {
    return this.documentsService.getCaseDocumentsAdmin(caseId);
  }
}
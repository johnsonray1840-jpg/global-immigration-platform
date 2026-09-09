import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentsService } from '../documents/documents.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'COMPLIANCE', 'DOCUMENT_VERIFIER')
export class AdminDocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('admin/documents/pending-review')
  async getPendingReviewDocuments() {
    return this.documentsService.getAllDocumentsForReview('PENDING_REVIEW');
  }

  @Get('admin/documents')
  async getAllDocuments(@Query('status') status?: string) {
    return this.documentsService.getAllDocumentsForReview(status);
  }

  @Get('documents/:id')
  async getDocument(@Param('id') id: string) {
    return this.documentsService.getDocumentById(id);
  }

  @Patch('documents/:id/review')
  async reviewDocumentDirect(
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

  @Patch('admin/documents/:id/review')
  async reviewDocumentAdmin(
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


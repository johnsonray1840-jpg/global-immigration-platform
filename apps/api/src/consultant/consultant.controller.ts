import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ConsultantService } from './consultant.service';

@Controller('consultant')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CONSULTANT')
export class ConsultantController {
  constructor(private consultantService: ConsultantService) {}

  @Get('stats')
  getStats(@Req() req) {
    return this.consultantService.getStats(req.user.id);
  }

  @Get('cases')
  getAssignedCases(@Req() req) {
    return this.consultantService.getAssignedCases(req.user.id);
  }

  @Get('cases/:id')
  getCaseDetails(@Req() req, @Param('id') id: string) {
    return this.consultantService.getCaseDetails(req.user.id, id);
  }

  @Patch('cases/:id/status')
  updateStatus(@Req() req, @Param('id') id: string, @Body() body: { status: string }) {
    return this.consultantService.updateCaseStatus(req.user.id, id, body.status);
  }

  @Patch('cases/:id/notes')
  updateNotes(@Req() req, @Param('id') id: string, @Body() body: { notes: string }) {
    return this.consultantService.updateCaseNotes(req.user.id, id, body.notes);
  }

  @Get('cases/:id/documents')
  getDocuments(@Req() req, @Param('id') id: string) {
    return this.consultantService.getCaseDocuments(req.user.id, id);
  }

  @Patch('documents/:id/verify')
  verifyDocument(@Req() req, @Param('id') id: string, @Body() body: { verified: boolean }) {
    return this.consultantService.verifyDocument(req.user.id, id, body.verified);
  }

  @Patch('documents/:id/review')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CONSULTANT')   // <-- updated roles
  async reviewDocument(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
    @Req() req,
  ) {
    return this.consultantService.reviewDocument(req.user.id, id, body.status, body.notes);
  }

}
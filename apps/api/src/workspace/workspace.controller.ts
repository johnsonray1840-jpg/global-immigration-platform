import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WorkspaceService } from './workspace.service';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  // Client: get workspace for a case
  @UseGuards(JwtAuthGuard)
  @Get('case/:caseId')
  getCaseWorkspace(@Req() req, @Param('caseId') caseId: string) {
    return this.workspaceService.getCaseWorkspace(req.user.id, caseId);
  }

  // Client: save workspace data
  @UseGuards(JwtAuthGuard)
  @Post('case/:caseId')
  saveWorkspace(@Req() req, @Param('caseId') caseId: string, @Body() body: any) {
    return this.workspaceService.saveWorkspace(req.user.id, caseId, body.formData);
  }

  // Consultant: list all submitted workspaces for their cases
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONSULTANT')
  @Get('consultant/submissions')
  getConsultantSubmissions(@Req() req) {
    return this.workspaceService.getAllForConsultant(req.user.id);
  }

  // Consultant: mark reviewed
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONSULTANT')
  @Patch('case/:caseId/review')
  reviewWorkspace(@Req() req, @Param('caseId') caseId: string, @Body() body: { reviewed: boolean }) {
    return this.workspaceService.reviewWorkspace(req.user.id, caseId, body.reviewed);
  }

  // Client: export workspace data as JSON
  @UseGuards(JwtAuthGuard)
@Get('case/:caseId/export')
async exportWorkspace(@Req() req, @Param('caseId') caseId: string, @Res() res: Response) {
  const workspace = await this.workspaceService.getCaseWorkspace(req.user.id, caseId);
  if (!workspace.data) {
    return res.status(404).json({ message: 'No workspace data found' });
  }
  const json = JSON.stringify(workspace.data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="workspace-${caseId}.json"`);
  res.send(json);
}
}

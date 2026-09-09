import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CasesService } from '../cases/cases.service';

@Controller('admin/cases')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'COMPLIANCE', 'DOCUMENT_VERIFIER')
export class AdminCasesController {
  constructor(private casesService: CasesService) {}

  @Get()
  async getAllCases() {
    return this.casesService.findAllAdmin();
  }

  @Get(':id')
  async getCase(@Param('id') id: string) {
    return this.casesService.findOneAdmin(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
    @Req() req,
  ) {
    return this.casesService.updateStatusAdmin(
      id,
      body.status,
      req.user.id,
      body.notes,
    );
  }
}


import { Controller, Get, Param, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaymentsService } from '../payments/payments.service';

@Controller('admin/approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
export class AdminApprovalsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  async getAll() {
    return this.paymentsService.getAllApprovals();
  }

  @Patch(':id/review')
  async review(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
    @Req() req,
  ) {
    return this.paymentsService.reviewApproval(id, body.status, req.user.id, body.reason);
  }
}
import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/payment-methods')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
export class AdminPaymentMethodsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    return this.prisma.paymentMethod.findMany();
  }

  @Patch(':id')
  async toggle(
    @Param('id') id: string,
    @Body() body: { isActive?: boolean; suspensionMessage?: string },
  ) {
    return this.prisma.paymentMethod.update({
      where: { id },
      data: body,
    });
  }
}
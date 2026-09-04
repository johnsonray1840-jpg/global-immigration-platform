import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/wire-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'FINANCE')
export class AdminWireAccountsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.wireBankAccount.findMany({ include: { country: true } });
  }

  @Post()
  async create(@Body() body: any) {
    return this.prisma.wireBankAccount.create({ data: body });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.wireBankAccount.update({ where: { id }, data: body });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.wireBankAccount.delete({ where: { id } });
  }

  // Assign a wire account to a specific user
  @Post('assign-user')
  async assignToUser(@Body() body: { userId: string; wireAccountId: string }) {
    return this.prisma.userWireAccount.upsert({
      where: { userId: body.userId },
      create: { userId: body.userId, wireAccountId: body.wireAccountId },
      update: { wireAccountId: body.wireAccountId },
    });
  }
}
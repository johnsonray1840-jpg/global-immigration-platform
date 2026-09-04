import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';


@Controller('admin/crud')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN') // restrict to high-level admins
export class AdminCrudController {
  private allowedModels = [
    'user',
    'userProfile',
    'consultantProfile',
    'country',
    'visaType',
    'countryVisaRule',
    'case',
    'document',
    'checklistItem',
    'workspaceData',
    'roadmap',
    'appointment',
    'office',
    'invoice',
    'payment',
    'servicePackage',
    'scholarship',
    'university',
    'faq',
    'news',
    'page',
    'media',
    'partner',
    'testimonial',
    'successStory',
    'message',
    'notification',
    'referral',
    'auditLog',
    'aiDocument',
    'paymentMethod',
    'wireBankAccount',
    'userWireAccount',
    'cryptoPaymentSession',
    'wallet',
    'walletTransaction',
    'paymentApproval',
    'emailLog',
    'promotion',
    'program',
    'cryptoWallet',
    'subscriber',
  ];

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,

  ) {}

  private getModel(model: string) {
    if (!this.allowedModels.includes(model)) {
      throw new BadRequestException('Invalid model');
    }
    // Prisma client dynamic access
    return (this.prisma as any)[model];
  }

  @Get(':model')
  async findAll(
    @Param('model') model: string,
    @Query('skip') skip = '0',
    @Query('take') take = '50',
    @Query('orderBy') orderBy?: string,
    @Query('where') where?: string, // JSON string
  ) {
    const prismaModel = this.getModel(model);
    const args: any = {
      skip: Number(skip),
      take: Math.min(Number(take), 200),
    };
    if (orderBy) {
      args.orderBy = JSON.parse(orderBy);
    }
    if (where) {
      args.where = JSON.parse(where);
    }
    return prismaModel.findMany(args);
  }

  @Get(':model/:id')
  async findOne(@Param('model') model: string, @Param('id') id: string) {
    const prismaModel = this.getModel(model);
    return prismaModel.findUnique({ where: { id } });
  }

  @Post(':model')
  async create(
    @Param('model') model: string,
    @Body() data: any,
    @Req() req,
  ) {
    const prismaModel = this.getModel(model);
    const result = await prismaModel.create({ data });
    await this.logAudit(req.user.id, 'CREATE', model, result.id, null, result);
    return result;
  }

  @Patch(':model/:id')
  async update(
    @Param('model') model: string,
    @Param('id') id: string,
    @Body() data: any,
    @Req() req,
  ) {
    const prismaModel = this.getModel(model);
    const old = await prismaModel.findUnique({ where: { id } });
    if (!old) throw new BadRequestException('Record not found');
    const updated = await prismaModel.update({ where: { id }, data });
    await this.logAudit(req.user.id, 'UPDATE', model, id, old, updated);
    return updated;
  }

  @Delete(':model/:id')
  async remove(
    @Param('model') model: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    const prismaModel = this.getModel(model);
    const old = await prismaModel.findUnique({ where: { id } });
    if (!old) throw new BadRequestException('Record not found');
    const result = await prismaModel.delete({ where: { id } });
    await this.logAudit(req.user.id, 'DELETE', model, id, old, null);
    return result;
  }

  private async logAudit(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    oldValue: any,
    newValue: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldValue: oldValue || undefined,
        newValue: newValue || undefined,
      },
    });
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SendCustomEmailDto } from './dto/send-custom-email.dto';

@Controller('admin/emails')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'COMPLIANCE')
export class AdminEmailsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Send a branded custom email to any specific user or custom recipient email address.
   */
  @Post('send')
  async sendCustomEmail(@Body() dto: SendCustomEmailDto, @Req() req: any) {
    if (!dto.recipientEmail || !dto.subject || !dto.message) {
      throw new BadRequestException('Recipient email, subject, and message are required.');
    }

    const adminUser = req.user;

    // Check if recipient is an existing user in the database
    const recipientUser = await this.prisma.user.findUnique({
      where: { email: dto.recipientEmail.trim().toLowerCase() },
      include: { profile: true },
    });

    const recipientName =
      dto.recipientName ||
      (recipientUser?.profile
        ? `${recipientUser.profile.firstName || ''} ${recipientUser.profile.lastName || ''}`.trim()
        : undefined);

    // Send email via MailService with executive template & logo
    const emailResult = await this.mailService.sendCustomEmail({
      to: dto.recipientEmail.trim(),
      subject: dto.subject.trim(),
      title: dto.title?.trim() || dto.subject.trim(),
      body: dto.message,
      recipientName,
      ctaText: dto.ctaText?.trim(),
      ctaLink: dto.ctaLink?.trim(),
      badge: dto.badge?.trim() || 'Official Notice',
    });

    if (!emailResult.success && emailResult.error) {
      throw new BadRequestException(`Email delivery failed: ${emailResult.error}`);
    }

    // Record in AuditLog
    await this.prisma.auditLog.create({
      data: {
        userId: adminUser?.id,
        action: 'ADMIN_SENT_CUSTOM_EMAIL',
        entity: 'EmailCommunication',
        entityId: recipientUser?.id || null,
        newValue: {
          recipientEmail: dto.recipientEmail.trim(),
          recipientName: recipientName || 'Client',
          subject: dto.subject.trim(),
          title: dto.title?.trim() || dto.subject.trim(),
          messageSnippet: dto.message.substring(0, 150),
          badge: dto.badge || 'Official Notice',
          ctaText: dto.ctaText || null,
          ctaLink: dto.ctaLink || null,
          sentByAdminId: adminUser?.id,
          sentByAdminEmail: adminUser?.email,
          resendMessageId: emailResult.id || null,
          sentAt: new Date(),
        },
      },
    });

    // If user exists in DB, also record an in-app notification
    if (recipientUser) {
      try {
        await this.prisma.notification.create({
          data: {
            userId: recipientUser.id,
            title: dto.subject.trim(),
            body: dto.message.replace(/<[^>]*>/g, '').substring(0, 200),
          },
        });
      } catch (err) {
        // notification creation failure should not break email dispatch response
      }
    }

    return {
      success: true,
      message: `Email successfully sent to ${dto.recipientEmail}`,
      details: {
        recipient: dto.recipientEmail,
        subject: dto.subject,
        messageId: emailResult.id,
      },
    };
  }

  /**
   * Get history of recently dispatched custom emails from the admin console.
   */
  @Get('history')
  async getEmailHistory(@Query('limit') limit = '50') {
    const take = Math.min(parseInt(limit, 10) || 50, 100);

    const logs = await this.prisma.auditLog.findMany({
      where: {
        action: 'ADMIN_SENT_CUSTOM_EMAIL',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      sentAt: log.createdAt,
      sentBy: log.user?.email || 'Admin',
      details: log.newValue,
    }));
  }

  /**
   * Quick recipient lookup list to easily search registered clients.
   */
  @Get('recipients')
  async getQuickRecipients(@Query('q') q = '') {
    const search = q.trim().toLowerCase();

    const users = await this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              {
                profile: {
                  OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                  ],
                },
              },
            ],
          }
        : undefined,
      take: 25,
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      fullName: u.profile ? `${u.profile.firstName || ''} ${u.profile.lastName || ''}`.trim() : '',
    }));
  }
}

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsScheduler {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendReminders() {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcoming = await this.prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: in24Hours,
        },
        status: 'SCHEDULED',
        reminderSent: false,
      },
      include: { user: true },
    });

    for (const appt of upcoming) {
      if (appt.user) {
        await this.mailService.sendAppointmentReminder(appt.user.email, appt);
        await this.prisma.appointment.update({
          where: { id: appt.id },
          data: { reminderSent: true },
        });
      }
    }
  }
}

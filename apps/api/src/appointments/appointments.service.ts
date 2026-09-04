import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CalendarService } from './calendar.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private notificationsService: NotificationsService,
    private calendarService: CalendarService,
  ) {}

  async getAvailableSlots(consultantId: string, date: string) {
    return this.calendarService.getAvailableSlots(consultantId, date);
  }

  async create(userId: string, dto: CreateAppointmentDto) {
    const consultant = await this.prisma.consultantProfile.findUnique({
      where: { id: dto.consultantId },
      include: { user: true },
    });
    if (!consultant) throw new NotFoundException('Consultant not found');

    if (dto.caseId) {
      const caseExists = await this.prisma.case.findFirst({
        where: { id: dto.caseId, userId },
      });
      if (!caseExists) throw new NotFoundException('Case not found');
    }

    // Check if slot is available
    const slotStart = new Date(dto.scheduledAt);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + (dto.durationMin || 60) / 60);

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        consultantId: dto.consultantId,
        scheduledAt: { gte: slotStart, lt: slotEnd },
        status: { not: 'CANCELLED' },
      },
    });
    if (conflict) throw new BadRequestException('This time slot is no longer available');

    const appointment = await this.prisma.appointment.create({
      data: {
        userId,
        consultantId: dto.consultantId,
        caseId: dto.caseId,
        type: dto.type,
        scheduledAt: new Date(dto.scheduledAt),
        durationMin: dto.durationMin || 60,
        meetingLink: null, // no Zoom; clients call office number
        notes: dto.notes,
        status: 'SCHEDULED',
      },
    });

    // Send confirmation email
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) await this.mailService.sendAppointmentConfirmation(user.email, appointment);

    // Create notification
    await this.notificationsService.createNotification(
      userId,
      'Appointment Booked',
      'Your consultation appointment has been scheduled.',
      { appointmentId: appointment.id },
    );

    // Optionally create Google Calendar event (mock)
    const calendarEvent = await this.calendarService.createGoogleCalendarEvent(appointment);
    // Could store meetingLink if needed, but we won't use it

    return appointment;
  }

  async findAllForUser(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      include: { consultant: { include: { user: true } }, case: true },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(userId: string, appointmentId: string) {
    const appt = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, userId },
      include: { consultant: { include: { user: true } }, case: true },
    });
    if (!appt) throw new NotFoundException('Appointment not found');
    return appt;
  }

  async cancel(userId: string, appointmentId: string) {
    const appt = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, userId },
    });
    if (!appt) throw new NotFoundException('Appointment not found');
    if (appt.status === 'CANCELLED') throw new BadRequestException('Already cancelled');

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) await this.mailService.sendAppointmentCancellation(user.email, updated);

    await this.notificationsService.createNotification(
      userId,
      'Appointment Cancelled',
      'Your appointment has been cancelled.',
      { appointmentId: updated.id },
    );

    return updated;
  }
}
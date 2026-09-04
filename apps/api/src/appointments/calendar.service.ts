import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(consultantId: string, date: string) {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    // Business hours: 9am - 5pm, 1-hour slots
    const slots: { start: string; end: string }[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(startOfDay);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if any appointment overlaps
      const existing = await this.prisma.appointment.findFirst({
        where: {
          consultantId,
          scheduledAt: {
            gte: slotStart,
            lt: slotEnd,
          },
          status: { not: 'CANCELLED' },
        },
      });

      if (!existing) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
    }

    return slots;
  }

  // This method would be replaced with real Google Calendar API integration
  async createGoogleCalendarEvent(appointment: any) {
    // TODO: Implement Google Calendar API event creation
    // For now, return a mock event link
    return {
      googleEventId: `mock-event-${appointment.id}`,
      htmlLink: `https://calendar.google.com/event?action=TEMPLATE&tmeid=${appointment.id}`,
    };
  }
}

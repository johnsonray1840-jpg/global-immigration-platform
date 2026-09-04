import { PrismaService } from '../prisma/prisma.service';
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableSlots(consultantId: string, date: string): Promise<{
        start: string;
        end: string;
    }[]>;
    createGoogleCalendarEvent(appointment: any): Promise<{
        googleEventId: string;
        htmlLink: string;
    }>;
}

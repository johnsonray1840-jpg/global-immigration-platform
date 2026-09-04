import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class AppointmentsScheduler {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    sendReminders(): Promise<void>;
}

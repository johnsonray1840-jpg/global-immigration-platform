"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
const calendar_service_1 = require("./calendar.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    mailService;
    notificationsService;
    calendarService;
    constructor(prisma, mailService, notificationsService, calendarService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.notificationsService = notificationsService;
        this.calendarService = calendarService;
    }
    async getAvailableSlots(consultantId, date) {
        return this.calendarService.getAvailableSlots(consultantId, date);
    }
    async create(userId, dto) {
        const consultant = await this.prisma.consultantProfile.findUnique({
            where: { id: dto.consultantId },
            include: { user: true },
        });
        if (!consultant)
            throw new common_1.NotFoundException('Consultant not found');
        if (dto.caseId) {
            const caseExists = await this.prisma.case.findFirst({
                where: { id: dto.caseId, userId },
            });
            if (!caseExists)
                throw new common_1.NotFoundException('Case not found');
        }
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
        if (conflict)
            throw new common_1.BadRequestException('This time slot is no longer available');
        const appointment = await this.prisma.appointment.create({
            data: {
                userId,
                consultantId: dto.consultantId,
                caseId: dto.caseId,
                type: dto.type,
                scheduledAt: new Date(dto.scheduledAt),
                durationMin: dto.durationMin || 60,
                meetingLink: null,
                notes: dto.notes,
                status: 'SCHEDULED',
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user)
            await this.mailService.sendAppointmentConfirmation(user.email, appointment);
        await this.notificationsService.createNotification(userId, 'Appointment Booked', 'Your consultation appointment has been scheduled.', { appointmentId: appointment.id });
        const calendarEvent = await this.calendarService.createGoogleCalendarEvent(appointment);
        return appointment;
    }
    async findAllForUser(userId) {
        return this.prisma.appointment.findMany({
            where: { userId },
            include: { consultant: { include: { user: true } }, case: true },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async findOne(userId, appointmentId) {
        const appt = await this.prisma.appointment.findFirst({
            where: { id: appointmentId, userId },
            include: { consultant: { include: { user: true } }, case: true },
        });
        if (!appt)
            throw new common_1.NotFoundException('Appointment not found');
        return appt;
    }
    async cancel(userId, appointmentId) {
        const appt = await this.prisma.appointment.findFirst({
            where: { id: appointmentId, userId },
        });
        if (!appt)
            throw new common_1.NotFoundException('Appointment not found');
        if (appt.status === 'CANCELLED')
            throw new common_1.BadRequestException('Already cancelled');
        const updated = await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user)
            await this.mailService.sendAppointmentCancellation(user.email, updated);
        await this.notificationsService.createNotification(userId, 'Appointment Cancelled', 'Your appointment has been cancelled.', { appointmentId: updated.id });
        return updated;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService,
        calendar_service_1.CalendarService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map
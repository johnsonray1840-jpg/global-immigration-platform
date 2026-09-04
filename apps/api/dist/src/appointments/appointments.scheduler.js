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
exports.AppointmentsScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let AppointmentsScheduler = class AppointmentsScheduler {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
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
};
exports.AppointmentsScheduler = AppointmentsScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentsScheduler.prototype, "sendReminders", null);
exports.AppointmentsScheduler = AppointmentsScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AppointmentsScheduler);
//# sourceMappingURL=appointments.scheduler.js.map
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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CalendarService = class CalendarService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableSlots(consultantId, date) {
        const startOfDay = new Date(`${date}T00:00:00`);
        const endOfDay = new Date(`${date}T23:59:59`);
        const slots = [];
        const startHour = 9;
        const endHour = 17;
        for (let hour = startHour; hour < endHour; hour++) {
            const slotStart = new Date(startOfDay);
            slotStart.setHours(hour, 0, 0, 0);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(hour + 1, 0, 0, 0);
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
    async createGoogleCalendarEvent(appointment) {
        return {
            googleEventId: `mock-event-${appointment.id}`,
            htmlLink: `https://calendar.google.com/event?action=TEMPLATE&tmeid=${appointment.id}`,
        };
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map
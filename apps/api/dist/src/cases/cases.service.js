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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../real-time/events.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
let CasesService = class CasesService {
    prisma;
    eventsGateway;
    notificationsService;
    constructor(prisma, eventsGateway, notificationsService) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
        this.notificationsService = notificationsService;
    }
    async create(userId, dto) {
        const result = await this.prisma.case.create({
            data: {
                userId,
                originCountryId: dto.originCountryId,
                destinationCountryId: dto.destinationCountryId,
                visaRuleId: dto.visaRuleId,
                eligibilityLabel: dto.eligibilityLabel,
            },
        });
        this.eventsGateway.emitToUser(userId, 'case-created', result);
        await this.notificationsService.createNotification(userId, 'Case Created', 'Your immigration case has been created successfully.', { caseId: result.id });
        return result;
    }
    async updateStatus(userId, caseId, status) {
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
        });
        if (!caseData)
            throw new common_1.NotFoundException('Case not found');
        const updated = await this.prisma.case.update({
            where: { id: caseId },
            data: {
                status: status,
                timeline: [
                    ...(caseData.timeline || []),
                    { event: status, date: new Date().toISOString() },
                ],
            },
        });
        this.eventsGateway.emitToUser(userId, 'case-updated', updated);
        await this.notificationsService.createNotification(userId, 'Case Updated', `Your case status is now ${status.replace(/_/g, ' ')}.`, { caseId });
        return updated;
    }
    async findAllForUser(userId) {
        return this.prisma.case.findMany({
            where: { userId },
            include: {
                originCountry: true,
                destinationCountry: true,
                visaRule: { include: { visaType: true } },
                documents: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, caseId) {
        const c = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
            include: {
                originCountry: true,
                destinationCountry: true,
                visaRule: { include: { visaType: true } },
                documents: true,
                checklistItems: true,
            },
        });
        if (!c)
            throw new common_1.NotFoundException('Case not found');
        return c;
    }
    async getTimeline(userId, caseId) {
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
            select: { timeline: true },
        });
        return caseData?.timeline || [];
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway,
        notifications_service_1.NotificationsService])
], CasesService);
//# sourceMappingURL=cases.service.js.map
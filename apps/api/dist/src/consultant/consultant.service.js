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
exports.ConsultantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ConsultantService = class ConsultantService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getConsultantProfileId(userId) {
        const profile = await this.prisma.consultantProfile.findUnique({
            where: { userId },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Consultant profile not found');
        return profile.id;
    }
    async getStats(userId) {
        const consultantId = await this.getConsultantProfileId(userId);
        const [assignedCases, pendingDocuments, upcomingAppointments] = await Promise.all([
            this.prisma.case.count({ where: { consultantId } }),
            this.prisma.document.count({
                where: {
                    status: 'UPLOADED',
                    case: { consultantId },
                },
            }),
            this.prisma.appointment.count({
                where: {
                    consultantId,
                    scheduledAt: { gte: new Date() },
                    status: 'SCHEDULED',
                },
            }),
        ]);
        return { assignedCases, pendingDocuments, upcomingAppointments };
    }
    async getAssignedCases(userId) {
        const consultantId = await this.getConsultantProfileId(userId);
        return this.prisma.case.findMany({
            where: { consultantId },
            include: {
                user: { select: { email: true, profile: true } },
                originCountry: true,
                destinationCountry: true,
                visaRule: { include: { visaType: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getCaseDetails(userId, caseId) {
        const consultantId = await this.getConsultantProfileId(userId);
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, consultantId },
            include: {
                user: { select: { email: true, profile: true } },
                originCountry: true,
                destinationCountry: true,
                visaRule: { include: { visaType: true } },
                documents: true,
            },
        });
        if (!caseData)
            throw new common_1.NotFoundException('Case not found or not assigned to you');
        return caseData;
    }
    async updateCaseStatus(userId, caseId, status) {
        const consultantId = await this.getConsultantProfileId(userId);
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, consultantId },
        });
        if (!caseData)
            throw new common_1.NotFoundException('Case not found or not assigned to you');
        return this.prisma.case.update({
            where: { id: caseId },
            data: { status: status },
        });
    }
    async updateCaseNotes(userId, caseId, notes) {
        const consultantId = await this.getConsultantProfileId(userId);
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, consultantId },
        });
        if (!caseData)
            throw new common_1.NotFoundException('Case not found or not assigned to you');
        return this.prisma.case.update({
            where: { id: caseId },
            data: { notes },
        });
    }
    async getCaseDocuments(userId, caseId) {
        const consultantId = await this.getConsultantProfileId(userId);
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, consultantId },
        });
        if (!caseData)
            throw new common_1.NotFoundException('Case not found or not assigned to you');
        return this.prisma.document.findMany({
            where: { caseId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async verifyDocument(userId, documentId, verified) {
        const consultantId = await this.getConsultantProfileId(userId);
        const doc = await this.prisma.document.findFirst({
            where: { id: documentId, case: { consultantId } },
            include: { case: { select: { userId: true } } },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found or not under your cases');
        const updated = await this.prisma.document.update({
            where: { id: documentId },
            data: {
                status: verified ? 'VERIFIED' : 'REJECTED',
                verifiedById: consultantId,
            },
        });
        if (doc.case?.userId) {
            await this.notificationsService.createNotification(doc.case.userId, 'Document Reviewed', `Your document "${doc.name}" was ${verified ? 'verified' : 'rejected'} by your consultant.`, { documentId });
        }
        return updated;
    }
};
exports.ConsultantService = ConsultantService;
exports.ConsultantService = ConsultantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ConsultantService);
//# sourceMappingURL=consultant.service.js.map
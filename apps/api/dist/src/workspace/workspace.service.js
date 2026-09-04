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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkspaceService = class WorkspaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCaseWorkspace(userId, caseId) {
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
            include: { visaRule: true, workspaceData: true },
        });
        if (!caseData)
            throw new common_1.NotFoundException('Case not found or not owned by user');
        return {
            caseId,
            schema: caseData.visaRule?.workspaceSchema || null,
            data: caseData.workspaceData?.formData || null,
            reviewed: caseData.workspaceData?.reviewed || false,
        };
    }
    async saveWorkspace(userId, caseId, formData) {
        const caseData = await this.prisma.case.findFirst({
            where: { id: caseId, userId },
        });
        if (!caseData)
            throw new common_1.ForbiddenException('Not your case');
        const workspace = await this.prisma.workspaceData.upsert({
            where: { caseId },
            create: { caseId, formData, reviewed: false },
            update: { formData, reviewed: false },
        });
        return workspace;
    }
    async getAllForConsultant(consultantUserId) {
        const consultant = await this.prisma.consultantProfile.findUnique({
            where: { userId: consultantUserId },
        });
        if (!consultant)
            throw new common_1.ForbiddenException('Not a consultant');
        const cases = await this.prisma.case.findMany({
            where: { consultantId: consultant.id },
            include: {
                user: { select: { email: true, profile: true } },
                destinationCountry: true,
                workspaceData: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        return cases.filter((c) => c.workspaceData);
    }
    async reviewWorkspace(consultantUserId, caseId, reviewed) {
        const consultant = await this.prisma.consultantProfile.findUnique({
            where: { userId: consultantUserId },
        });
        if (!consultant)
            throw new common_1.ForbiddenException('Not a consultant');
        const workspace = await this.prisma.workspaceData.findUnique({
            where: { caseId },
        });
        if (!workspace)
            throw new common_1.NotFoundException('Workspace not found');
        return this.prisma.workspaceData.update({
            where: { caseId },
            data: { reviewed },
        });
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map
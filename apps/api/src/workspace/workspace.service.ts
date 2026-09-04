import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async getCaseWorkspace(userId: string, caseId: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
      include: { visaRule: true, workspaceData: true },
    });
    if (!caseData) throw new NotFoundException('Case not found or not owned by user');

    return {
      caseId,
      schema: caseData.visaRule?.workspaceSchema || null,
      data: caseData.workspaceData?.formData || null,
      reviewed: caseData.workspaceData?.reviewed || false,
    };
  }

  async saveWorkspace(userId: string, caseId: string, formData: any) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
    });
    if (!caseData) throw new ForbiddenException('Not your case');

    const workspace = await this.prisma.workspaceData.upsert({
      where: { caseId },
      create: { caseId, formData, reviewed: false },
      update: { formData, reviewed: false },
    });

    return workspace;
  }

  async getAllForConsultant(consultantUserId: string) {
    // Get consultant profile
    const consultant = await this.prisma.consultantProfile.findUnique({
      where: { userId: consultantUserId },
    });
    if (!consultant) throw new ForbiddenException('Not a consultant');

    const cases = await this.prisma.case.findMany({
      where: { consultantId: consultant.id },
      include: {
        user: { select: { email: true, profile: true } },
        destinationCountry: true,
        workspaceData: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return cases.filter((c) => c.workspaceData); // only those with submitted workspaces
  }

  async reviewWorkspace(consultantUserId: string, caseId: string, reviewed: boolean) {
    const consultant = await this.prisma.consultantProfile.findUnique({
      where: { userId: consultantUserId },
    });
    if (!consultant) throw new ForbiddenException('Not a consultant');

    const workspace = await this.prisma.workspaceData.findUnique({
      where: { caseId },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    return this.prisma.workspaceData.update({
      where: { caseId },
      data: { reviewed },
    });
  }
}

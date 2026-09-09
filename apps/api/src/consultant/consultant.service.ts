import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConsultantService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  private async getConsultantProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.consultantProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new ForbiddenException('Consultant profile not found');
    return profile.id;
  }

  async getStats(userId: string) {
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

  async reviewDocument(
    userId: string,
    documentId: string,
    status: string,
    notes?: string,
  ) {
    const consultantId = await this.getConsultantProfileId(userId);
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { case: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
  
    const newStatus = status === 'APPROVED' ? 'VERIFIED' : 'REJECTED';
    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: newStatus as any,
        reviewNotes: notes || null,
        reviewedById: consultantId,
      },
    });
  
    // If all required documents are verified, update case status
    const caseData = await this.prisma.case.findUnique({
      where: { id: doc.caseId },
      include: { visaRule: true, documents: true },
    });
    if (caseData && caseData.visaRule) {
      const requiredDocs = (caseData.visaRule.requiredDocs as string[]) || [];
      const verifiedDocs = caseData.documents
        .filter(d => d.status === 'VERIFIED')
        .map(d => d.type);
      const allVerified = requiredDocs.every(rd => verifiedDocs.includes(rd));
      if (allVerified) {
        await this.prisma.case.update({
          where: { id: doc.caseId },
          data: { status: 'DOCUMENTS_VERIFIED' },
        });
      }
    }
  
    return updated;
  }

  async getAssignedCases(userId: string) {
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

  async getCaseDetails(userId: string, caseId: string) {
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
    if (!caseData) throw new NotFoundException('Case not found or not assigned to you');
    return caseData;
  }

  async updateCaseStatus(userId: string, caseId: string, status: string) {
    const consultantId = await this.getConsultantProfileId(userId);
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, consultantId },
    });
    if (!caseData) throw new NotFoundException('Case not found or not assigned to you');

    return this.prisma.case.update({
      where: { id: caseId },
      data: { status: status as any },
    });
  }

  async updateCaseNotes(userId: string, caseId: string, notes: string) {
    const consultantId = await this.getConsultantProfileId(userId);
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, consultantId },
    });
    if (!caseData) throw new NotFoundException('Case not found or not assigned to you');
    return this.prisma.case.update({
      where: { id: caseId },
      data: { notes },
    });
  }

  async getCaseDocuments(userId: string, caseId: string) {
    const consultantId = await this.getConsultantProfileId(userId);
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, consultantId },
    });
    if (!caseData) throw new NotFoundException('Case not found or not assigned to you');

    return this.prisma.document.findMany({
      where: { caseId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async verifyDocument(userId: string, documentId: string, verified: boolean) {
    const consultantId = await this.getConsultantProfileId(userId);
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, case: { consultantId } },
      include: { case: { select: { userId: true } } },
    });
    if (!doc) throw new NotFoundException('Document not found or not under your cases');

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: verified ? 'VERIFIED' : 'REJECTED',
        verifiedById: consultantId,
      },
    });

    if (doc.case?.userId) {
      await this.notificationsService.createNotification(
        doc.case.userId,
        'Document Reviewed',
        `Your document "${doc.name}" was ${verified ? 'verified' : 'rejected'} by your consultant.`,
        { documentId },
      );
    }

    return updated;
  }
}
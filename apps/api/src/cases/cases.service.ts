import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CasesService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateCaseDto) {
    // Validate origin and destination countries exist
    const [origin, destination] = await Promise.all([
      this.prisma.country.findUnique({ where: { id: dto.originCountryId } }),
      this.prisma.country.findUnique({ where: { id: dto.destinationCountryId } }),
    ]);

    if (!origin || !destination) {
      console.warn(`❌ Invalid country IDs in case creation: origin=${dto.originCountryId}, dest=${dto.destinationCountryId}`);
      throw new BadRequestException('Invalid country IDs');
    }

    const result = await this.prisma.case.create({
      data: {
        userId,
        originCountryId: dto.originCountryId,
        destinationCountryId: dto.destinationCountryId,
        visaRuleId: dto.visaRuleId,
        eligibilityLabel: dto.eligibilityLabel as any,
      },
    });

    console.log(`✅ Case created: ${result.id} for user ${userId}`);
    this.eventsGateway.emitToUser(userId, 'case-created', result);
    await this.notificationsService.createNotification(
      userId,
      'Case Created',
      'Your immigration case has been created successfully.',
      { caseId: result.id },
    );

    return result;
  }

  async updateStatus(userId: string, caseId: string, status: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
    });
    if (!caseData) {
      console.warn(`⚠️ Case not found for updateStatus: user=${userId}, case=${caseId}`);
      throw new NotFoundException('Case not found');
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: {
        status: status as any,
        timeline: [
          ...((caseData.timeline as any[]) || []),
          { event: status, date: new Date().toISOString() },
        ],
      },
    });

    this.eventsGateway.emitToUser(userId, 'case-updated', updated);
    await this.notificationsService.createNotification(
      userId,
      'Case Updated',
      `Your case status is now ${status.replace(/_/g, ' ')}.`,
      { caseId },
    );

    return updated;
  }

  async findAllForUser(userId: string) {
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

  async findOne(userId: string, caseId: string) {
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
    if (!c) {
      console.warn(`⚠️ Case not found for user ${userId}, caseId ${caseId}`);
      throw new NotFoundException('Case not found');
    }
    return c;
  }

  async submitForReview(userId: string, caseId: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
    });
    if (!caseData) {
      console.warn(`⚠️ Case not found for submitForReview: user=${userId}, case=${caseId}`);
      throw new NotFoundException('Case not found');
    }

    if (
      caseData.status !== 'PROFILE_CREATED' &&
      caseData.status !== 'DOCUMENTS_PENDING'
    ) {
      throw new BadRequestException('Case is not in a submittable state');
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { status: 'DOCUMENTS_PENDING' },
    });

    await this.notificationsService.createNotification(
      userId,
      'Case Submitted for Review',
      'Your case is now pending document verification.',
      { caseId },
    );

    console.log(`📨 Case ${caseId} submitted for review`);
    return updated;
  }

  async findAllAdmin() {
    return this.prisma.case.findMany({
      include: {
        originCountry: true,
        destinationCountry: true,
        visaRule: { include: { visaType: true } },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: true,
          },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
        checklistItems: true,
        consultant: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAdmin(caseId: string) {
    const c = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        originCountry: true,
        destinationCountry: true,
        visaRule: { include: { visaType: true } },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: true,
          },
        },
        documents: {
          include: {
            verifier: {
              include: {
                user: { select: { email: true, profile: true } },
              },
            },
            reviewer: {
              include: {
                user: { select: { email: true, profile: true } },
              },
            },
          },
          orderBy: { uploadedAt: 'desc' },
        },
        checklistItems: true,
        consultant: {
          include: {
            user: { select: { email: true, profile: true } },
          },
        },
      },
    });
    if (!c) {
      throw new NotFoundException('Case not found');
    }
    return c;
  }

  async updateStatusAdmin(caseId: string, status: string, adminUserId: string, notes?: string) {
    const caseData = await this.prisma.case.findUnique({
      where: { id: caseId },
    });
    if (!caseData) {
      throw new NotFoundException('Case not found');
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: {
        status: status as any,
        notes: notes !== undefined ? notes : caseData.notes,
        timeline: [
          ...((caseData.timeline as any[]) || []),
          { event: status, date: new Date().toISOString(), notes: notes || undefined },
        ],
      },
      include: {
        originCountry: true,
        destinationCountry: true,
        visaRule: { include: { visaType: true } },
        user: { select: { id: true, email: true, profile: true } },
        documents: true,
      },
    });

    this.eventsGateway.emitToUser(caseData.userId, 'case-updated', updated);
    await this.notificationsService.createNotification(
      caseData.userId,
      'Case Status Updated',
      `Your case status has been updated to ${status.replace(/_/g, ' ')}.${notes ? ` Note: ${notes}` : ''}`,
      { caseId, status, notes },
    );

    return updated;
  }

  async getTimeline(userId: string, caseId: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
      select: { timeline: true },
    });
    return caseData?.timeline || [];
  }
}
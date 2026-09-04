import { Injectable, NotFoundException } from '@nestjs/common';
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
    const result = await this.prisma.case.create({
      data: {
        userId,
        originCountryId: dto.originCountryId,
        destinationCountryId: dto.destinationCountryId,
        visaRuleId: dto.visaRuleId,
        eligibilityLabel: dto.eligibilityLabel as any,
      },
    });

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
    if (!caseData) throw new NotFoundException('Case not found');

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
    if (!c) throw new NotFoundException('Case not found');
    return c;
  }

  async getTimeline(userId: string, caseId: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, userId },
      select: { timeline: true },
    });
    return caseData?.timeline || [];
  }
}
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../real-time/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import {
  CreateInvestmentDto,
  UpdateInvestmentDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  AddTransactionDto,
  UploadInvestmentDocumentDto,
  LogPerformanceDto,
} from './dto/create-investment.dto';
import { InvestmentStatus, MilestoneStatus } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
    private mailService: MailService,
  ) {}

  // ============================================================
  // INVESTMENT PROGRAMS (CBI Tracking)
  // ============================================================

  async createInvestment(userId: string, dto: CreateInvestmentDto) {
    const program = await this.prisma.program.findUnique({
      where: { id: dto.programId },
    });
    if (!program) {
      throw new NotFoundException('Investment program not found');
    }

    const investment = await this.prisma.investmentProgram.create({
      data: {
        programId: dto.programId,
        userId,
        caseId: dto.caseId,
        investmentType: dto.investmentType,
        targetAmount: dto.targetAmount,
        investedAmount: dto.investedAmount || 0,
        currency: dto.currency || 'USD',
        expectedROI: dto.expectedROI,
        lockPeriodMonths: dto.lockPeriodMonths,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        maturityDate: dto.maturityDate ? new Date(dto.maturityDate) : undefined,
        assetDetails: dto.assetDetails,
        propertyDetails: dto.propertyDetails,
        businessDetails: dto.businessDetails,
        riskRating: dto.riskRating,
        notes: dto.notes,
        status: InvestmentStatus.PLEDGED,
      },
      include: {
        program: true,
        milestones: true,
        transactions: true,
      },
    });

    await this.notificationsService.createNotification(
      userId,
      'Investment Program Created',
      `Your ${program.title} investment program has been initiated.`,
      { investmentId: investment.id, programId: program.id },
    );

    this.eventsGateway.emitToUser(userId, 'investment-created', investment);

    return investment;
  }

  async findAllForUser(userId: string) {
    return this.prisma.investmentProgram.findMany({
      where: { userId },
      include: {
        program: true,
        case: {
          select: {
            id: true,
            status: true,
            destinationCountry: { select: { name: true, code: true } },
          },
        },
        milestones: { orderBy: { order: 'asc' } },
        transactions: { orderBy: { transactionDate: 'desc' } },
        documents: true,
        performanceLogs: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, investmentId: string) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: investmentId, userId },
      include: {
        program: true,
        case: {
          include: {
            destinationCountry: true,
            originCountry: true,
          },
        },
        milestones: { orderBy: { order: 'asc' } },
        transactions: { orderBy: { transactionDate: 'desc' } },
        documents: true,
        performanceLogs: {
          orderBy: { recordedAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    return investment;
  }

  async updateInvestment(
    userId: string,
    investmentId: string,
    dto: UpdateInvestmentDto,
  ) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const updated = await this.prisma.investmentProgram.update({
      where: { id: investmentId },
      data: {
        investedAmount: dto.investedAmount,
        status: dto.status as InvestmentStatus,
        actualROI: dto.actualROI,
        exitDate: dto.exitDate ? new Date(dto.exitDate) : undefined,
        complianceChecks: dto.complianceChecks,
        assetDetails: dto.assetDetails,
        propertyDetails: dto.propertyDetails,
        businessDetails: dto.businessDetails,
        notes: dto.notes,
      },
      include: {
        program: true,
        milestones: true,
        transactions: true,
      },
    });

    this.eventsGateway.emitToUser(userId, 'investment-updated', updated);

    return updated;
  }

  async getInvestmentDashboard(userId: string) {
    const investments = await this.prisma.investmentProgram.findMany({
      where: { userId },
      select: {
        id: true,
        targetAmount: true,
        investedAmount: true,
        currency: true,
        status: true,
        investmentType: true,
        expectedROI: true,
        actualROI: true,
        maturityDate: true,
        program: {
          select: {
            title: true,
            category: true,
          },
        },
        _count: {
          select: {
            milestones: true,
            transactions: true,
            documents: true,
          },
        },
      },
    });

    const totalInvested = investments.reduce(
      (sum, inv) => sum + inv.investedAmount,
      0,
    );
    const totalTarget = investments.reduce(
      (sum, inv) => sum + inv.targetAmount,
      0,
    );
    const avgROI =
      investments.filter((i) => i.actualROI).length > 0
        ? investments
            .filter((i) => i.actualROI)
            .reduce((sum, inv) => sum + (inv.actualROI || 0), 0) /
          investments.filter((i) => i.actualROI).length
        : 0;

    const byStatus = investments.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = investments.reduce((acc, inv) => {
      acc[inv.investmentType] = (acc[inv.investmentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalInvestments: investments.length,
        totalInvested,
        totalTarget,
        progressPercentage: totalTarget > 0 ? (totalInvested / totalTarget) * 100 : 0,
        averageROI: avgROI,
      },
      byStatus,
      byType,
      investments,
    };
  }

  // ============================================================
  // MILESTONES MANAGEMENT
  // ============================================================

  async createMilestone(userId: string, dto: CreateMilestoneDto) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: dto.investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const milestone = await this.prisma.investmentMilestone.create({
      data: {
        investmentId: dto.investmentId,
        title: dto.title,
        description: dto.description,
        order: dto.order || 0,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        status: dto.status || MilestoneStatus.NOT_STARTED,
        evidenceRequired: dto.evidenceRequired || false,
      },
    });

    this.eventsGateway.emitToUser(userId, 'milestone-created', milestone);

    return milestone;
  }

  async updateMilestone(
    userId: string,
    milestoneId: string,
    dto: UpdateMilestoneDto,
  ) {
    const milestone = await this.prisma.investmentMilestone.findUnique({
      where: { id: milestoneId },
      include: { investment: true },
    });

    if (!milestone || milestone.investment.userId !== userId) {
      throw new NotFoundException('Milestone not found');
    }

    const updated = await this.prisma.investmentMilestone.update({
      where: { id: milestoneId },
      data: {
        status: dto.status,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
        evidenceProvided: dto.evidenceProvided,
        notes: dto.notes,
      },
    });

    this.eventsGateway.emitToUser(userId, 'milestone-updated', updated);

    if (dto.status === MilestoneStatus.COMPLETED && !milestone.completedAt) {
      await this.notificationsService.createNotification(
        userId,
        'Milestone Completed',
        `Milestone "${milestone.title}" has been completed!`,
        { milestoneId, investmentId: milestone.investmentId },
      );
    }

    return updated;
  }

  async getMilestonesProgress(userId: string, investmentId: string) {
    const milestones = await this.prisma.investmentMilestone.findMany({
      where: { investmentId },
      orderBy: { order: 'asc' },
    });

    const total = milestones.length;
    const completed = milestones.filter(
      (m) => m.status === MilestoneStatus.COMPLETED,
    ).length;
    const inProgress = milestones.filter(
      (m) => m.status === MilestoneStatus.IN_PROGRESS,
    ).length;
    const blocked = milestones.filter(
      (m) => m.status === MilestoneStatus.BLOCKED,
    ).length;

    return {
      milestones,
      progress: {
        total,
        completed,
        inProgress,
        blocked,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      },
    };
  }

  // ============================================================
  // TRANSACTIONS MANAGEMENT
  // ============================================================

  async addTransaction(userId: string, dto: AddTransactionDto) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: dto.investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const transaction = await this.prisma.investmentTransaction.create({
      data: {
        investmentId: dto.investmentId,
        type: dto.type,
        amount: dto.amount,
        currency: dto.currency || 'USD',
        transactionDate: new Date(dto.transactionDate),
        reference: dto.reference,
        proofOfPayment: dto.proofOfPayment,
        notes: dto.notes,
        status: 'COMPLETED',
      },
    });

    let newInvestedAmount = investment.investedAmount;
    if (dto.type === 'DEPOSIT' || dto.type === 'INVESTMENT') {
      newInvestedAmount += dto.amount;
    } else if (dto.type === 'WITHDRAWAL' || dto.type === 'RETURN') {
      newInvestedAmount -= dto.amount;
    }

    await this.prisma.investmentProgram.update({
      where: { id: dto.investmentId },
      data: { investedAmount: newInvestedAmount },
    });

    this.eventsGateway.emitToUser(userId, 'transaction-added', transaction);

    return transaction;
  }

  async getTransactions(userId: string, investmentId: string) {
    return this.prisma.investmentTransaction.findMany({
      where: { investment: { id: investmentId, userId } },
      orderBy: { transactionDate: 'desc' },
    });
  }

  // ============================================================
  // DOCUMENTS MANAGEMENT
  // ============================================================

  async uploadDocument(userId: string, dto: UploadInvestmentDocumentDto) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: dto.investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const document = await this.prisma.investmentDocument.create({
      data: {
        investmentId: dto.investmentId,
        name: dto.name,
        type: dto.type,
        fileUrl: dto.fileUrl,
        category: dto.category,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });

    this.eventsGateway.emitToUser(userId, 'document-uploaded', document);

    return document;
  }

  async getDocuments(userId: string, investmentId: string) {
    return this.prisma.investmentDocument.findMany({
      where: { investment: { id: investmentId, userId } },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async verifyDocument(
    userId: string,
    documentId: string,
    isVerified: boolean,
  ) {
    const document = await this.prisma.investmentDocument.findUnique({
      where: { id: documentId },
      include: { investment: true },
    });

    if (!document || document.investment.userId !== userId) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.investmentDocument.update({
      where: { id: documentId },
      data: {
        verifiedAt: isVerified ? new Date() : null,
        status: isVerified ? 'VERIFIED' : 'REJECTED',
      },
    });

    return updated;
  }

  // ============================================================
  // PERFORMANCE TRACKING
  // ============================================================

  async logPerformance(userId: string, dto: LogPerformanceDto) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: dto.investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const performance = await this.prisma.investmentPerformance.create({
      data: {
        investmentId: dto.investmentId,
        currentValue: dto.currentValue,
        accruedReturns: dto.accruedReturns,
        roiPercentage: dto.roiPercentage,
        marketConditions: dto.marketConditions,
        notes: dto.notes,
      },
    });

    if (dto.roiPercentage) {
      await this.prisma.investmentProgram.update({
        where: { id: dto.investmentId },
        data: { actualROI: dto.roiPercentage },
      });
    }

    this.eventsGateway.emitToUser(userId, 'performance-logged', performance);

    return performance;
  }

  async getPerformanceHistory(userId: string, investmentId: string) {
    return this.prisma.investmentPerformance.findMany({
      where: { investment: { id: investmentId, userId } },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });
  }

  async getPerformanceChart(userId: string, investmentId: string) {
    const history = await this.getPerformanceHistory(userId, investmentId);
    
    return {
      labels: history.map((h) => h.recordedAt.toISOString().split('T')[0]),
      values: history.map((h) => h.currentValue),
      returns: history.map((h) => h.accruedReturns || 0),
      roi: history.map((h) => h.roiPercentage || 0),
    };
  }

  // ============================================================
  // COMPLIANCE & RISK
  // ============================================================

  async addComplianceCheck(
    userId: string,
    investmentId: string,
    checkData: any,
  ) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const existingChecks = (investment.complianceChecks as any[]) || [];
    const updatedChecks = [
      ...existingChecks,
      {
        ...checkData,
        timestamp: new Date().toISOString(),
        checkedBy: userId,
      },
    ];

    const updated = await this.prisma.investmentProgram.update({
      where: { id: investmentId },
      data: { complianceChecks: updatedChecks },
    });

    return updated.complianceChecks;
  }

  // ============================================================
  // EXIT STRATEGY
  // ============================================================

  async initiateExit(userId: string, investmentId: string, reason?: string) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const updated = await this.prisma.investmentProgram.update({
      where: { id: investmentId },
      data: {
        status: InvestmentStatus.EXITED,
        exitDate: new Date(),
        notes: investment.notes
          ? `${investment.notes}\nExit initiated: ${reason || 'No reason provided'}`
          : `Exit initiated: ${reason || 'No reason provided'}`,
      },
    });

    await this.notificationsService.createNotification(
      userId,
      'Investment Exit Initiated',
      `Your investment exit process has been started.`,
      { investmentId },
    );

    return updated;
  }

  async releaseInvestment(userId: string, investmentId: string) {
    const investment = await this.prisma.investmentProgram.findFirst({
      where: { id: investmentId, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const updated = await this.prisma.investmentProgram.update({
      where: { id: investmentId },
      data: {
        status: InvestmentStatus.RELEASED,
        exitDate: new Date(),
      },
    });

    await this.mailService.sendInvestmentReleaseConfirmation(
      (await this.prisma.user.findUnique({ where: { id: userId } }))?.email!,
      investmentId,
    );

    return updated;
  }

  // ============================================================
  // ANALYTICS & REPORTS
  // ============================================================

  async generateInvestmentReport(userId: string, investmentId: string) {
    const investment = await this.findOne(userId, investmentId);
    const performanceHistory = await this.getPerformanceHistory(
      userId,
      investmentId,
    );
    const transactions = await this.getTransactions(userId, investmentId);
    const documents = await this.getDocuments(userId, investmentId);

    const totalReturns = transactions
      .filter((t) => t.type === 'RETURN' || t.type === 'DIVIDEND')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalInvested = transactions
      .filter((t) => t.type === 'DEPOSIT' || t.type === 'INVESTMENT')
      .reduce((sum, t) => sum + t.amount, 0);

    const roi = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;

    return {
      investment,
      performanceHistory,
      transactions,
      documents,
      analytics: {
        totalReturns,
        totalInvested,
        roi,
        currentValue: performanceHistory[0]?.currentValue || 0,
        peakValue: Math.max(...performanceHistory.map((p) => p.currentValue)),
        lowestValue: Math.min(...performanceHistory.map((p) => p.currentValue)),
      },
      generatedAt: new Date(),
    };
  }
}

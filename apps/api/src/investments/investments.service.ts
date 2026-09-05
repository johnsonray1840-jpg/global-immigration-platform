import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { ReviewInvestmentDto } from './dto/review-investment.dto';
import { Role, InvestmentStatus } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createInvestmentDto: CreateInvestmentDto) {
    const { caseId, programId, ...rest } = createInvestmentDto;

    // If no caseId provided, find or create a citizenship by investment case
    let finalCaseId = caseId;
    if (!finalCaseId) {
      const existingCase = await this.prisma.case.findFirst({
        where: { userId },
      });

      if (existingCase) {
        finalCaseId = existingCase.id;
      } else {
        // Create a new case for investment
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true },
        });

        if (!user || !user.profile?.nationality) {
          throw new ForbiddenException('User profile incomplete. Please complete your profile first.');
        }

        // Find a default destination country (could be based on program)
        const destinationCountry = await this.prisma.country.findFirst({
          where: { code: 'AG' }, // Default to Antigua for CBI
        });

        if (!destinationCountry) {
          throw new NotFoundException('Destination country not found');
        }

        const newCase = await this.prisma.case.create({
          data: {
            userId,
            originCountryId: user.profile.nationality,
            destinationCountryId: destinationCountry.id,
            status: 'PROFILE_CREATED',
          },
        });

        finalCaseId = newCase.id;
      }
    }

    const investment = await this.prisma.investment.create({
      data: {
        ...rest,
        caseId: finalCaseId,
        userId,
        programId,
      },
      include: {
        case: {
          include: {
            destinationCountry: true,
            originCountry: true,
          },
        },
        program: true,
      },
    });

    return investment;
  }

  async findAll(filters: { status?: string; type?: string; programId?: string }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.programId) {
      where.programId = filters.programId;
    }

    return this.prisma.investment.findMany({
      where,
      include: {
        user: {
          include: { profile: true },
        },
        case: {
          include: {
            destinationCountry: true,
          },
        },
        program: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string, filters: { status?: string; type?: string; programId?: string }) {
    const where: any = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.programId) {
      where.programId = filters.programId;
    }

    return this.prisma.investment.findMany({
      where,
      include: {
        case: {
          include: {
            destinationCountry: true,
          },
        },
        program: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true },
        },
        case: {
          include: {
            destinationCountry: true,
            originCountry: true,
            documents: true,
          },
        },
        program: true,
        documents: true,
      },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    // Clients can only view their own investments
    if (userRole === Role.CLIENT && investment.userId !== userId) {
      throw new ForbiddenException('You can only view your own investments');
    }

    return investment;
  }

  async update(id: string, userId: string, updateInvestmentDto: UpdateInvestmentDto) {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.userId !== userId) {
      throw new ForbiddenException('You can only update your own investments');
    }

    // Can't update if already approved or completed
    if (investment.status === InvestmentStatus.APPROVED || investment.status === InvestmentStatus.COMPLETED) {
      throw new ForbiddenException('Cannot update approved or completed investments');
    }

    return this.prisma.investment.update({
      where: { id },
      data: updateInvestmentDto,
      include: {
        program: true,
        documents: true,
      },
    });
  }

  async uploadDocument(investmentId: string, userId: string, docData: { name: string; type: string; fileUrl: string }) {
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.userId !== userId) {
      throw new ForbiddenException('You can only upload documents to your own investments');
    }

    return this.prisma.investmentDocument.create({
      data: {
        investmentId,
        ...docData,
      },
    });
  }

  async getDocuments(investmentId: string, userId: string, userRole: Role) {
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    // Clients can only view documents for their own investments
    if (userRole === Role.CLIENT && investment.userId !== userId) {
      throw new ForbiddenException('You can only view documents for your own investments');
    }

    return this.prisma.investmentDocument.findMany({
      where: { investmentId },
    });
  }

  async reviewInvestment(id: string, reviewDto: ReviewInvestmentDto, reviewerId: string) {
    const { status, rejectionReason, notes } = reviewDto;

    const investment = await this.prisma.investment.findUnique({
      where: { id },
      include: { user: true, case: true },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    // Validate status transition
    const validStatuses = [InvestmentStatus.APPROVED, InvestmentStatus.REJECTED, InvestmentStatus.COMPLETED, InvestmentStatus.UNDER_REVIEW];
    if (!validStatuses.includes(status)) {
      throw new ForbiddenException('Invalid review status. Must be APPROVED, REJECTED, COMPLETED, or UNDER_REVIEW');
    }

    const updateData: any = {
      status,
      reviewedAt: new Date(),
    };

    if (status === InvestmentStatus.APPROVED) {
      updateData.approvedBy = reviewerId;
      updateData.approvedAt = new Date();
      
      // Update case status if linked
      if (investment.caseId) {
        await this.prisma.case.update({
          where: { id: investment.caseId },
          data: { status: 'UNDER_INTERNAL_REVIEW' },
        });
      }
    } else if (status === InvestmentStatus.REJECTED) {
      updateData.rejectionReason = rejectionReason || 'Investment application rejected';
    }

    const updatedInvestment = await this.prisma.investment.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        program: true,
      },
    });

    // Send notification to user
    await this.prisma.notification.create({
      data: {
        userId: investment.userId,
        title: status === InvestmentStatus.APPROVED ? 'Investment Approved' : 'Investment Rejected',
        body: status === InvestmentStatus.APPROVED
          ? `Your investment application has been approved.`
          : `Your investment application has been rejected. Reason: ${rejectionReason}`,
        data: { investmentId: id, status },
      },
    });

    return updatedInvestment;
  }

  async withdraw(id: string, userId: string) {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.userId !== userId) {
      throw new ForbiddenException('You can only withdraw your own investments');
    }

    if (investment.status === InvestmentStatus.COMPLETED || investment.status === InvestmentStatus.APPROVED) {
      throw new ForbiddenException('Cannot withdraw approved or completed investments');
    }

    return this.prisma.investment.update({
      where: { id },
      data: { status: InvestmentStatus.WITHDRAWN },
    });
  }

  async getAllPrograms(filters: { countryId?: string; type?: string }) {
    const where: any = { isActive: true };

    if (filters.countryId) {
      where.countryId = filters.countryId;
    }

    if (filters.type) {
      where.investmentType = filters.type;
    }

    return this.prisma.investmentProgram.findMany({
      where,
      include: {
        country: true,
      },
      orderBy: [{ popularityRank: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getProgramBySlug(slug: string) {
    const program = await this.prisma.investmentProgram.findUnique({
      where: { slug },
      include: {
        country: true,
      },
    });

    if (!program) {
      throw new NotFoundException('Investment program not found');
    }

    return program;
  }
}

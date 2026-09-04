import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalUsers,
      totalCases,
      totalPayments,
      totalRevenue,
      totalCountries,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.case.count(),
      this.prisma.payment.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
      this.prisma.country.count(),
    ]);

    return {
      totalUsers,
      totalCases,
      totalPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCountries,
    };
  }

  async getCountryDemand() {
    return this.prisma.case.groupBy({
      by: ['destinationCountryId'],
      _count: { _all: true },
      orderBy: { _count: { destinationCountryId: 'desc' } },
      take: 10,
    });
  }

  async getRecentActivity() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: { select: { email: true } } },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.country.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        continent: true,
        passportRank: true,
        safetyIndex: true,
        livingCostIndex: true,
        healthcareIndex: true,
        educationIndex: true,
        taxRate: true,
        currency: true,
        languages: true,
        imageUrl: true,
        lastUpdated: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(code: string) {
    const country = await this.prisma.country.findUnique({
      where: { code },
      include: {
        visaRules: {
          include: { visaType: true },
        },
        scholarships: {
          include: { university: true },
        },
        universities: true,
      },
    });
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  private async ensureGhanaExists() {
    try {
      const existing = await this.prisma.country.findUnique({ where: { code: 'GH' } });
      if (!existing) {
        const ghana = await this.prisma.country.create({
          data: {
            code: 'GH',
            name: 'Ghana',
            continent: 'Africa',
            passportRank: 75,
            safetyIndex: 68,
            livingCostIndex: 33,
            healthcareIndex: 62,
            educationIndex: 68,
            taxRate: 35,
            currency: 'GHS',
            languages: ['English', 'Akan', 'Ewe', 'Ga'],
          },
        });

        // Add core visa rules for Ghana
        const visaTypes = await this.prisma.visaType.findMany();
        for (const vt of visaTypes) {
          await this.prisma.countryVisaRule.create({
            data: {
              countryId: ghana.id,
              visaTypeId: vt.id,
              eligibilityJson: { minAge: 18, minIncome: 3000 },
              requiredDocs: ['Passport', 'Proof of Funds', 'Medical Report', 'Police Clearance'],
              governmentFee: vt.category === 'WORK_PERMIT' ? 500 : vt.category === 'PERMANENT_RESIDENCE' ? 1000 : 100,
              feeCurrency: 'USD',
              processingTimeMin: 15,
              processingTimeMax: 60,
              validityPeriod: 12,
              renewalAllowed: true,
            },
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Could not auto-seed Ghana:', e);
    }
  }

  async findAll() {
    await this.ensureGhanaExists();
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
    if (code === 'GH') {
      await this.ensureGhanaExists();
    }
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
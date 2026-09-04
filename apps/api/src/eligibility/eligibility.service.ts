import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
import { EligibilityLabel } from '@prisma/client';

interface EligibilityResultItem {
  visaRuleId: string;
  visaTypeId: string;
  visaName: string;
  category: string;
  eligibilityLabel: EligibilityLabel;
  score: number;
  reasons: string[];
  requiredDocuments: any;
  governmentFee: number | null;
  feeCurrency: string;
  processingTimeMin: number | null;
  processingTimeMax: number | null;
  validityPeriod: number | null;
  renewalAllowed: boolean;
}

@Injectable()
export class EligibilityService {
  constructor(private prisma: PrismaService) {}

  async check(dto: CheckEligibilityDto) {
    const destCountry = await this.prisma.country.findUnique({
      where: { code: dto.destinationCountryCode.toUpperCase() },
    });
    if (!destCountry) throw new NotFoundException('Destination country not found');

    const originCountry = await this.prisma.country.findUnique({
      where: { code: dto.originCountryCode.toUpperCase() },
    });
    if (!originCountry) throw new NotFoundException('Origin country not found');

    const rules = await this.prisma.countryVisaRule.findMany({
      where: { countryId: destCountry.id },
      include: { visaType: true },
    });

    const results: EligibilityResultItem[] = [];

    for (const rule of rules) {
      const evaluation = this.evaluateRule(rule.eligibilityJson as any, dto);
      results.push({
        visaRuleId: rule.id,
        visaTypeId: rule.visaTypeId,
        visaName: rule.visaType.name,
        category: rule.visaType.category,
        eligibilityLabel: evaluation.label,
        score: evaluation.score,
        reasons: evaluation.reasons,
        requiredDocuments: rule.requiredDocs,
        governmentFee: rule.governmentFee,
        feeCurrency: rule.feeCurrency,
        processingTimeMin: rule.processingTimeMin,
        processingTimeMax: rule.processingTimeMax,
        validityPeriod: rule.validityPeriod,
        renewalAllowed: rule.renewalAllowed,
      });
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return {
      originCountryId: originCountry.id,
      destinationCountryId: destCountry.id,
      originCountryCode: dto.originCountryCode,
      destinationCountryCode: dto.destinationCountryCode,
      results,
    };
  }

  private evaluateRule(
    ruleJson: any,
    profile: CheckEligibilityDto,
  ): { score: number; label: EligibilityLabel; reasons: string[] } {
    if (!ruleJson || Object.keys(ruleJson).length === 0) {
      return { score: 90, label: EligibilityLabel.LIKELY_ELIGIBLE, reasons: ['No specific criteria defined'] };
    }

    let score = 100;
    const reasons: string[] = [];

    // Age
    if (ruleJson.minAge && profile.age < ruleJson.minAge) {
      score -= 30;
      reasons.push(`Age below minimum (${ruleJson.minAge})`);
    }
    if (ruleJson.maxAge && profile.age > ruleJson.maxAge) {
      score -= 30;
      reasons.push(`Age above maximum (${ruleJson.maxAge})`);
    }

    // Income
    if (ruleJson.minIncome && (!profile.annualIncome || profile.annualIncome < ruleJson.minIncome)) {
      score -= 25;
      reasons.push(`Income below required $${ruleJson.minIncome}`);
    }

    // Education
    if (ruleJson.education && ruleJson.education.length > 0) {
      if (!profile.educationLevel || !ruleJson.education.includes(profile.educationLevel.toLowerCase())) {
        score -= 20;
        reasons.push(`Education level not in accepted list: ${ruleJson.education.join(', ')}`);
      }
    }

    // Language test
    if (ruleJson.languageTest) {
      if (!profile.languageTest || !profile.languageTest.toLowerCase().includes(ruleJson.languageTest.toLowerCase())) {
        score -= 15;
        reasons.push(`Language test not met (${ruleJson.languageTest})`);
      }
    }

    // Investment
    if (ruleJson.minInvestment && (!profile.investmentBudget || profile.investmentBudget < ruleJson.minInvestment)) {
      score -= 20;
      reasons.push(`Investment below required $${ruleJson.minInvestment}`);
    }

    score = Math.max(0, score);

    let label: EligibilityLabel;
    if (score >= 80) label = EligibilityLabel.LIKELY_ELIGIBLE;
    else if (score >= 50) label = EligibilityLabel.POTENTIALLY_ELIGIBLE;
    else label = EligibilityLabel.NEEDS_REVIEW;

    return { score, label, reasons };
  }
}
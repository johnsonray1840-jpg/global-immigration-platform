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
export declare class EligibilityService {
    private prisma;
    constructor(prisma: PrismaService);
    check(dto: CheckEligibilityDto): Promise<{
        originCountryId: string;
        destinationCountryId: string;
        originCountryCode: string;
        destinationCountryCode: string;
        results: EligibilityResultItem[];
    }>;
    private evaluateRule;
}
export {};

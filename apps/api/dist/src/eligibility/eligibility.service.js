"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EligibilityService = class EligibilityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async check(dto) {
        const destCountry = await this.prisma.country.findUnique({
            where: { code: dto.destinationCountryCode.toUpperCase() },
        });
        if (!destCountry)
            throw new common_1.NotFoundException('Destination country not found');
        const originCountry = await this.prisma.country.findUnique({
            where: { code: dto.originCountryCode.toUpperCase() },
        });
        if (!originCountry)
            throw new common_1.NotFoundException('Origin country not found');
        const rules = await this.prisma.countryVisaRule.findMany({
            where: { countryId: destCountry.id },
            include: { visaType: true },
        });
        const results = [];
        for (const rule of rules) {
            const evaluation = this.evaluateRule(rule.eligibilityJson, dto);
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
        results.sort((a, b) => b.score - a.score);
        return {
            originCountryId: originCountry.id,
            destinationCountryId: destCountry.id,
            originCountryCode: dto.originCountryCode,
            destinationCountryCode: dto.destinationCountryCode,
            results,
        };
    }
    evaluateRule(ruleJson, profile) {
        if (!ruleJson || Object.keys(ruleJson).length === 0) {
            return { score: 90, label: client_1.EligibilityLabel.LIKELY_ELIGIBLE, reasons: ['No specific criteria defined'] };
        }
        let score = 100;
        const reasons = [];
        if (ruleJson.minAge && profile.age < ruleJson.minAge) {
            score -= 30;
            reasons.push(`Age below minimum (${ruleJson.minAge})`);
        }
        if (ruleJson.maxAge && profile.age > ruleJson.maxAge) {
            score -= 30;
            reasons.push(`Age above maximum (${ruleJson.maxAge})`);
        }
        if (ruleJson.minIncome && (!profile.annualIncome || profile.annualIncome < ruleJson.minIncome)) {
            score -= 25;
            reasons.push(`Income below required $${ruleJson.minIncome}`);
        }
        if (ruleJson.education && ruleJson.education.length > 0) {
            if (!profile.educationLevel || !ruleJson.education.includes(profile.educationLevel.toLowerCase())) {
                score -= 20;
                reasons.push(`Education level not in accepted list: ${ruleJson.education.join(', ')}`);
            }
        }
        if (ruleJson.languageTest) {
            if (!profile.languageTest || !profile.languageTest.toLowerCase().includes(ruleJson.languageTest.toLowerCase())) {
                score -= 15;
                reasons.push(`Language test not met (${ruleJson.languageTest})`);
            }
        }
        if (ruleJson.minInvestment && (!profile.investmentBudget || profile.investmentBudget < ruleJson.minInvestment)) {
            score -= 20;
            reasons.push(`Investment below required $${ruleJson.minInvestment}`);
        }
        score = Math.max(0, score);
        let label;
        if (score >= 80)
            label = client_1.EligibilityLabel.LIKELY_ELIGIBLE;
        else if (score >= 50)
            label = client_1.EligibilityLabel.POTENTIALLY_ELIGIBLE;
        else
            label = client_1.EligibilityLabel.NEEDS_REVIEW;
        return { score, label, reasons };
    }
};
exports.EligibilityService = EligibilityService;
exports.EligibilityService = EligibilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EligibilityService);
//# sourceMappingURL=eligibility.service.js.map
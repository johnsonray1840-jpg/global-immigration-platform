"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌍 Seeding countries and visa rules...');
    const visaTypes = [
        { id: 'global-tourist', category: 'TOURIST', name: 'Tourist Visa', description: 'Short stay for tourism and leisure', isGlobal: true },
        { id: 'global-work', category: 'WORK_PERMIT', name: 'Work Permit', description: 'Employment visa for skilled and semi-skilled workers', isGlobal: true },
        { id: 'global-study', category: 'STUDENT', name: 'Student Visa', description: 'Visa for international students enrolled in accredited institutions', isGlobal: true },
        { id: 'global-pr', category: 'PERMANENT_RESIDENCE', name: 'Permanent Residence', description: 'Pathway to permanent residency and eventual citizenship', isGlobal: true },
        { id: 'global-family', category: 'FAMILY_SPONSORSHIP', name: 'Family Sponsorship', description: 'Reunite with family members who are citizens or permanent residents', isGlobal: true },
        { id: 'global-investor', category: 'INVESTOR', name: 'Investor Visa', description: 'For individuals making significant financial investment', isGlobal: true },
        { id: 'global-business', category: 'BUSINESS', name: 'Business Visa', description: 'For entrepreneurs and business visitors', isGlobal: true },
        { id: 'global-retirement', category: 'RETIREMENT', name: 'Retirement Visa', description: 'For retirees seeking to live abroad', isGlobal: true },
        { id: 'global-digital-nomad', category: 'DIGITAL_NOMAD', name: 'Digital Nomad Visa', description: 'For remote workers and freelancers', isGlobal: true },
        { id: 'global-citizenship', category: 'CITIZENSHIP_INVESTMENT', name: 'Citizenship by Investment', description: 'Direct citizenship through qualifying investment', isGlobal: true },
    ];
    for (const vt of visaTypes) {
        await prisma.visaType.upsert({
            where: { id: vt.id },
            update: { name: vt.name, category: vt.category, description: vt.description, isGlobal: vt.isGlobal },
            create: { ...vt, category: vt.category },
        });
    }
    const countries = [
        { code: 'US', name: 'United States', continent: 'North America', passportRank: 8, safetyIndex: 75, livingCostIndex: 70, healthcareIndex: 85, educationIndex: 95, taxRate: 37, currency: 'USD', languages: ['English'] },
        { code: 'CA', name: 'Canada', continent: 'North America', passportRank: 7, safetyIndex: 90, livingCostIndex: 65, healthcareIndex: 92, educationIndex: 90, taxRate: 33, currency: 'CAD', languages: ['English', 'French'] },
        { code: 'GB', name: 'United Kingdom', continent: 'Europe', passportRank: 6, safetyIndex: 80, livingCostIndex: 75, healthcareIndex: 88, educationIndex: 88, taxRate: 45, currency: 'GBP', languages: ['English'] },
        { code: 'AU', name: 'Australia', continent: 'Oceania', passportRank: 9, safetyIndex: 95, livingCostIndex: 72, healthcareIndex: 91, educationIndex: 89, taxRate: 45, currency: 'AUD', languages: ['English'] },
        { code: 'DE', name: 'Germany', continent: 'Europe', passportRank: 4, safetyIndex: 85, livingCostIndex: 68, healthcareIndex: 93, educationIndex: 92, taxRate: 45, currency: 'EUR', languages: ['German'] },
        { code: 'FR', name: 'France', continent: 'Europe', passportRank: 5, safetyIndex: 82, livingCostIndex: 70, healthcareIndex: 91, educationIndex: 87, taxRate: 45, currency: 'EUR', languages: ['French'] },
        { code: 'SG', name: 'Singapore', continent: 'Asia', passportRank: 1, safetyIndex: 98, livingCostIndex: 80, healthcareIndex: 90, educationIndex: 90, taxRate: 22, currency: 'SGD', languages: ['English', 'Mandarin', 'Malay', 'Tamil'] },
        { code: 'AE', name: 'United Arab Emirates', continent: 'Asia', passportRank: 15, safetyIndex: 95, livingCostIndex: 75, healthcareIndex: 80, educationIndex: 75, taxRate: 0, currency: 'AED', languages: ['Arabic', 'English'] },
        { code: 'CH', name: 'Switzerland', continent: 'Europe', passportRank: 3, safetyIndex: 99, livingCostIndex: 85, healthcareIndex: 95, educationIndex: 93, taxRate: 40, currency: 'CHF', languages: ['German', 'French', 'Italian'] },
        { code: 'NZ', name: 'New Zealand', continent: 'Oceania', passportRank: 8, safetyIndex: 96, livingCostIndex: 68, healthcareIndex: 90, educationIndex: 88, taxRate: 33, currency: 'NZD', languages: ['English', 'Maori'] },
        { code: 'IE', name: 'Ireland', continent: 'Europe', passportRank: 6, safetyIndex: 90, livingCostIndex: 70, healthcareIndex: 85, educationIndex: 85, taxRate: 40, currency: 'EUR', languages: ['English', 'Irish'] },
        { code: 'JP', name: 'Japan', continent: 'Asia', passportRank: 2, safetyIndex: 97, livingCostIndex: 72, healthcareIndex: 92, educationIndex: 91, taxRate: 55, currency: 'JPY', languages: ['Japanese'] },
        { code: 'KR', name: 'South Korea', continent: 'Asia', passportRank: 3, safetyIndex: 96, livingCostIndex: 65, healthcareIndex: 89, educationIndex: 90, taxRate: 45, currency: 'KRW', languages: ['Korean'] },
        { code: 'NL', name: 'Netherlands', continent: 'Europe', passportRank: 5, safetyIndex: 90, livingCostIndex: 72, healthcareIndex: 90, educationIndex: 88, taxRate: 49.5, currency: 'EUR', languages: ['Dutch'] },
        { code: 'SE', name: 'Sweden', continent: 'Europe', passportRank: 5, safetyIndex: 93, livingCostIndex: 70, healthcareIndex: 94, educationIndex: 91, taxRate: 57, currency: 'SEK', languages: ['Swedish'] },
        { code: 'NO', name: 'Norway', continent: 'Europe', passportRank: 5, safetyIndex: 96, livingCostIndex: 75, healthcareIndex: 94, educationIndex: 90, taxRate: 38, currency: 'NOK', languages: ['Norwegian'] },
        { code: 'DK', name: 'Denmark', continent: 'Europe', passportRank: 4, safetyIndex: 95, livingCostIndex: 75, healthcareIndex: 92, educationIndex: 89, taxRate: 42, currency: 'DKK', languages: ['Danish'] },
        { code: 'FI', name: 'Finland', continent: 'Europe', passportRank: 4, safetyIndex: 96, livingCostIndex: 70, healthcareIndex: 93, educationIndex: 92, taxRate: 56, currency: 'EUR', languages: ['Finnish', 'Swedish'] },
        { code: 'AT', name: 'Austria', continent: 'Europe', passportRank: 5, safetyIndex: 93, livingCostIndex: 72, healthcareIndex: 91, educationIndex: 88, taxRate: 55, currency: 'EUR', languages: ['German'] },
        { code: 'BE', name: 'Belgium', continent: 'Europe', passportRank: 6, safetyIndex: 89, livingCostIndex: 70, healthcareIndex: 90, educationIndex: 87, taxRate: 50, currency: 'EUR', languages: ['Dutch', 'French', 'German'] },
        { code: 'PT', name: 'Portugal', continent: 'Europe', passportRank: 5, safetyIndex: 92, livingCostIndex: 60, healthcareIndex: 86, educationIndex: 83, taxRate: 48, currency: 'EUR', languages: ['Portuguese'] },
        { code: 'ES', name: 'Spain', continent: 'Europe', passportRank: 4, safetyIndex: 90, livingCostIndex: 62, healthcareIndex: 89, educationIndex: 84, taxRate: 45, currency: 'EUR', languages: ['Spanish'] },
        { code: 'IT', name: 'Italy', continent: 'Europe', passportRank: 4, safetyIndex: 88, livingCostIndex: 68, healthcareIndex: 87, educationIndex: 82, taxRate: 43, currency: 'EUR', languages: ['Italian'] },
        { code: 'GR', name: 'Greece', continent: 'Europe', passportRank: 8, safetyIndex: 85, livingCostIndex: 60, healthcareIndex: 84, educationIndex: 80, taxRate: 44, currency: 'EUR', languages: ['Greek'] },
        { code: 'CZ', name: 'Czech Republic', continent: 'Europe', passportRank: 7, safetyIndex: 90, livingCostIndex: 58, healthcareIndex: 85, educationIndex: 85, taxRate: 23, currency: 'CZK', languages: ['Czech'] },
        { code: 'PL', name: 'Poland', continent: 'Europe', passportRank: 10, safetyIndex: 89, livingCostIndex: 55, healthcareIndex: 80, educationIndex: 82, taxRate: 32, currency: 'PLN', languages: ['Polish'] },
        { code: 'HU', name: 'Hungary', continent: 'Europe', passportRank: 9, safetyIndex: 88, livingCostIndex: 55, healthcareIndex: 78, educationIndex: 80, taxRate: 15, currency: 'HUF', languages: ['Hungarian'] },
        { code: 'RO', name: 'Romania', continent: 'Europe', passportRank: 16, safetyIndex: 84, livingCostIndex: 50, healthcareIndex: 75, educationIndex: 78, taxRate: 10, currency: 'RON', languages: ['Romanian'] },
        { code: 'BG', name: 'Bulgaria', continent: 'Europe', passportRank: 18, safetyIndex: 82, livingCostIndex: 48, healthcareIndex: 72, educationIndex: 75, taxRate: 10, currency: 'BGN', languages: ['Bulgarian'] },
        { code: 'HR', name: 'Croatia', continent: 'Europe', passportRank: 17, safetyIndex: 86, livingCostIndex: 55, healthcareIndex: 79, educationIndex: 79, taxRate: 30, currency: 'EUR', languages: ['Croatian'] },
        { code: 'SK', name: 'Slovakia', continent: 'Europe', passportRank: 11, safetyIndex: 87, livingCostIndex: 55, healthcareIndex: 78, educationIndex: 80, taxRate: 25, currency: 'EUR', languages: ['Slovak'] },
        { code: 'SI', name: 'Slovenia', continent: 'Europe', passportRank: 10, safetyIndex: 91, livingCostIndex: 60, healthcareIndex: 84, educationIndex: 85, taxRate: 50, currency: 'EUR', languages: ['Slovenian'] },
        { code: 'LT', name: 'Lithuania', continent: 'Europe', passportRank: 12, safetyIndex: 88, livingCostIndex: 52, healthcareIndex: 78, educationIndex: 81, taxRate: 20, currency: 'EUR', languages: ['Lithuanian'] },
        { code: 'LV', name: 'Latvia', continent: 'Europe', passportRank: 13, safetyIndex: 86, livingCostIndex: 52, healthcareIndex: 76, educationIndex: 79, taxRate: 20, currency: 'EUR', languages: ['Latvian'] },
        { code: 'EE', name: 'Estonia', continent: 'Europe', passportRank: 9, safetyIndex: 90, livingCostIndex: 55, healthcareIndex: 80, educationIndex: 84, taxRate: 20, currency: 'EUR', languages: ['Estonian'] },
        { code: 'CY', name: 'Cyprus', continent: 'Europe', passportRank: 14, safetyIndex: 92, livingCostIndex: 60, healthcareIndex: 80, educationIndex: 78, taxRate: 12.5, currency: 'EUR', languages: ['Greek', 'Turkish'] },
        { code: 'MT', name: 'Malta', continent: 'Europe', passportRank: 7, safetyIndex: 95, livingCostIndex: 65, healthcareIndex: 85, educationIndex: 82, taxRate: 35, currency: 'EUR', languages: ['Maltese', 'English'] },
        { code: 'LU', name: 'Luxembourg', continent: 'Europe', passportRank: 3, safetyIndex: 97, livingCostIndex: 85, healthcareIndex: 91, educationIndex: 86, taxRate: 42, currency: 'EUR', languages: ['Luxembourgish', 'French', 'German'] },
        { code: 'IS', name: 'Iceland', continent: 'Europe', passportRank: 9, safetyIndex: 98, livingCostIndex: 80, healthcareIndex: 93, educationIndex: 90, taxRate: 46, currency: 'ISK', languages: ['Icelandic'] },
        { code: 'MX', name: 'Mexico', continent: 'North America', passportRank: 22, safetyIndex: 75, livingCostIndex: 45, healthcareIndex: 70, educationIndex: 72, taxRate: 35, currency: 'MXN', languages: ['Spanish'] },
        { code: 'BR', name: 'Brazil', continent: 'South America', passportRank: 19, safetyIndex: 70, livingCostIndex: 48, healthcareIndex: 75, educationIndex: 74, taxRate: 27.5, currency: 'BRL', languages: ['Portuguese'] },
        { code: 'AR', name: 'Argentina', continent: 'South America', passportRank: 20, safetyIndex: 72, livingCostIndex: 42, healthcareIndex: 76, educationIndex: 76, taxRate: 35, currency: 'ARS', languages: ['Spanish'] },
        { code: 'CL', name: 'Chile', continent: 'South America', passportRank: 16, safetyIndex: 85, livingCostIndex: 50, healthcareIndex: 80, educationIndex: 82, taxRate: 27, currency: 'CLP', languages: ['Spanish'] },
        { code: 'CO', name: 'Colombia', continent: 'South America', passportRank: 35, safetyIndex: 68, livingCostIndex: 42, healthcareIndex: 72, educationIndex: 75, taxRate: 35, currency: 'COP', languages: ['Spanish'] },
        { code: 'PE', name: 'Peru', continent: 'South America', passportRank: 28, safetyIndex: 70, livingCostIndex: 45, healthcareIndex: 68, educationIndex: 73, taxRate: 29.5, currency: 'PEN', languages: ['Spanish'] },
        { code: 'ZA', name: 'South Africa', continent: 'Africa', passportRank: 43, safetyIndex: 60, livingCostIndex: 40, healthcareIndex: 65, educationIndex: 70, taxRate: 45, currency: 'ZAR', languages: ['Afrikaans', 'English', 'Zulu'] },
        { code: 'NG', name: 'Nigeria', continent: 'Africa', passportRank: 80, safetyIndex: 55, livingCostIndex: 35, healthcareIndex: 60, educationIndex: 65, taxRate: 30, currency: 'NGN', languages: ['English'] },
        { code: 'EG', name: 'Egypt', continent: 'Africa', passportRank: 65, safetyIndex: 60, livingCostIndex: 30, healthcareIndex: 65, educationIndex: 70, taxRate: 22.5, currency: 'EGP', languages: ['Arabic'] },
        { code: 'KE', name: 'Kenya', continent: 'Africa', passportRank: 70, safetyIndex: 55, livingCostIndex: 32, healthcareIndex: 60, educationIndex: 68, taxRate: 30, currency: 'KES', languages: ['Swahili', 'English'] },
        { code: 'MA', name: 'Morocco', continent: 'Africa', passportRank: 67, safetyIndex: 65, livingCostIndex: 35, healthcareIndex: 62, educationIndex: 65, taxRate: 38, currency: 'MAD', languages: ['Arabic', 'French'] },
        { code: 'TH', name: 'Thailand', continent: 'Asia', passportRank: 60, safetyIndex: 70, livingCostIndex: 35, healthcareIndex: 75, educationIndex: 70, taxRate: 35, currency: 'THB', languages: ['Thai'] },
        { code: 'VN', name: 'Vietnam', continent: 'Asia', passportRank: 78, safetyIndex: 68, livingCostIndex: 30, healthcareIndex: 65, educationIndex: 72, taxRate: 35, currency: 'VND', languages: ['Vietnamese'] },
        { code: 'ID', name: 'Indonesia', continent: 'Asia', passportRank: 72, safetyIndex: 65, livingCostIndex: 28, healthcareIndex: 60, educationIndex: 65, taxRate: 35, currency: 'IDR', languages: ['Indonesian'] },
        { code: 'MY', name: 'Malaysia', continent: 'Asia', passportRank: 14, safetyIndex: 80, livingCostIndex: 35, healthcareIndex: 75, educationIndex: 78, taxRate: 30, currency: 'MYR', languages: ['Malay'] },
        { code: 'PH', name: 'Philippines', continent: 'Asia', passportRank: 68, safetyIndex: 65, livingCostIndex: 30, healthcareIndex: 62, educationIndex: 70, taxRate: 35, currency: 'PHP', languages: ['Filipino', 'English'] },
        { code: 'IN', name: 'India', continent: 'Asia', passportRank: 76, safetyIndex: 60, livingCostIndex: 25, healthcareIndex: 65, educationIndex: 75, taxRate: 42, currency: 'INR', languages: ['Hindi', 'English'] },
        { code: 'PK', name: 'Pakistan', continent: 'Asia', passportRank: 88, safetyIndex: 55, livingCostIndex: 25, healthcareIndex: 60, educationIndex: 65, taxRate: 35, currency: 'PKR', languages: ['Urdu', 'English'] },
        { code: 'BD', name: 'Bangladesh', continent: 'Asia', passportRank: 82, safetyIndex: 58, livingCostIndex: 22, healthcareIndex: 55, educationIndex: 62, taxRate: 30, currency: 'BDT', languages: ['Bengali'] },
        { code: 'TR', name: 'Turkey', continent: 'Europe/Asia', passportRank: 40, safetyIndex: 65, livingCostIndex: 32, healthcareIndex: 75, educationIndex: 78, taxRate: 40, currency: 'TRY', languages: ['Turkish'] },
        { code: 'RU', name: 'Russia', continent: 'Europe/Asia', passportRank: 45, safetyIndex: 60, livingCostIndex: 30, healthcareIndex: 65, educationIndex: 80, taxRate: 30, currency: 'RUB', languages: ['Russian'] },
        { code: 'UA', name: 'Ukraine', continent: 'Europe', passportRank: 35, safetyIndex: 55, livingCostIndex: 28, healthcareIndex: 60, educationIndex: 75, taxRate: 18, currency: 'UAH', languages: ['Ukrainian'] },
        { code: 'SA', name: 'Saudi Arabia', continent: 'Asia', passportRank: 55, safetyIndex: 75, livingCostIndex: 40, healthcareIndex: 70, educationIndex: 72, taxRate: 20, currency: 'SAR', languages: ['Arabic'] },
        { code: 'QA', name: 'Qatar', continent: 'Asia', passportRank: 52, safetyIndex: 95, livingCostIndex: 70, healthcareIndex: 85, educationIndex: 80, taxRate: 0, currency: 'QAR', languages: ['Arabic', 'English'] },
        { code: 'KW', name: 'Kuwait', continent: 'Asia', passportRank: 48, safetyIndex: 90, livingCostIndex: 65, healthcareIndex: 80, educationIndex: 75, taxRate: 0, currency: 'KWD', languages: ['Arabic'] },
    ];
    for (const c of countries) {
        await prisma.country.upsert({
            where: { code: c.code },
            update: c,
            create: c,
        });
    }
    await prisma.countryVisaRule.deleteMany();
    for (const country of countries) {
        const countryRecord = await prisma.country.findUnique({ where: { code: country.code } });
        if (!countryRecord)
            continue;
        const rules = [
            {
                visaTypeId: 'global-tourist',
                eligibilityJson: { minAge: 18, minIncome: 3000 },
                requiredDocs: ['Passport', 'Proof of Funds', 'Travel Itinerary'],
                governmentFee: 100,
                feeCurrency: country.currency,
                processingTimeMin: 15,
                processingTimeMax: 30,
                validityPeriod: 3,
                renewalAllowed: false,
            },
            {
                visaTypeId: 'global-work',
                eligibilityJson: { minAge: 22, minIncome: 20000, education: ['bachelor', 'master'] },
                requiredDocs: ['Passport', 'Job Offer Letter', 'Degree Certificate', 'Police Clearance'],
                governmentFee: 250,
                feeCurrency: country.currency,
                processingTimeMin: 30,
                processingTimeMax: 90,
                validityPeriod: 24,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-study',
                eligibilityJson: { minAge: 17, education: ['high_school'] },
                requiredDocs: ['Passport', 'University Acceptance', 'Proof of Funds'],
                governmentFee: 120,
                feeCurrency: country.currency,
                processingTimeMin: 20,
                processingTimeMax: 60,
                validityPeriod: 12,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-pr',
                eligibilityJson: { minAge: 18, minIncome: 30000, education: ['bachelor', 'master'] },
                requiredDocs: ['Passport', 'Employment Reference', 'Police Clearance', 'Medical Report'],
                governmentFee: 500,
                feeCurrency: country.currency,
                processingTimeMin: 90,
                processingTimeMax: 180,
                validityPeriod: 60,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-family',
                eligibilityJson: { minAge: 18 },
                requiredDocs: ['Passport', 'Proof of Relationship', 'Sponsor Documents'],
                governmentFee: 150,
                feeCurrency: country.currency,
                processingTimeMin: 60,
                processingTimeMax: 120,
                validityPeriod: 24,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-investor',
                eligibilityJson: { minAge: 21, minInvestment: 100000 },
                requiredDocs: ['Passport', 'Proof of Investment Funds', 'Business Plan'],
                governmentFee: 800,
                feeCurrency: country.currency,
                processingTimeMin: 45,
                processingTimeMax: 120,
                validityPeriod: 36,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-business',
                eligibilityJson: { minAge: 21, minIncome: 25000 },
                requiredDocs: ['Passport', 'Business Registration', 'Financial Statements'],
                governmentFee: 200,
                feeCurrency: country.currency,
                processingTimeMin: 30,
                processingTimeMax: 90,
                validityPeriod: 12,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-retirement',
                eligibilityJson: { minAge: 55, minIncome: 1500 },
                requiredDocs: ['Passport', 'Pension Statement', 'Proof of Funds'],
                governmentFee: 100,
                feeCurrency: country.currency,
                processingTimeMin: 30,
                processingTimeMax: 60,
                validityPeriod: 24,
                renewalAllowed: true,
            },
            {
                visaTypeId: 'global-digital-nomad',
                eligibilityJson: { minAge: 18, minIncome: 2500 },
                requiredDocs: ['Passport', 'Proof of Remote Work', 'Health Insurance'],
                governmentFee: 150,
                feeCurrency: country.currency,
                processingTimeMin: 15,
                processingTimeMax: 45,
                validityPeriod: 12,
                renewalAllowed: true,
            },
        ];
        for (const rule of rules) {
            await prisma.countryVisaRule.create({
                data: {
                    countryId: countryRecord.id,
                    visaTypeId: rule.visaTypeId,
                    eligibilityJson: rule.eligibilityJson,
                    requiredDocs: rule.requiredDocs,
                    governmentFee: rule.governmentFee,
                    feeCurrency: rule.feeCurrency,
                    processingTimeMin: rule.processingTimeMin,
                    processingTimeMax: rule.processingTimeMax,
                    validityPeriod: rule.validityPeriod,
                    renewalAllowed: rule.renewalAllowed,
                },
            });
        }
    }
    console.log('✅ Seeding completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
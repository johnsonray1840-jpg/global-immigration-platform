"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const programs_data_1 = require("./programs-data");
const prisma = new client_1.PrismaClient();
async function main() {
    for (const p of programs_data_1.programs) {
        await prisma.program.upsert({
            where: { slug: p.slug },
            update: {
                title: p.title,
                category: p.category,
                description: p.description,
                eligibility: p.eligibility,
                requirements: p.requirements,
                documents: p.documents,
                governmentFees: p.governmentFees,
                serviceFees: p.serviceFees,
                processingTime: p.processingTime,
                validity: p.validity,
                renewal: p.renewal,
                commonMistakes: p.commonMistakes,
                approvalRate: p.approvalRate,
                faqs: p.faqs,
            },
            create: {
                slug: p.slug,
                title: p.title,
                category: p.category,
                description: p.description,
                eligibility: p.eligibility,
                requirements: p.requirements,
                documents: p.documents,
                governmentFees: p.governmentFees,
                serviceFees: p.serviceFees,
                processingTime: p.processingTime,
                validity: p.validity,
                renewal: p.renewal,
                commonMistakes: p.commonMistakes,
                approvalRate: p.approvalRate,
                faqs: p.faqs,
            },
        });
    }
    console.log('✅ Programs seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=programs.seed.js.map
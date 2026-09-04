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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const inference_1 = require("@huggingface/inference");
let AiService = class AiService {
    prisma;
    hf = null;
    constructor(prisma) {
        this.prisma = prisma;
        if (process.env.HF_API_KEY) {
            this.hf = new inference_1.HfInference(process.env.HF_API_KEY);
        }
    }
    async chat(message, history = [], language = 'en') {
        const context = await this.retrieveContext(message);
        const languageInstruction = {
            en: 'Respond in English.',
            fr: 'Répondez en français.',
            es: 'Responda en español.',
            de: 'Antworten Sie auf Deutsch.',
            zh: '用中文回答。',
            ar: 'أجب باللغة العربية.',
        }[language] || 'Respond in English.';
        const systemPrompt = `You are the premium AI Immigration Assistant for Global Immigration Platform, a government-approved consultancy.
You help users understand visa types, permanent residence, citizenship, required documents, processing times, fees, and eligibility.
Always be polite, precise, and transparent. Never give legal advice; recommend booking a consultation for complex cases.
${languageInstruction}
Use the following context to answer:

${context}

If the answer is not in the context, say you need more information and suggest a consultation.`;
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-5),
            { role: 'user', content: message },
        ];
        try {
            if (this.hf) {
                const response = await this.hf.textGeneration({
                    model: 'mistralai/Mistral-7B-Instruct-v0.2',
                    inputs: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
                    parameters: { max_new_tokens: 300, temperature: 0.7 },
                });
                const generated = response.generated_text || '';
                return { reply: generated.split('assistant:').pop()?.trim() || generated.trim(), contextUsed: !!context };
            }
        }
        catch (error) {
            console.warn('Hugging Face error, using local fallback:', error?.message || error);
        }
        return { reply: this.localFallback(message), contextUsed: !!context };
    }
    async streamChat(message, history, language, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const full = await this.chat(message, history, language);
        const words = full.reply.split(' ');
        for (const word of words) {
            res.write(`data: ${JSON.stringify({ word })}\n\n`);
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        res.write('data: [DONE]\n\n');
        res.end();
    }
    async retrieveContext(query) {
        const keyword = query?.trim()?.toLowerCase()?.split(/\s+/)?.[0] || '';
        if (!keyword)
            return '';
        const [faqs, countries, programs, visaRules] = await Promise.all([
            this.prisma.faq.findMany({
                where: {
                    OR: [
                        { question: { contains: keyword, mode: 'insensitive' } },
                        { answer: { contains: keyword, mode: 'insensitive' } },
                    ],
                },
                take: 5,
            }),
            this.prisma.country.findMany({
                where: {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive' } },
                        { code: { contains: keyword, mode: 'insensitive' } },
                    ],
                },
                take: 3,
            }),
            this.prisma.program.findMany({
                where: {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { description: { contains: keyword, mode: 'insensitive' } },
                    ],
                },
                take: 3,
            }),
            this.prisma.countryVisaRule.findMany({
                where: {
                    OR: [
                        { visaType: { name: { contains: keyword, mode: 'insensitive' } } },
                    ],
                },
                include: { country: true, visaType: true },
                take: 3,
            }),
        ]);
        let context = '';
        if (faqs.length)
            context += 'Relevant FAQs:\n' + faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') + '\n\n';
        if (countries.length)
            context += 'Countries:\n' + countries.map(c => `${c.name} (${c.code})`).join(', ') + '\n\n';
        if (programs.length)
            context += 'Programs:\n' + programs.map(p => `${p.title}: ${p.description}`).join('\n') + '\n\n';
        if (visaRules.length)
            context += 'Visa Rules:\n' + visaRules.map(v => `${v.country.name} - ${v.visaType.name}: Fee ${v.governmentFee} ${v.feeCurrency}, Processing ${v.processingTimeMin}-${v.processingTimeMax} days`).join('\n') + '\n';
        return context.trim();
    }
    localFallback(message) {
        const lower = message.toLowerCase();
        if (lower.includes('visa') || lower.includes('permanent')) {
            return 'There are many visa types, including tourist, work, study, and permanent residence. I can help you compare them. Could you specify your destination country and purpose?';
        }
        if (lower.includes('documents')) {
            return 'Required documents usually include a valid passport, photos, proof of funds, and supporting letters. For a precise checklist, please use the eligibility checker or book a consultation.';
        }
        return 'I am currently in offline mode. Please configure the Hugging Face API key for full AI capabilities, or contact our support team.';
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map
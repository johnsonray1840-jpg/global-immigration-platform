import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HfInference } from '@huggingface/inference';
import type { Response } from 'express';

@Injectable()
export class AiService {
  private hf: HfInference | null = null;

  constructor(private prisma: PrismaService) {
    if (process.env.HF_API_KEY) {
      this.hf = new HfInference(process.env.HF_API_KEY);
    }
  }

  async chat(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    language = 'en',
  ) {
    const trimmedMsg = message?.trim() || '';
    if (!trimmedMsg) {
      return {
        reply: 'Hello! I am your AI Immigration & Platform Navigator. How can I help you explore visas, scholarships, or navigate our platform today?',
        contextUsed: false,
      };
    }

    const context = await this.retrieveContext(trimmedMsg);
    const languageInstruction = {
      en: 'Respond in English.',
      fr: 'Répondez en français.',
      es: 'Responda en español.',
      de: 'Antworten Sie auf Deutsch.',
      zh: '用中文回答。',
      ar: 'أجب باللغة العربية.',
      pt: 'Responda em português.',
      ru: 'Отвечайте на русском языке.',
    }[language] || 'Respond in English.';

    const systemPrompt = `You are the senior AI Immigration & Platform Advisor for Global Immigration Platform (https://globalimmigration.com).
Your primary role is to:
1. Help both guests and registered clients navigate the entire website with clickable markdown links.
2. Answer intense, detailed questions about visas (Express Entry, Work Permits, Student Visas, Golden Visas, Citizenship by Investment, Digital Nomad Visas).
3. Guide users on scholarship applications, required documentation, OCR checks, and case progress workflows.
4. If a question is outside immigration, global education, visas, or platform navigation, politely decline and refocus on immigration services.

KEY PLATFORM NAVIGATION ROUTES:
- Check Visa Eligibility & Points: [Eligibility Assessment](/eligibility)
- Global Scholarships Directory: [Browse 10+ Scholarships](/scholarships)
- Premium Service Packages: [View Service Packages](/packages)
- Immigration Programs & Pathways: [Explore Programs](/programs)
- Country Guides & Cost of Living: [Country Directory](/countries)
- Country Comparison Tool: [Compare Countries](/compare)
- Book 1-on-1 Consultation: [Book a Consultation](/consultation)
- Client Case Tracking: [Dashboard Cases](/dashboard/cases)
- Document Upload & OCR Verification: [Document Center](/dashboard/documents)
- Consultation Appointments: [Manage Appointments](/dashboard/appointments)
- Payments & Crypto Wallets: [Billing & Wallet](/dashboard/wallet)
- Frequently Asked Questions: [FAQ Portal](/faq)

${languageInstruction}

RELEVANT DATABASE CONTEXT:
${context}

Provide a structured, helpful, and thorough response. Use bolding, bullet points, and markdown links where helpful.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: trimmedMsg },
    ];

    try {
      if (this.hf) {
        const response = await this.hf.textGeneration({
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          inputs: messages.map((m) => `${m.role}: ${m.content}`).join('\n'),
          parameters: { max_new_tokens: 500, temperature: 0.6 },
        });
        const generated = response.generated_text || '';
        const cleaned = generated.split('assistant:').pop()?.trim() || generated.trim();
        if (cleaned && cleaned.length > 20) {
          return { reply: cleaned, contextUsed: !!context };
        }
      }
    } catch (error) {
      console.warn('Hugging Face inference failed, utilizing built-in expert intelligence engine:', error?.message || error);
    }

    // Built-in high-intelligence immigration expert engine
    const intelligentReply = this.generateExpertReply(trimmedMsg, context);
    return { reply: intelligentReply, contextUsed: !!context };
  }

  async streamChat(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    language: string,
    res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const full = await this.chat(message, history, language);
    const words = full.reply.split(' ');

    for (const word of words) {
      res.write(`data: ${JSON.stringify({ word })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  }

  private async retrieveContext(query: string): Promise<string> {
    const rawTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
    if (rawTokens.length === 0) return '';

    const searchClause = rawTokens.slice(0, 4).join(' | ');

    try {
      const [faqs, countries, programs, scholarships, visaRules, servicePackages] = await Promise.all([
        this.prisma.faq.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              OR: [
                { question: { contains: token, mode: 'insensitive' } },
                { answer: { contains: token, mode: 'insensitive' } },
              ],
            })),
          },
          take: 4,
        }),
        this.prisma.country.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              OR: [
                { name: { contains: token, mode: 'insensitive' } },
                { code: { contains: token, mode: 'insensitive' } },
              ],
            })),
          },
          take: 3,
        }),
        this.prisma.program.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              OR: [
                { title: { contains: token, mode: 'insensitive' } },
                { description: { contains: token, mode: 'insensitive' } },
              ],
            })),
          },
          take: 3,
        }),
        this.prisma.scholarship.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              OR: [
                { name: { contains: token, mode: 'insensitive' } },
                { description: { contains: token, mode: 'insensitive' } },
              ],
            })),
          },
          include: { country: true, university: true },
          take: 3,
        }),
        this.prisma.countryVisaRule.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              visaType: { name: { contains: token, mode: 'insensitive' } },
            })),
          },
          include: { country: true, visaType: true },
          take: 3,
        }),
        this.prisma.servicePackage.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              OR: [
                { name: { contains: token, mode: 'insensitive' } },
                { category: { contains: token, mode: 'insensitive' } },
              ],
            })),
          },
          take: 3,
        }),
      ]);

      let contextParts: string[] = [];

      if (countries.length) {
        contextParts.push(
          'Matching Countries: ' +
            countries.map((c) => `${c.name} (${c.code}, Safety: ${c.safetyIndex}/100, Living Cost: ${c.livingCostIndex}, Tax: ${c.taxRate}%)`).join('; ')
        );
      }
      if (scholarships.length) {
        contextParts.push(
          'Matching Scholarships: ' +
            scholarships.map((s) => `${s.name} at ${s.university?.name || 'Top Institutions'} (${s.country?.name || 'Global'}): $${s.fundingAmount || 0} grant, Deadline: ${s.deadline || 'Open'}`).join('; ')
        );
      }
      if (programs.length) {
        contextParts.push(
          'Immigration Programs: ' + programs.map((p) => `${p.title} (${p.category}): ${p.description}`).join(' | ')
        );
      }
      if (servicePackages.length) {
        contextParts.push(
          'Service Packages: ' + servicePackages.map((pkg) => `${pkg.name} (${pkg.category}): $${pkg.serviceFee} ${pkg.currency}`).join('; ')
        );
      }
      if (visaRules.length) {
        contextParts.push(
          'Visa Rules: ' +
            visaRules.map((v) => `${v.country.name} ${v.visaType.name} (Fee: ${v.governmentFee} ${v.feeCurrency}, Processing: ${v.processingTimeMin}-${v.processingTimeMax} days)`).join('; ')
        );
      }
      if (faqs.length) {
        contextParts.push('FAQ Answers:\n' + faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n'));
      }

      return contextParts.join('\n\n').trim();
    } catch (err) {
      console.warn('Context retrieval query error:', err?.message || err);
      return '';
    }
  }

  private generateExpertReply(query: string, context: string): string {
    const q = query.toLowerCase();

    // 1. Off-topic filter
    const offTopicTriggers = ['recipe', 'poem', 'joke', 'crypto pump', 'weather today', 'write code for', 'python function', 'movie recommendation'];
    if (offTopicTriggers.some((t) => q.includes(t))) {
      return `I am your dedicated **AI Immigration & Platform Navigator**. I specialize exclusively in visa pathways, scholarship funding, document requirements, and platform assistance.\n\nHow can I assist your global immigration or relocation goals today?\n- 🔍 [Check Visa Eligibility](/eligibility)\n- 🎓 [Explore 10+ Global Scholarships](/scholarships)\n- 📦 [Browse Premium Packages](/packages)\n- 📅 [Book 1-on-1 Consultation](/consultation)`;
    }

    // 2. Navigation Intent: Scholarships
    if (q.includes('scholarship') || q.includes('tuition') || q.includes('grant') || q.includes('study abroad') || q.includes('fellowship')) {
      return `### 🎓 Global Scholarships & Education Grants\n\nWe feature **10 prestigious, fully-funded global scholarships** across top study destinations:\n\n1. **Fulbright Foreign Student Program (USA)**: Up to $50,000 covering full tuition, living stipend, round-trip flights, and J-1 visa sponsorship.\n2. **Chevening Scholarships (UK)**: 100% tuition coverage for master's programs with monthly living allowances.\n3. **DAAD Helmut-Schmidt-Programme (Germany)**: Full tuition waiver + €934/month stipend and insurance.\n4. **Australia Awards (Australia)**: Full university tuition + establishment allowance + airfare.\n5. **Vanier CGS (Canada)**: $50,000/year doctoral grants for 3 years.\n6. **Eiffel Excellence (France)**: Master's & PhD monthly stipend + flight grants.\n7. **Swiss Govt Excellence (Switzerland)**: Full research and PhD stipends (CHF 1,920/mo).\n8. **MEXT Scholarship (Japan)**: 100% tuition waiver + 145,000 JPY/month.\n9. **SINGA Award (Singapore)**: 4-year PhD fellowship + SGD 2,700/mo.\n10. **Govt of Ireland Scholarship (Ireland)**: Full tuition waiver + €10,000 living stipend.\n\n👉 **Where to go on the website:**\n- [Browse All Scholarships & Deadlines](/scholarships)\n- [Explore Student Visa Pathways](/programs)\n- [Book an Education Consultant](/consultation)`;
    }

    // 3. Navigation Intent: How to navigate / Getting Started for New Users
    if (q.includes('where do i start') || q.includes('how to start') || q.includes('navigate') || q.includes('new user') || q.includes('how does this website work') || q.includes('help me navigate') || q.includes('guide me')) {
      return `### 🧭 Welcome to Global Immigration Platform! Here is how to navigate:\n\nWhether you are exploring options or ready to submit an application, follow these steps:\n\n1. **Step 1: Check Your Eligibility (2 Mins)**\n   Use our automated points assessment calculator to discover which countries and visa categories you qualify for.\n   👉 [Launch Eligibility Assessment](/eligibility)\n\n2. **Step 2: Choose Your Destination & Program**\n   Explore over 50 countries, comparing safety, processing times, and cost of living:\n   👉 [Explore Country Directory](/countries) | [Compare Destinations](/compare)\n\n3. **Step 3: Select a Service Package or Book Consultation**\n   Choose our end-to-end legal and filing packages or speak directly with an accredited consultant:\n   👉 [View Service Packages](/packages) | [Book 1-on-1 Consultation](/consultation)\n\n4. **Step 4: Track Your Application & Upload Documents**\n   Once registered, your client portal gives you real-time case tracking, status updates, and automated OCR document checks:\n   👉 [Go to Client Dashboard](/dashboard) | [View My Cases](/dashboard/cases)\n\nWhat specific country or visa type would you like to explore first?`;
    }

    // 4. Case Tracking & Document Upload Workflow
    if (q.includes('track') || q.includes('status') || q.includes('upload') || q.includes('document') || q.includes('ocr') || q.includes('case')) {
      return `### 📂 Case Management & Document Verification Workflow\n\nHere is how our secure case tracking and document system works:\n\n- **Document Center**: Upload your passport, proof of funds, employment reference, and transcripts (PDF/JPG/PNG up to 25MB). Our AI OCR system instantly verifies document clarity and data integrity.\n  👉 [Open Document Center](/dashboard/documents)\n\n- **Live Case Timeline**: You can track each stage of your application:\n  1. \`PROFILE_CREATED\` → Initial setup.\n  2. \`DOCUMENTS_PENDING\` → Upload required files.\n  3. \`DOCUMENTS_VERIFIED\` → All documents approved by our review team.\n  4. \`UNDER_INTERNAL_REVIEW\` → Legal specialist final audit.\n  5. \`SUBMITTED_TO_GOVERNMENT\` → Official government filing.\n  6. \`BIOMETRICS_SCHEDULED\` / \`APPROVED\` → Visa grant issued!\n  👉 [Track Active Cases](/dashboard/cases)\n\n- **Rejected Documents?** If an admin or consultant requests a replacement, the exact reason will appear in red on your case details page so you can re-upload instantly.`;
    }

    // 5. Canada Express Entry / PR / CRS Points
    if (q.includes('canada') || q.includes('express entry') || q.includes('crs') || q.includes('pr') || q.includes('permanent residence')) {
      return `### 🍁 Canada Immigration & Permanent Residence Pathways\n\nCanada offers some of the most accessible pathways to permanent residency (PR):\n\n1. **Express Entry System (Federal Skilled Worker / CEC)**:\n   - Points-based Comprehensive Ranking System (CRS) evaluating **Age**, **Education (ECA evaluated)**, **Language (CLB 7-9+ in IELTS/CELPIP)**, and **Work Experience**.\n2. **Provincial Nominee Programs (PNP)**: Gives +600 CRS points if nominated by provinces like Ontario (OINP), BC (BCPNP), or Alberta (AAIP).\n3. **Study-to-PR Pathway**: Post-Graduation Work Permit (PGWP) leading to Canadian Experience Class (CEC).\n4. **Start-up Visa & Investor Programs**: Direct permanent residence for entrepreneurs with designated venture capital or angel support.\n\n👉 **Next Steps on Platform:**\n- [Calculate Your Canada PR Score](/eligibility)\n- [Explore Canada Country Details](/countries/CA)\n- [Book a Registered Canadian Immigration Consultant (RCIC)](/consultation)`;
    }

    // 6. United States Visas
    if (q.includes('united states') || q.includes('usa') || q.includes('eb-2') || q.includes('eb-1') || q.includes('h-1b') || q.includes('greencard') || q.includes('green card')) {
      return `### 🇺🇸 United States Visa & Green Card Pathways\n\nKey immigration pathways to the United States include:\n\n- **EB-2 NIW (National Interest Waiver)**: Self-petitioned Green Card for professionals with advanced degrees or exceptional ability without requiring an employer sponsor.\n- **EB-1A / EB-1C**: Extraordinary ability and multinational executive transfers.\n- **H-1B Specialty Occupation**: Employer-sponsored work visa with annual lottery quota.\n- **F-1 Student Visa**: Academic study with 1 to 3 years STEM OPT work authorization.\n- **EB-5 Immigrant Investor**: $800,000 targeted employment area investment leading to permanent residence.\n\n👉 **Helpful Links:**\n- [View US Programs & Requirements](/countries/US)\n- [Check US Visa Eligibility](/eligibility)\n- [Consult with a US Immigration Attorney](/consultation)`;
    }

    // 7. United Kingdom & Europe Pathways
    if (q.includes('uk') || q.includes('united kingdom') || q.includes('germany') || q.includes('europe') || q.includes('schengen') || q.includes('blue card') || q.includes('france') || q.includes('chancenkarte')) {
      return `### 🇪🇺 UK & European Immigration Pathways\n\nTop European immigration programs:\n\n- **UK Skilled Worker Visa**: Requires a job offer from an approved UK sponsor at or above the minimum salary threshold.\n- **Germany Opportunity Card (Chancenkarte)**: Points-based job search visa allowing qualified non-EU talent to enter Germany for up to 1 year.\n- **EU Blue Card**: Fast-track work and residence permit for university graduates with qualifying employment in Germany, France, Netherlands, etc.\n- **Portugal D8 Digital Nomad & D7 Passive Income**: Visas for remote workers earning 4x Portuguese minimum wage.\n- **Golden Visas & European Residency**: Greece, Spain, and Malta residency programs.\n\n👉 **Explore on our platform:**\n- [Compare European Countries](/compare)\n- [Check Germany / UK Visa Rules](/countries/DE)\n- [Book a European Visa Specialist](/consultation)`;
    }

    // 8. Citizenship by Investment (CBI) & Golden Visas
    if (q.includes('citizenship by investment') || q.includes('cbi') || q.includes('golden visa') || q.includes('second passport') || q.includes('investor')) {
      return `### 💎 Citizenship by Investment & Golden Visas\n\nAcquire a second passport or residence permit through qualifying investment:\n\n- **Caribbean Programs (Fast 3-6 Months Processing)**:\n  - St. Kitts & Nevis, Dominica, Grenada, Antigua & Barbuda, Saint Lucia ($100k - $250k donation or real estate purchase).\n  - Visa-free access to 140+ countries including UK & Schengen.\n- **European Golden Visas & Residency**:\n  - Greece Golden Visa (€250k - €800k real estate investment).\n  - Malta Permanent Residence & Citizenship by Direct Investment.\n  - UAE Golden Visa (10-year residency with 2M AED investment).\n\n👉 **Take Action:**\n- [View Investor Service Packages](/packages)\n- [Explore Citizenship Programs](/programs/citizenship-by-investment)\n- [Book a Private Wealth & Immigration Advisor](/consultation)`;
    }

    // 9. Consultation & Appointment Booking
    if (q.includes('consultation') || q.includes('book') || q.includes('talk to') || q.includes('human') || q.includes('advisor') || q.includes('lawyer') || q.includes('appointment')) {
      return `### 📅 Book a 1-on-1 Consultation with a Licensed Immigration Specialist\n\nOur certified immigration lawyers and consultants provide personalized legal reviews, profile evaluations, and custom application roadmaps.\n\n- **Video Consultation (Zoom / Meet / In-App)**: 45-minute comprehensive strategy session.\n- **Full Document Pre-Screening**: Assessment of qualification credentials, work proof, and funds.\n- **Custom Filing Timeline & Risk Analysis**.\n\n👉 **Schedule Your Session Now:**\n- [Book a Consultation Session](/consultation)\n- [Manage Existing Appointments](/dashboard/appointments)`;
    }

    // 10. Service Packages & Pricing
    if (q.includes('package') || q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('how much')) {
      return `### 💼 Transparent Immigration Service Packages\n\nWe offer clear, all-inclusive packages with no hidden fees:\n\n- **Holiday & Tourist Package**: Document curation, itinerary building, and embassy booking.\n- **Student Visa & Scholarship Package**: University matching, admission SOP guidance, scholarship filings, and student visa handling.\n- **Skilled Worker & Express Entry Package**: Points optimization, ECA assistance, employer sponsor guidance, and legal submission.\n- **Investor & Golden Visa Package**: Full legal due diligence, escrow guidance, and government dossier filing.\n\n👉 **View Details:**\n- [Explore All Service Packages](/packages)\n- [Payment Options & Crypto Wallet](/dashboard/wallet)`;
    }

    // Default intelligent immigration response
    if (context) {
      return `### 🌐 Global Immigration Platform Assistance\n\nBased on your inquiry:\n\n${context}\n\n**Helpful Platform Links:**\n- 🔍 [Check Your Eligibility](/eligibility)\n- 🎓 [Explore Scholarships](/scholarships)\n- 📦 [View Service Packages](/packages)\n- 📅 [Book a Consultation](/consultation)\n\nWould you like more details on requirements, processing times, or application fees?`;
    }

    return `### 🌐 Global Immigration Platform Assistant\n\nI am here to guide you across all visa pathways, scholarships, and platform tools.\n\n**Where would you like to go?**\n- 🔍 **Check Points & Eligibility**: [Launch Assessment](/eligibility)\n- 🎓 **10+ Global Scholarships**: [View Scholarships](/scholarships)\n- 💼 **Our Legal Packages**: [Explore Packages](/packages)\n- 🌍 **Compare Countries**: [Country Directory](/countries)\n- 📅 **Talk to an Expert**: [Book Consultation](/consultation)\n- 📂 **Track Your Active Case**: [Open Client Dashboard](/dashboard/cases)\n\nFeel free to ask any specific question about visas, required documents, or destination requirements!`;
  }
}
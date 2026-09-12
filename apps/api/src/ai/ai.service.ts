import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HfInference } from '@huggingface/inference';
import type { Response } from 'express';

export interface ChatMetadata {
  sessionId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

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
    metadata?: ChatMetadata,
  ) {
    const trimmedMsg = message?.trim() || '';
    if (!trimmedMsg) {
      return {
        reply: 'Hello! I am your AI Immigration & Platform Navigator for Global Citizens Solution. How can I assist you with visa pathways, global scholarships, or website navigation today?',
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

    const systemPrompt = `You are the Global Immigration Concierge for Global Citizens Solution (https://globalcitizenssolution.com).

CORE PERSONALITY & TONE:
- Name: Global Immigration Concierge
- Tone: Professional, Calm, Helpful, Intelligent, Concise, Friendly, Trustworthy.
- Style: Experienced immigration information assistant. Sound natural, articulate, and supportive, never robotic.
- Integrity & Compliance: NEVER make exaggerated promises or guarantee visa approvals (never say "Don't worry, you'll definitely get approved" or similar). Instead state: "Based on the information you've provided, you may meet some of the general eligibility criteria. A formal assessment is recommended before proceeding."

Your primary role is to:
1. Help both guests and registered clients navigate the entire website with clickable markdown links.
2. Answer detailed questions about visas (Express Entry, Work Permits, Student Visas, Golden Visas, Citizenship by Investment, Digital Nomad Visas).
3. Guide users on scholarship applications, required documentation, OCR checks, and case progress workflows.
4. If a user states they do not have an account or are new, explain both guest exploration features and the benefits of creating a free account.
5. If a question is outside immigration, global education, visas, or platform navigation, politely decline and refocus on immigration services.
6. Do not include emojis in your responses. Keep the tone executive, professional, and clear.

KEY PLATFORM NAVIGATION ROUTES:
- Create Free Account: [Create Account](/register)
- Sign In to Account: [Sign In](/login)
- Check Visa Eligibility & Points: [Eligibility Assessment](/eligibility)
- Global Scholarships Directory: [Browse Scholarships](/scholarships)
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

Provide a structured, helpful, and thorough response. Use bolding, bullet points, and markdown links where helpful. Do not use emojis.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: trimmedMsg },
    ];

    let finalReply = '';

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
          finalReply = this.cleanEmojis(cleaned);
        }
      }
    } catch (error) {
      console.warn('Hugging Face inference fallback to built-in expert intelligence engine:', error?.message || error);
    }

    if (!finalReply) {
      finalReply = this.generateExpertReply(trimmedMsg, context);
    }

    // Persist conversation log in database for admin monitoring
    await this.logConversation(trimmedMsg, finalReply, metadata);

    return { reply: finalReply, contextUsed: !!context };
  }

  async streamChat(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    language: string,
    res: Response,
    metadata?: ChatMetadata,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const full = await this.chat(message, history, language, metadata);
    const words = full.reply.split(' ');

    for (const word of words) {
      res.write(`data: ${JSON.stringify({ word })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  }

  private cleanEmojis(text: string): string {
    return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}-\u{23E8}]/gu, '').replace(/\s+/g, ' ');
  }

  private detectIntent(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('no account') || q.includes('dont have an account') || q.includes("don't have an account") || q.includes('guest') || q.includes('sign up') || q.includes('register') || q.includes('new user') || q.includes('how to start') || q.includes('where to start')) {
      return 'ACCOUNT_ONBOARDING';
    }
    if (q.includes('scholarship') || q.includes('tuition') || q.includes('grant') || q.includes('study abroad') || q.includes('fellowship')) {
      return 'SCHOLARSHIPS';
    }
    if (q.includes('canada') || q.includes('express entry') || q.includes('crs') || q.includes('pr') || q.includes('permanent residence')) {
      return 'CANADA_PR';
    }
    if (q.includes('usa') || q.includes('united states') || q.includes('eb-2') || q.includes('eb-1') || q.includes('h-1b') || q.includes('green card')) {
      return 'USA_IMMIGRATION';
    }
    if (q.includes('cbi') || q.includes('citizenship by investment') || q.includes('golden visa') || q.includes('caribbean') || q.includes('malta')) {
      return 'CBI_GOLDEN_VISA';
    }
    if (q.includes('uk') || q.includes('germany') || q.includes('chancenkarte') || q.includes('europe') || q.includes('blue card')) {
      return 'EUROPE_IMMIGRATION';
    }
    if (q.includes('consultation') || q.includes('appointment') || q.includes('advisor') || q.includes('lawyer')) {
      return 'CONSULTATION_BOOKING';
    }
    if (q.includes('track') || q.includes('status') || q.includes('upload') || q.includes('document') || q.includes('case')) {
      return 'CASE_DOCUMENT_WORKFLOW';
    }
    if (q.includes('package') || q.includes('price') || q.includes('fee') || q.includes('cost')) {
      return 'PACKAGES_PRICING';
    }
    return 'GENERAL_INQUIRY';
  }

  private async logConversation(question: string, response: string, metadata?: ChatMetadata) {
    try {
      if (this.prisma.aiChatLog) {
        await this.prisma.aiChatLog.create({
          data: {
            sessionId: metadata?.sessionId || 'guest-session',
            userId: metadata?.userId || null,
            userName: metadata?.userName || (metadata?.userId ? 'Registered Client' : 'Guest Visitor'),
            userEmail: metadata?.userEmail || null,
            question,
            response,
            intent: this.detectIntent(question),
            ipAddress: metadata?.ipAddress || null,
            userAgent: metadata?.userAgent || null,
          },
        });
      }
    } catch (err) {
      console.warn('Could not persist AI chat record:', err?.message || err);
    }
  }

  // Admin Monitoring Methods
  async getChatLogs(page = 1, limit = 20, search = '', userType = 'all') {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { response: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
        { sessionId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (userType === 'registered') {
      where.userId = { not: null };
    } else if (userType === 'guest') {
      where.userId = null;
    }

    const [items, total] = await Promise.all([
      this.prisma.aiChatLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } } },
      }),
      this.prisma.aiChatLog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getChatSessions(page = 1, limit = 20, search = '') {
    const logs = await this.prisma.aiChatLog.findMany({
      where: search
        ? {
            OR: [
              { question: { contains: search, mode: 'insensitive' } },
              { response: { contains: search, mode: 'insensitive' } },
              { userName: { contains: search, mode: 'insensitive' } },
              { userEmail: { contains: search, mode: 'insensitive' } },
              { sessionId: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const sessionsMap = new Map<string, {
      sessionId: string;
      userId: string | null;
      userName: string;
      userEmail: string | null;
      messageCount: number;
      lastQuestion: string;
      lastResponse: string;
      lastActive: Date;
    }>();

    for (const log of logs) {
      if (!sessionsMap.has(log.sessionId)) {
        sessionsMap.set(log.sessionId, {
          sessionId: log.sessionId,
          userId: log.userId,
          userName: log.userName || (log.userId ? 'Registered Client' : 'Guest Visitor'),
          userEmail: log.userEmail,
          messageCount: 1,
          lastQuestion: log.question,
          lastResponse: log.response,
          lastActive: log.createdAt,
        });
      } else {
        const entry = sessionsMap.get(log.sessionId)!;
        entry.messageCount += 1;
      }
    }

    const allSessions = Array.from(sessionsMap.values());
    const startIndex = (page - 1) * limit;
    const paginated = allSessions.slice(startIndex, startIndex + limit);

    return {
      sessions: paginated,
      total: allSessions.length,
      page,
      totalPages: Math.ceil(allSessions.length / limit),
    };
  }

  async getSessionHistory(sessionId: string) {
    return this.prisma.aiChatLog.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } } },
    });
  }

  async deleteChatLog(id: string) {
    return this.prisma.aiChatLog.delete({ where: { id } });
  }

  async deleteSessionLogs(sessionId: string) {
    return this.prisma.aiChatLog.deleteMany({ where: { sessionId } });
  }

  async getChatStats() {
    const [totalMessages, registeredCount, guestCount, todayCount] = await Promise.all([
      this.prisma.aiChatLog.count(),
      this.prisma.aiChatLog.count({ where: { userId: { not: null } } }),
      this.prisma.aiChatLog.count({ where: { userId: null } }),
      this.prisma.aiChatLog.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

    return {
      totalMessages,
      registeredCount,
      guestCount,
      todayCount,
    };
  }

  private async retrieveContext(query: string): Promise<string> {
    const rawTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
    if (!rawTokens.length) return '';

    try {
      const [countries, faqs, programs, scholarships, visaRules, servicePackages] = await Promise.all([
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
        this.prisma.faq.findMany({
          where: {
            OR: rawTokens.slice(0, 3).map((token) => ({
              OR: [
                { question: { contains: token, mode: 'insensitive' } },
                { answer: { contains: token, mode: 'insensitive' } },
              ],
            })),
          },
          take: 2,
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
      return `I am your dedicated AI Immigration & Platform Navigator for Global Citizens Solution. I specialize exclusively in visa pathways, citizenship by investment, global scholarship funding, document requirements, and platform navigation.\n\nHow can I assist your global immigration or relocation goals today?\n- [Check Visa Eligibility](/eligibility)\n- [Explore 10+ Global Scholarships](/scholarships)\n- [Browse Service Packages](/packages)\n- [Book 1-on-1 Consultation](/consultation)`;
    }

    // 1A. Platform Operations: How to Sign In / Login
    if (q.includes('how can i sign in') || q.includes('how do i sign in') || q.includes('how to sign in') || q.includes('how to login') || q.includes('how do i login') || q.includes('sign in steps') || q.includes('login to my account')) {
      return `### How to Sign In to Your Account

To access your Global Citizens Solution client dashboard:

1. Click on **[Sign In](/login)** in the top navigation bar or go directly to: [Sign In Page](/login).
2. Enter your registered **Email Address** and **Password**.
3. If you have enabled Two-Factor Authentication (2FA), enter the 6-digit code from your authenticator app (Google Authenticator / Authy).
4. Click **Sign In** to access your active cases, document vault, consultation appointments, and wallet.

**Forgot your password?**
- You can reset your password anytime by clicking [Forgot Password](/forgot-password).
- Don't have an account yet? [Create a Free Account](/register).`;
    }

    // 1B. Platform Operations: How to Register / Create Account
    if (q.includes('how do i register') || q.includes('how to register') || q.includes('how can i register') || q.includes('create account') || q.includes('how to sign up') || q.includes('how do i sign up') || q.includes('register account')) {
      return `### How to Create Your Account

Creating an account gives you full access to our case management portal and legal team:

1. Click on **[Register](/register)** in the top navigation or go to: [Create Account](/register).
2. Enter your **First Name**, **Last Name**, **Email Address**, and a secure password.
3. Click **Create Account**. A 6-digit verification code will be sent to your email.
4. Enter the verification code at [Verify Email](/verify-email) to activate your account.
5. Once verified, you can immediately begin an application, upload documents for AI OCR review, and book strategy sessions.

**Direct Link:** [Register Now for Free](/register)`;
    }

    // 1C. Platform Operations: How to Upload Documents
    if (q.includes('upload document') || q.includes('how do i upload') || q.includes('how to upload') || q.includes('uploading document') || q.includes('submit document') || q.includes('document upload')) {
      return `### How to Upload Documents for Verification

Our platform uses an encrypted Document Vault with automated AI OCR quality checks:

1. **Sign in** to your account and navigate to the **[Document Center](/dashboard/documents)**.
2. Select your application category (e.g., *Passport & Identity*, *Proof of Funds*, *Academic Transcripts*, *Employment Letters*, *Police Clearance*).
3. Drag and drop your file or click **Browse Files**.
   - **Supported formats**: PDF, JPG, PNG, WebP.
   - **Maximum file size**: Up to 25 MB per document.
4. Click **Upload & Scan**. Our AI OCR system will immediately verify document legibility and index key information.
5. Your assigned immigration consultant will review and approve the document within 24–48 hours.

**Direct Link:** [Go to Document Center](/dashboard/documents)`;
    }

    // 1D. Platform Operations: How to Deposit Funds / Make Payments
    if (q.includes('how do i deposit') || q.includes('how to deposit') || q.includes('how to pay') || q.includes('how do i pay') || q.includes('deposit funds') || q.includes('make payment') || q.includes('payment method') || q.includes('wire transfer') || q.includes('crypto deposit')) {
      return `### How to Deposit Funds & Make Payments

Global Citizens Solution supports three secure, tier-1 payment rails protected by institutional escrow:

1. **Credit / Debit Card**:
   - Instant processing via Stripe / PCI-DSS Level 1 compliant gateway.
   - Ideal for consultation bookings and initial retainer deposits.

2. **Bank Wire Transfer (SWIFT / IBAN / SEPA)**:
   - Go to your **[Billing & Wallet](/dashboard/wallet)**.
   - Generate official bank wire transfer instructions with your unique client reference ID.
   - Upload your bank transfer receipt slip for priority verification within 1–2 business days.

3. **Cryptocurrency Escrow (BTC, ETH, USDT, USDC)**:
   - Select Crypto at checkout or in your wallet to generate a dedicated single-use escrow address with a 30-minute confirmation timer.
   - Automatically credited upon blockchain confirmation.

**Direct Link:** [Manage Billing & Deposits](/dashboard/wallet)`;
    }

    // 1E. Platform Operations: How to Track Investment Program Spending
    if (q.includes('investment tracker') || q.includes('track how much') || q.includes('investment spending') || q.includes('track investment') || q.includes('track spend') || q.includes('golden visa cost') || q.includes('cbi cost') || q.includes('investment calculator')) {
      return `### How to Track & Calculate Investment Program Spending

We provide an interactive **Investment Program Capital & Expense Tracker** that breaks down every fee tranche before and during your application:

1. **Pre-Application Cost Breakdown**:
   - Use our [Citizenship by Investment Guide](/programs/citizenship-by-investment) to calculate total outlay across:
     - **Qualifying Capital Investment**: (e.g., Portugal Fund €500k, Caribbean CBI $100k–$200k, Malta, Greece €250k–€800k).
     - **Government Due Diligence & Application Fees**.
     - **Family Member Add-on Surcharges** (Spouse, Children, Dependent Parents).
     - **Legal, Escrow & Processing Fees**.

2. **Live Milestone & Escrow Tracking for Active Clients**:
   - From your **[Client Wallet](/dashboard/wallet)** and **[Case Workspace](/dashboard/workspace)**, you can view:
     - **Total Committed Capital**.
     - **Amount Funded & Held in Escrow**.
     - **Milestone Releases** (released strictly upon government approval stages).
     - **Itemized Fee Receipts & Exportable Financial Statements**.

**Direct Links:**
- [Interactive Investment Cost Tracker](/programs/citizenship-by-investment)
- [Manage Investment Wallet & Escrow](/dashboard/wallet)`;
    }

    // 2. Specialized Intent: "I don't have an account" / New Guest Visitor Walkthrough
    if (
      q.includes('dont have an account') ||
      q.includes("don't have an account") ||
      q.includes('no account') ||
      q.includes('not registered') ||
      q.includes('guest') ||
      q.includes('im new') ||
      q.includes("i'm new") ||
      q.includes('how to start') ||
      q.includes('where to start') ||
      q.includes('new user') ||
      q.includes('first time') ||
      q.includes('how do i sign up')
    ) {
      return `### Welcome to Global Citizens Solution

You do not need an account to start exploring our platform. You can immediately access many of our core features as a guest:

**1. What You Can Do Right Now as a Guest:**
- **Free Points & Eligibility Assessment**: Run an instant evaluation to discover your qualifying score for Canada, the UK, Germany, and Australia: [Check Eligibility](/eligibility)
- **Explore 10+ Ongoing Global Scholarships**: Browse fully-funded undergraduate, master's, and doctoral scholarships with active deadlines and grant amounts: [Browse Scholarships](/scholarships)
- **Explore 50+ Countries & Programs**: Compare living costs, processing times, safety ratings, and visa categories: [Country Directory](/countries) | [Compare Countries](/compare)
- **Review Service Packages**: Compare our professional consultation and legal filing tiers: [View Service Packages](/packages)

**2. Benefits of Creating a Free Account:**
When you are ready to proceed with your application, creating a free account unlocks your dedicated Client Portal:
- **End-to-End Case Management**: Track every stage from document compilation to official government visa issuance in real-time.
- **Secure Encrypted Document Vault**: Upload passports, transcripts, and proofs of funds with automated AI OCR verification.
- **Private 1-on-1 Strategy Consultations**: Schedule direct sessions with licensed RCIC consultants and immigration lawyers: [Book Consultation](/consultation)
- **Direct Messaging**: Communicate directly with your assigned case officer and receive milestone notifications.

**Quick Navigation Links:**
- [Create Free Account](/register)
- [Sign In to Existing Account](/login)
- [Check Points & Visa Eligibility](/eligibility)
- [Explore 10+ Global Scholarships](/scholarships)
- [Book a 1-on-1 Consultation](/consultation)

What specific country or visa program would you like to explore today?`;
    }

    // 3. Navigation Intent: Scholarships
    if (q.includes('scholarship') || q.includes('tuition') || q.includes('grant') || q.includes('study abroad') || q.includes('fellowship')) {
      return `### Global Scholarships & Education Grants

Global Citizens Solution features 10 prestigious, fully-funded global scholarships across top study destinations:

1. **Fulbright Foreign Student Program (USA)**: Up to $50,000 covering full tuition, living stipend, round-trip flights, and J-1 visa sponsorship.
2. **Chevening Scholarships (UK)**: 100% tuition coverage for master's programs with monthly living allowances.
3. **DAAD Helmut-Schmidt-Programme (Germany)**: Full tuition waiver + €934/month stipend and insurance.
4. **Australia Awards (Australia)**: Full university tuition + establishment allowance + airfare.
5. **Vanier CGS (Canada)**: $50,000/year doctoral grants for 3 years.
6. **Eiffel Excellence (France)**: Master's & PhD monthly stipend + flight grants.
7. **Swiss Govt Excellence (Switzerland)**: Full research and PhD stipends (CHF 1,920/mo).
8. **MEXT Scholarship (Japan)**: 100% tuition waiver + 145,000 JPY/month.
9. **SINGA Award (Singapore)**: 4-year PhD fellowship + SGD 2,700/mo.
10. **Govt of Ireland Scholarship (Ireland)**: Full tuition waiver + €10,000 living stipend.

**Where to go on the website:**
- [Browse All Scholarships & Deadlines](/scholarships)
- [Explore Student Visa Pathways](/programs)
- [Book an Education Consultant](/consultation)`;
    }

    // 4. Case Tracking & Document Upload Workflow
    if (q.includes('track') || q.includes('status') || q.includes('upload') || q.includes('document') || q.includes('ocr') || q.includes('case')) {
      return `### Case Management & Document Verification Workflow

Here is how our secure case tracking and document system works:

- **Document Center**: Upload your passport, proof of funds, employment reference, and transcripts (PDF/JPG/PNG up to 25MB). Our AI OCR system instantly verifies document clarity and data integrity.
  [Open Document Center](/dashboard/documents)

- **Live Case Timeline**: You can track each stage of your application:
  1. PROFILE_CREATED - Initial setup.
  2. DOCUMENTS_PENDING - Upload required files.
  3. DOCUMENTS_VERIFIED - All documents approved by our review team.
  4. UNDER_INTERNAL_REVIEW - Legal specialist final audit.
  5. SUBMITTED_TO_GOVERNMENT - Official government filing.
  6. BIOMETRICS_SCHEDULED / APPROVED - Visa grant issued.
  [Track Active Cases](/dashboard/cases)

- **Rejected Documents**: If an admin or consultant requests a replacement, the exact reason will appear in red on your case details page so you can re-upload instantly.`;
    }

    // 5. Canada Express Entry / PR / CRS Points
    if (q.includes('canada') || q.includes('express entry') || q.includes('crs') || q.includes('pr') || q.includes('permanent residence')) {
      return `### Canada Immigration & Permanent Residence Pathways

Canada offers some of the most accessible pathways to permanent residency (PR):

1. **Express Entry System (Federal Skilled Worker / CEC)**:
   - Points-based Comprehensive Ranking System (CRS) evaluating Age, Education (ECA evaluated), Language (CLB 7-9+ in IELTS/CELPIP), and Work Experience.
2. **Provincial Nominee Programs (PNP)**: Gives +600 CRS points if nominated by provinces like Ontario (OINP), BC (BCPNP), or Alberta (AAIP).
3. **Study-to-PR Pathway**: Post-Graduation Work Permit (PGWP) leading to Canadian Experience Class (CEC).
4. **Start-up Visa & Investor Programs**: Direct permanent residence for entrepreneurs with designated venture capital or angel support.

**Next Steps on Platform:**
- [Calculate Your Canada PR Score](/eligibility)
- [Explore Canada Country Details](/countries/CA)
- [Book a Registered Canadian Immigration Consultant (RCIC)](/consultation)`;
    }

    // 6. United States Visas
    if (q.includes('united states') || q.includes('usa') || q.includes('eb-2') || q.includes('eb-1') || q.includes('h-1b') || q.includes('greencard') || q.includes('green card')) {
      return `### United States Visa & Green Card Pathways

Key immigration pathways to the United States include:

- **EB-2 NIW (National Interest Waiver)**: Self-petitioned Green Card for professionals with advanced degrees or exceptional ability without requiring an employer sponsor.
- **EB-1A / EB-1C**: Extraordinary ability and multinational executive transfers.
- **H-1B Specialty Occupation**: Employer-sponsored work visa with annual lottery quota.
- **F-1 Student Visa**: Academic study with 1 to 3 years STEM OPT work authorization.
- **EB-5 Immigrant Investor**: $800,000 targeted employment area investment leading to permanent residence.

**Helpful Links:**
- [View US Programs & Requirements](/countries/US)
- [Check US Visa Eligibility](/eligibility)
- [Consult with a US Immigration Attorney](/consultation)`;
    }

    // 7. United Kingdom & Europe Pathways
    if (q.includes('uk') || q.includes('united kingdom') || q.includes('germany') || q.includes('europe') || q.includes('schengen') || q.includes('blue card') || q.includes('france') || q.includes('chancenkarte')) {
      return `### UK & European Immigration Pathways

Top European immigration programs:

- **UK Skilled Worker Visa**: Requires a job offer from an approved UK sponsor at or above the minimum salary threshold.
- **Germany Opportunity Card (Chancenkarte)**: Points-based job search visa allowing qualified non-EU talent to enter Germany for up to 1 year.
- **EU Blue Card**: Fast-track work and residence permit for university graduates with qualifying employment in Germany, France, Netherlands, etc.
- **Portugal D8 Digital Nomad & D7 Passive Income**: Visas for remote workers earning 4x Portuguese minimum wage.
- **Golden Visas & European Residency**: Greece, Spain, and Malta residency programs.

**Explore on our platform:**
- [Compare European Countries](/compare)
- [Check Germany / UK Visa Rules](/countries/DE)
- [Book a European Visa Specialist](/consultation)`;
    }

    // 8. Citizenship by Investment (CBI) & Golden Visas
    if (q.includes('citizenship by investment') || q.includes('cbi') || q.includes('golden visa') || q.includes('second passport') || q.includes('investor')) {
      return `### Citizenship by Investment & Golden Visas

Acquire a second passport or residence permit through qualifying investment:

- **Caribbean Programs (Fast 3-6 Months Processing)**:
  - St. Kitts & Nevis, Dominica, Grenada, Antigua & Barbuda, Saint Lucia ($100k - $250k donation or real estate purchase).
  - Visa-free access to 140+ countries including UK & Schengen.
- **European Golden Visas & Residency**:
  - Greece Golden Visa (€250k - €800k real estate investment).
  - Malta Permanent Residence & Citizenship by Direct Investment.
  - UAE Golden Visa (10-year residency with 2M AED investment).

**Take Action:**
- [View Investor Service Packages](/packages)
- [Explore Citizenship Programs](/programs/citizenship-by-investment)
- [Book a Private Wealth & Immigration Advisor](/consultation)`;
    }

    // 9. Consultation & Appointment Booking
    if (q.includes('consultation') || q.includes('book') || q.includes('talk to') || q.includes('human') || q.includes('advisor') || q.includes('lawyer') || q.includes('appointment')) {
      return `### Book a 1-on-1 Consultation with a Licensed Immigration Specialist

Our certified immigration lawyers and consultants provide personalized legal reviews, profile evaluations, and custom application roadmaps.

- **Video Consultation (Zoom / Meet / In-App)**: 45-minute comprehensive strategy session.
- **Full Document Pre-Screening**: Assessment of qualification credentials, work proof, and funds.
- **Custom Filing Timeline & Risk Analysis**.

**Schedule Your Session Now:**
- [Book a Consultation Session](/consultation)
- [Manage Existing Appointments](/dashboard/appointments)`;
    }

    // 10. Service Packages & Pricing
    if (q.includes('package') || q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('how much')) {
      return `### Transparent Immigration Service Packages

We offer clear, all-inclusive packages with no hidden fees:

- **Holiday & Tourist Package**: Document curation, itinerary building, and embassy booking.
- **Student Visa & Scholarship Package**: University matching, admission SOP guidance, scholarship filings, and student visa handling.
- **Skilled Worker & Express Entry Package**: Points optimization, ECA assistance, employer sponsor guidance, and legal submission.
- **Investor & Golden Visa Package**: Full legal due diligence, escrow guidance, and government dossier filing.

**View Details:**
- [Explore All Service Packages](/packages)
- [Payment Options & Crypto Wallet](/dashboard/wallet)`;
    }

    // Default intelligent immigration response
    if (context) {
      return `### Global Citizens Solution Assistance

Based on your inquiry:

${context}

**Helpful Platform Links:**
- [Check Your Eligibility](/eligibility)
- [Explore Scholarships](/scholarships)
- [View Service Packages](/packages)
- [Book a Consultation](/consultation)

Would you like more details on requirements, processing times, or application fees?`;
    }

    return `### Global Citizens Solution Assistant

I am here to guide you across all visa pathways, scholarships, and platform tools.

**Where would you like to go?**
- **Check Points & Eligibility**: [Launch Assessment](/eligibility)
- **10+ Global Scholarships**: [View Scholarships](/scholarships)
- **Our Legal Packages**: [Explore Packages](/packages)
- **Compare Countries**: [Country Directory](/countries)
- **Talk to an Expert**: [Book Consultation](/consultation)
- **Track Your Active Case**: [Open Client Dashboard](/dashboard/cases)

Feel free to ask any specific question about visas, required documents, or destination requirements!`;
  }
}
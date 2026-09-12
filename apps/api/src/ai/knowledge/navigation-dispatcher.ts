import { platformRoutes, websiteKnowledge } from './website-knowledge';

export interface NavigationTarget {
  id: string;
  name: string;
  primaryRoute: string;
  category: 'CORE_PAGES' | 'SERVICES' | 'AUTHENTICATED_PORTAL' | 'LEGAL_INFO';
  keywords: string[];
  description: string;
  directActionTitle: string;
  relatedRoutes: Array<{ label: string; path: string }>;
  suggestedSteps: string[];
}

export const navigationTargets: NavigationTarget[] = [
  {
    id: 'citizenship-programs',
    name: 'Citizenship by Investment & Residency Programs',
    primaryRoute: platformRoutes.cbiPrograms.path,
    category: 'SERVICES',
    keywords: [
      'where do i apply for citizenship',
      'apply for citizenship',
      'where is citizenship',
      'where can i find investment programs',
      'where are investment programs',
      'citizenship by investment page',
      'cbi programs',
      'golden visa page',
      'second passport section',
      'investor programs',
    ],
    description:
      'Explore direct citizenship by investment programs (Caribbean MOA $200k–$250k) and European Golden Visas (Portugal funds, Greece €250k–€800k, Malta MPRP).',
    directActionTitle: 'Explore Citizenship & Investment Programs',
    relatedRoutes: [
      { label: 'All Visa Programs Directory', path: platformRoutes.programs.path },
      { label: 'Compare Golden Visas Side-by-Side', path: platformRoutes.compare.path },
      { label: 'Book Private Investor Consultation', path: platformRoutes.consultation.path },
    ],
    suggestedSteps: [
      'Filter programs by investment type: Donation, Real Estate, or Capital Funds.',
      'Compare processing timelines, visa-free access rankings, and family inclusion rules.',
      'Schedule a confidential private wealth strategy session with our investment advisory team.',
    ],
  },
  {
    id: 'scholarships-directory',
    name: 'Global Scholarships & Education Grants',
    primaryRoute: platformRoutes.scholarships.path,
    category: 'CORE_PAGES',
    keywords: [
      'where can i find scholarships',
      'where are scholarships',
      'find scholarships',
      'scholarship section',
      'scholarships page',
      'education grants',
      'study abroad funding',
      'apply for scholarship',
      'where do i apply for a scholarship',
    ],
    description:
      'Browse 10+ prestigious fully-funded global scholarships (Fulbright, Chevening, DAAD, Australia Awards, Vanier CGS, Eiffel Excellence) with active deadlines and grant amounts ($10,000–$150,000).',
    directActionTitle: 'Browse 10+ Global Scholarships',
    relatedRoutes: [
      { label: 'Student Visa Programs', path: platformRoutes.programs.path },
      { label: 'Student Success Service Package', path: platformRoutes.packages.path },
      { label: 'Book Education Consultant', path: platformRoutes.consultation.path },
    ],
    suggestedSteps: [
      'Filter by study level: Undergraduate, Master’s, or PhD / Doctoral research.',
      'Check eligibility criteria, GPA requirements, and annual deadlines.',
      'Review Statement of Purpose (SOP) guidance and university placement support.',
    ],
  },
  {
    id: 'consultation-booking',
    name: '1-on-1 Strategy Consultation Booking',
    primaryRoute: platformRoutes.consultation.path,
    category: 'SERVICES',
    keywords: [
      'how do i book a consultation',
      'where do i book a consultation',
      'book consultation',
      'schedule consultation',
      'consultation page',
      'book an appointment',
      'speak with a lawyer',
      'talk to an expert',
      'consultation options',
      'where can i book',
    ],
    description:
      'Schedule a private 45-minute video strategy session with a licensed RCIC immigration consultant or international immigration lawyer.',
    directActionTitle: 'Book Your 1-on-1 Consultation',
    relatedRoutes: [
      { label: 'View Service & Legal Packages', path: platformRoutes.packages.path },
      { label: 'Run Free Eligibility Score First', path: platformRoutes.eligibility.path },
      { label: 'Client Appointments Portal', path: platformRoutes.appointments.path },
    ],
    suggestedSteps: [
      'Choose your consultation topic (Skilled PR, Student Visa, Golden Visa, or Inadmissibility / Refusals).',
      'Select your preferred date and time zone.',
      'Confirm booking via institutional credit card or bank escrow to receive your private video link.',
    ],
  },
  {
    id: 'packages-pricing',
    name: 'Service Packages & Legal Filing Tiers',
    primaryRoute: platformRoutes.packages.path,
    category: 'SERVICES',
    keywords: [
      'where are your packages',
      'view packages',
      'service packages',
      'package pricing',
      'how much are your services',
      'what packages do you offer',
      'pricing page',
      'legal packages',
      'all inclusive packages',
    ],
    description:
      'Review our 4 all-inclusive service tiers with upfront transparent pricing: Skilled Worker PR ($3,000), Student Success ($1,200), Family Relocation ($2,500), and Investor CBI Concierge ($5,000).',
    directActionTitle: 'View Service Packages & Pricing',
    relatedRoutes: [
      { label: 'Explore Visa Programs', path: platformRoutes.programs.path },
      { label: 'Book Initial Strategy Session', path: platformRoutes.consultation.path },
      { label: 'Client Wallet & Escrow', path: platformRoutes.wallet.path },
    ],
    suggestedSteps: [
      'Review what each package includes (full dossier preparation, certified translations, legal representation).',
      'Select a package that fits your immigration timeline and goals.',
      'Proceed with secure milestone-based escrow payments.',
    ],
  },
  {
    id: 'eligibility-assessment',
    name: 'Interactive Points & Eligibility Calculator',
    primaryRoute: platformRoutes.eligibility.path,
    category: 'CORE_PAGES',
    keywords: [
      'where can i check eligibility',
      'eligibility calculator',
      'points calculator',
      'crs score calculator',
      'check my points',
      'where do i calculate points',
      'eligibility page',
      'assess my chances',
    ],
    description:
      'Evaluate your CRS points for Canada Express Entry, Australia SkillSelect, Germany Chancenkarte, and UK Skilled Worker eligibility instantly for free.',
    directActionTitle: 'Run Free Eligibility Assessment',
    relatedRoutes: [
      { label: 'Explore Destination Countries', path: platformRoutes.countries.path },
      { label: 'Compare Countries Side-by-Side', path: platformRoutes.compare.path },
      { label: 'Book RCIC Assessment Session', path: platformRoutes.consultation.path },
    ],
    suggestedSteps: [
      'Input your age, highest education degree, work experience years, and language level.',
      'Receive an instant multi-country scoring summary and qualifying tier breakdown.',
      'Explore matching visa programs directly from your assessment results.',
    ],
  },
  {
    id: 'document-center',
    name: 'Encrypted Document Vault & AI OCR Pre-Screening',
    primaryRoute: platformRoutes.documents.path,
    category: 'AUTHENTICATED_PORTAL',
    keywords: [
      'how do i upload documents',
      'where do i upload my documents',
      'upload documents',
      'document center',
      'document vault',
      'ocr check',
      'where to upload files',
      'document upload page',
    ],
    description:
      'Upload passports, academic degrees, police clearances, and bank statements (PDF, JPG, PNG up to 25MB) with automated AI OCR compliance verification.',
    directActionTitle: 'Open Document Center',
    relatedRoutes: [
      { label: 'Client Dashboard Overview', path: platformRoutes.dashboard.path },
      { label: 'Client Case Tracking', path: platformRoutes.cases.path },
      { label: 'Sign In to Access Vault', path: platformRoutes.login.path },
    ],
    suggestedSteps: [
      'Sign in to your client account.',
      'Select the category (Identity, Financial Proof, Education, Employment).',
      'Drag and drop your file to trigger automated AI OCR clarity and date verification.',
    ],
  },
  {
    id: 'case-tracking',
    name: 'Real-Time Case Tracking & Milestone Timeline',
    primaryRoute: platformRoutes.cases.path,
    category: 'AUTHENTICATED_PORTAL',
    keywords: [
      'where can i see my application',
      'where is my application',
      'track my case',
      'case tracking page',
      'application status page',
      'view my case timeline',
      'where to track application',
    ],
    description:
      'Track every stage of your active immigration file from initial document intake and legal specialist review to official government submission and visa grant.',
    directActionTitle: 'Open Client Case Tracking',
    relatedRoutes: [
      { label: 'Document Center', path: platformRoutes.documents.path },
      { label: 'Case Workspace & Notes', path: platformRoutes.workspace.path },
      { label: 'Client Dashboard', path: platformRoutes.dashboard.path },
    ],
    suggestedSteps: [
      'Sign in with your client credentials.',
      'Review your active case milestone badge (e.g., Documents Verified, Submitted to Government).',
      'Read official case notes and milestone updates submitted by your assigned case officer.',
    ],
  },
  {
    id: 'billing-wallet',
    name: 'Multi-Rail Billing, Escrow & Wallet Management',
    primaryRoute: platformRoutes.wallet.path,
    category: 'AUTHENTICATED_PORTAL',
    keywords: [
      'where can i pay',
      'where do i make payment',
      'client wallet',
      'billing page',
      'how to pay invoice',
      'bank transfer instructions',
      'crypto payment page',
      'where is my wallet',
    ],
    description:
      'Manage invoices, fund institutional escrow, generate bank wire reference slips (SWIFT / SEPA), or pay instantly via Stripe credit card and cryptocurrency.',
    directActionTitle: 'Manage Billing & Wallet',
    relatedRoutes: [
      { label: 'View Service Packages', path: platformRoutes.packages.path },
      { label: 'Client Dashboard', path: platformRoutes.dashboard.path },
      { label: 'Sign In to View Wallet', path: platformRoutes.login.path },
    ],
    suggestedSteps: [
      'Access your private wallet dashboard.',
      'Select payment method: Card (Stripe), Bank Wire (Institutional Escrow), or Crypto (USDT/BTC).',
      'Download official tax invoices and transaction receipts with unique client reference IDs.',
    ],
  },
  {
    id: 'countries-directory',
    name: 'Country Directory & Cost of Living Guides',
    primaryRoute: platformRoutes.countries.path,
    category: 'CORE_PAGES',
    keywords: [
      'where can i find country guides',
      'country directory',
      'list of countries',
      'countries page',
      'explore destinations',
      'country guides',
      'destination directory',
    ],
    description:
      'Explore in-depth immigration guides across 50+ countries with live metrics on safety index, living costs, healthcare ratings, and qualifying visa categories.',
    directActionTitle: 'Open Country Directory',
    relatedRoutes: [
      { label: 'Compare Countries Side-by-Side', path: platformRoutes.compare.path },
      { label: 'Explore Visa Programs', path: platformRoutes.programs.path },
      { label: 'Eligibility Assessment', path: platformRoutes.eligibility.path },
    ],
    suggestedSteps: [
      'Select any country card (e.g. Canada, UK, Germany, Australia, Portugal, UAE, Malta).',
      'Review local cost of living, average salary benchmarks, and visa rules.',
      'Use the Compare tool to evaluate two countries simultaneously.',
    ],
  },
  {
    id: 'country-comparison',
    name: 'Side-by-Side Country Comparison Tool',
    primaryRoute: platformRoutes.compare.path,
    category: 'CORE_PAGES',
    keywords: [
      'where can i compare countries',
      'compare countries tool',
      'comparison tool',
      'compare canada vs australia',
      'side by side comparison',
      'compare living costs',
    ],
    description:
      'Compare safety indices, tax rates, living costs, processing speeds, and passport rankings side-by-side between two or more destination countries.',
    directActionTitle: 'Launch Country Comparison Tool',
    relatedRoutes: [
      { label: 'Country Directory', path: platformRoutes.countries.path },
      { label: 'Explore Visa Programs', path: platformRoutes.programs.path },
      { label: 'Run Eligibility Assessment', path: platformRoutes.eligibility.path },
    ],
    suggestedSteps: [
      'Select your first country (e.g., Canada) and second country (e.g., Australia or Germany).',
      'Examine side-by-side metric tables (Healthcare, Tax, Visa fees, Passport strength).',
      'Identify which destination best aligns with your career and lifestyle goals.',
    ],
  },
  {
    id: 'account-auth',
    name: 'Client Account Registration & Sign In',
    primaryRoute: platformRoutes.login.path,
    category: 'CORE_PAGES',
    keywords: [
      'where do i login',
      'where do i sign in',
      'where can i register',
      'create account page',
      'sign up page',
      'forgot password page',
      'reset password',
      'how to sign in',
      'where to log in',
    ],
    description:
      'Sign in to your client account with 2FA security or create a new free account to unlock case tracking and the document vault.',
    directActionTitle: 'Sign In to Client Portal',
    relatedRoutes: [
      { label: 'Create Free Account', path: platformRoutes.register.path },
      { label: 'Reset Forgotten Password', path: platformRoutes.forgotPassword.path },
      { label: 'Platform Home', path: platformRoutes.home.path },
    ],
    suggestedSteps: [
      'Enter your registered email and password.',
      'Complete Two-Factor Authentication (2FA) if enabled.',
      'Access your active cases, consultation records, and document center.',
    ],
  },
  {
    id: 'faq-support',
    name: 'Official FAQ Portal & Support Channels',
    primaryRoute: platformRoutes.faq.path,
    category: 'LEGAL_INFO',
    keywords: [
      'where are faqs',
      'faq page',
      'frequently asked questions',
      'where can i contact support',
      'contact us page',
      'customer service',
      'help desk',
      'official contact',
    ],
    description:
      'Access comprehensive answers to over 80 common immigration questions, or reach our 24/7 client support desk via email and WhatsApp.',
    directActionTitle: 'Open FAQ Knowledge Portal',
    relatedRoutes: [
      { label: 'Contact Us Page', path: platformRoutes.contact.path },
      { label: 'About Global Citizens Solution', path: platformRoutes.about.path },
      { label: 'Book 1-on-1 Strategy Session', path: platformRoutes.consultation.path },
    ],
    suggestedSteps: [
      'Browse FAQs categorized by General PR, Work Visas, Scholarships, and CBI.',
      'Reach our support team directly via email: support@gcsworldwide.org.',
      'Connect on official WhatsApp for immediate concierge support: +1 (256) 585-8538.',
    ],
  },
];

/**
 * Detects if a user query is a website navigation request
 */
export function detectNavigationIntent(query: string): NavigationTarget | null {
  const q = query.toLowerCase().trim();

  for (const target of navigationTargets) {
    if (target.keywords.some((kw) => q.includes(kw) || kw === q)) {
      return target;
    }
  }

  return null;
}

/**
 * Formats a clean, structured navigation response with internal route references
 */
export function formatNavigationResponse(target: NavigationTarget): string {
  const stepsMarkdown = target.suggestedSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
  const relatedMarkdown = target.relatedRoutes.map((r) => `- [${r.label}](${r.path})`).join('\n');

  return `### 📍 Platform Navigation: ${target.name}

${target.description}

---

#### 🚀 **Direct Platform Destination:**
👉 **[${target.directActionTitle}](${target.primaryRoute})**

---

#### 📌 What to Do on This Page:
${stepsMarkdown}

---

#### 🔗 Related Platform Links:
${relatedMarkdown}

*Need specialized assistance navigating the platform? You can also [Contact Support](${platformRoutes.contact.path}) or [Book a Consultation](${platformRoutes.consultation.path}).*`;
}

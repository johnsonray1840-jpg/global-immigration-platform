/**
 * Centralized Website Knowledge Configuration for Global Citizens Solution
 * 
 * Provides structured, single-source-of-truth platform intelligence for
 * the Global Immigration Concierge backend & AI reasoning engines.
 */

export interface RouteConfig {
  path: string;
  label: string;
  requiresAuth: boolean;
  description: string;
}

export const platformRoutes = {
  home: { path: '/', label: 'Home', requiresAuth: false, description: 'Main landing page' },
  register: { path: '/register', label: 'Create Free Account', requiresAuth: false, description: 'Client registration' },
  login: { path: '/login', label: 'Sign In', requiresAuth: false, description: 'Client authentication' },
  forgotPassword: { path: '/forgot-password', label: 'Forgot Password', requiresAuth: false, description: 'Password reset' },
  eligibility: { path: '/eligibility', label: 'Eligibility Assessment', requiresAuth: false, description: 'Points & visa calculator' },
  countries: { path: '/countries', label: 'Country Directory', requiresAuth: false, description: '50+ country guides' },
  countryDetail: (code: string) => ({ path: `/countries/${code}`, label: `${code} Country Guide`, requiresAuth: false, description: `Country guide for ${code}` }),
  compare: { path: '/compare', label: 'Compare Countries', requiresAuth: false, description: 'Side-by-side country comparison' },
  programs: { path: '/programs', label: 'Explore Programs', requiresAuth: false, description: 'Immigration programs directory' },
  cbiPrograms: { path: '/programs/citizenship-by-investment', label: 'Citizenship by Investment', requiresAuth: false, description: 'CBI and Golden Visa programs' },
  packages: { path: '/packages', label: 'Service Packages', requiresAuth: false, description: 'All-inclusive legal and filing packages' },
  scholarships: { path: '/scholarships', label: 'Global Scholarships', requiresAuth: false, description: '10+ prestigious fully funded scholarships' },
  scholarshipDetail: (id: string) => ({ path: `/scholarships/${id}`, label: 'Scholarship Details', requiresAuth: false, description: 'Scholarship eligibility and application' }),
  consultation: { path: '/consultation', label: 'Book a Consultation', requiresAuth: false, description: '1-on-1 strategy sessions with licensed RCIC / attorneys' },
  faq: { path: '/faq', label: 'FAQ Portal', requiresAuth: false, description: 'Frequently asked questions' },
  about: { path: '/about', label: 'About Us', requiresAuth: false, description: '10+ years immigration excellence and credentials' },
  contact: { path: '/contact', label: 'Contact Us', requiresAuth: false, description: 'Official support channels' },
  
  // Authenticated Portal Routes
  dashboard: { path: '/dashboard', label: 'Client Dashboard', requiresAuth: true, description: 'Client overview portal' },
  cases: { path: '/dashboard/cases', label: 'Client Case Tracking', requiresAuth: true, description: 'Active visa application milestones' },
  documents: { path: '/dashboard/documents', label: 'Document Center', requiresAuth: true, description: 'Encrypted document vault with AI OCR audit' },
  appointments: { path: '/dashboard/appointments', label: 'Manage Appointments', requiresAuth: true, description: 'Consultation scheduling' },
  wallet: { path: '/dashboard/wallet', label: 'Billing & Wallet', requiresAuth: true, description: 'Escrow, wire transfer & crypto payments' },
  workspace: { path: '/dashboard/workspace', label: 'Case Workspace', requiresAuth: true, description: 'Interactive case files and notes' },
  profile: { path: '/dashboard/profile', label: 'Profile Settings', requiresAuth: true, description: 'Personal info & 2FA security' },
};

export const websiteKnowledge = {
  company: {
    name: 'Global Citizens Solution',
    shortName: 'GCS',
    tagline: 'Your Journey. Our Expertise. Global Possibilities.',
    experience: '10+ years of combined expertise',
    credentials: ['Licensed RCIC Immigration Consultants', 'Member of International Immigration Association', 'ISO 9001 Certified Process', 'GDPR Compliant'],
  },

  contact: {
    email: 'support@gcsworldwide.org',
    whatsapp: '+12565858538',
    whatsappUrl: 'https://wa.me/12565858538',
    supportHours: '24/7 Global Immigration Concierge & Live Support',
    consultationRoute: platformRoutes.consultation.path,
  },

  services: [
    {
      id: 'express-entry-pr',
      name: 'Skilled Migration & Permanent Residence',
      description: 'Comprehensive points evaluation, credential assessments (ECA), language strategy, and legal dossier filing for Canada (Express Entry/PNP), UK, Australia, and Germany.',
      route: platformRoutes.programs.path,
    },
    {
      id: 'cbi-golden-visas',
      name: 'Citizenship by Investment & Golden Visas',
      description: 'Acquire second citizenship or European residency through government-approved capital funds, real estate, or donations with full legal due diligence.',
      route: platformRoutes.cbiPrograms.path,
    },
    {
      id: 'study-scholarships',
      name: 'Global Education & Scholarship Placement',
      description: 'End-to-end university matching, admission statement of purpose (SOP) guidance, high-value scholarship filing ($10,000 - $150,000 grants), and student visa processing.',
      route: platformRoutes.scholarships.path,
    },
    {
      id: 'work-permits-corporate',
      name: 'Work Permits & Corporate Relocation',
      description: 'EU Blue Cards, Germany Opportunity Cards (Chancenkarte), US H-1B / L-1 transfers, and global digital nomad visas for remote professionals.',
      route: platformRoutes.programs.path,
    },
    {
      id: 'document-vault-ocr',
      name: 'AI Document Verification & Quality Auditing',
      description: 'Encrypted cloud vault with automated OCR scanning to verify passport validity, financial proof clarity, and certified translation compliance.',
      route: platformRoutes.documents.path,
    },
    {
      id: 'escrow-billing',
      name: 'Secure Multi-Rail Escrow & Billing',
      description: 'Institutional escrow protection with Stripe credit cards, international bank wires (SWIFT/SEPA), and dedicated cryptocurrency rails.',
      route: platformRoutes.wallet.path,
    },
  ],

  packages: [
    {
      id: 'skilled-worker',
      name: 'Skilled Worker & Permanent Residence Package',
      serviceFee: 3000,
      currency: 'USD',
      includes: [
        'Complete Eligibility & Points Optimization (CRS / Points test)',
        'Educational Credential Assessment (ECA) guidance',
        'Certified Document Review & AI OCR Pre-Screening',
        'Dedicated Case Manager & Direct Filing with Immigration Authorities',
        'Post-landing resettlement and PR card guidance',
      ],
      route: platformRoutes.packages.path,
    },
    {
      id: 'student-success',
      name: 'Student Success & Global Scholarship Package',
      serviceFee: 1200,
      currency: 'USD',
      includes: [
        'Top University Matching & Admission Assistance',
        'Application to 10+ Premier Fully-Funded Global Scholarships',
        'Statement of Purpose (SOP) & Resume Optimization',
        'Student Visa Filing & Proof of Funds Compliance Check',
        'Post-Graduation Work Permit (PGWP) Roadmap',
      ],
      route: platformRoutes.packages.path,
    },
    {
      id: 'family-relocation',
      name: 'Family Relocation & Sponsorship Package',
      serviceFee: 2500,
      currency: 'USD',
      includes: [
        'Primary Applicant & Dependent Eligibility Audit',
        'Spousal & Child Sponsorship Legal Filing',
        'Family Medical & Police Clearance Coordination',
        'Full Dossier Review by Immigration Specialists',
        'Priority Case Updates & Embassy Interview Preparation',
      ],
      route: platformRoutes.packages.path,
    },
    {
      id: 'investor-cbi',
      name: 'Investor & Golden Visa Premium Concierge',
      serviceFee: 5000,
      currency: 'USD',
      includes: [
        'Private Wealth & Source of Funds Compliance Audit',
        'Government Due Diligence Pre-Check',
        'Real Estate / Sovereign Fund Selection & Escrow Setup',
        'Direct Government Filing for Passport / Golden Visa Residence',
        'VIP Handling for Entire Family (Spouse, Children, Parents)',
      ],
      route: platformRoutes.cbiPrograms.path,
    },
  ],

  countries: [
    {
      code: 'CA',
      name: 'Canada',
      popularPrograms: ['Express Entry (FSW / CEC)', 'Provincial Nominee Programs (PNP)', 'Post-Graduation Work Permit', 'Start-up Visa'],
      processingTime: '6 to 12 months for Express Entry',
      route: platformRoutes.countryDetail('CA').path,
    },
    {
      code: 'US',
      name: 'United States',
      popularPrograms: ['EB-2 NIW (National Interest Waiver)', 'EB-1 Extraordinary Ability', 'H-1B Specialty Occupation', 'F-1 Student Visa', 'EB-5 Immigrant Investor'],
      processingTime: '8 to 18 months depending on visa category',
      route: platformRoutes.countryDetail('US').path,
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      popularPrograms: ['Skilled Worker Visa (70 Points)', 'Global Talent Visa', 'Graduate Visa', 'High Potential Individual (HPI)'],
      processingTime: '3 to 8 weeks for standard skilled worker',
      route: platformRoutes.countryDetail('GB').path,
    },
    {
      code: 'DE',
      name: 'Germany',
      popularPrograms: ['Opportunity Card (Chancenkarte)', 'EU Blue Card', 'Job Seeker Visa', 'Student Visa'],
      processingTime: '1 to 3 months',
      route: platformRoutes.countryDetail('DE').path,
    },
    {
      code: 'AU',
      name: 'Australia',
      popularPrograms: ['Subclass 189 Skilled Independent', 'Subclass 190 Nominated', 'Subclass 482 Temporary Skill Shortage', 'Student Visa 500'],
      processingTime: '6 to 10 months',
      route: platformRoutes.countryDetail('AU').path,
    },
    {
      code: 'PT',
      name: 'Portugal',
      popularPrograms: ['D8 Digital Nomad Visa', 'D7 Passive Income Visa', 'Golden Residence Permit (Fund Investment)'],
      processingTime: '2 to 5 months',
      route: platformRoutes.countryDetail('PT').path,
    },
    {
      code: 'ES',
      name: 'Spain',
      popularPrograms: ['Digital Nomad Visa', 'Non-Lucrative Visa', 'Golden Visa Residency'],
      processingTime: '1 to 3 months',
      route: platformRoutes.countryDetail('ES').path,
    },
    {
      code: 'MT',
      name: 'Malta',
      popularPrograms: ['Malta Permanent Residence Program (MPRP)', 'Citizenship by Direct Investment (MEIN)', 'Nomad Residence Permit'],
      processingTime: '4 to 8 months',
      route: platformRoutes.countryDetail('MT').path,
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      popularPrograms: ['10-Year Golden Visa (Investors / Talent)', 'Green Visa for Freelancers', 'Remote Work Visa'],
      processingTime: '2 to 4 weeks',
      route: platformRoutes.countryDetail('AE').path,
    },
    {
      code: 'CBI-CARIBBEAN',
      name: 'Caribbean Nations (St. Kitts, Dominica, Grenada, Antigua, St. Lucia)',
      popularPrograms: ['Citizenship by Investment (Donation from $100k - $250k or Real Estate)'],
      processingTime: '3 to 6 months fast-track direct passport issuance',
      route: platformRoutes.cbiPrograms.path,
    },
  ],

  programs: [
    {
      id: 'express-entry',
      title: 'Canada Express Entry (Federal Skilled Worker & CEC)',
      category: 'Permanent Residence',
      country: 'Canada',
      summary: 'Points-based immigration system evaluating Age, Education, Language (CLB 7+), and Work Experience.',
      route: platformRoutes.programs.path,
    },
    {
      id: 'eb2-niw',
      title: 'US EB-2 National Interest Waiver (NIW)',
      category: 'Permanent Residence / Green Card',
      country: 'United States',
      summary: 'Self-petitioned US Green Card for professionals with advanced degrees or exceptional ability without labor certification.',
      route: platformRoutes.programs.path,
    },
    {
      id: 'chancenkarte',
      title: 'Germany Opportunity Card (Chancenkarte)',
      category: 'Work & Job Search',
      country: 'Germany',
      summary: 'Points-based job search visa allowing qualified foreign professionals to enter and look for work in Germany for up to 1 year.',
      route: platformRoutes.programs.path,
    },
    {
      id: 'uk-skilled-worker',
      title: 'UK Skilled Worker Visa',
      category: 'Work Permit',
      country: 'United Kingdom',
      summary: 'Points-based system requiring an eligible job offer from a Home Office approved licensed sponsor.',
      route: platformRoutes.programs.path,
    },
    {
      id: 'caribbean-cbi',
      title: 'Caribbean Citizenship by Investment',
      category: 'Citizenship by Investment',
      country: 'St. Kitts, Dominica, Grenada, Antigua, Saint Lucia',
      summary: 'Direct second citizenship with visa-free travel to 140+ countries within 3 to 6 months.',
      route: platformRoutes.cbiPrograms.path,
    },
    {
      id: 'digital-nomad-visas',
      title: 'Global Digital Nomad Visas (Portugal, Spain, Dubai, Costa Rica)',
      category: 'Remote Work Residence',
      country: 'Global',
      summary: 'Live and work abroad legally while maintaining remote employment or freelance client income.',
      route: platformRoutes.programs.path,
    },
  ],

  scholarships: [
    {
      name: 'Fulbright Foreign Student Program',
      country: 'United States',
      amount: '$50,000 / year (Full Tuition + Living Stipend + Flights)',
      level: "Master's, PhD",
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'Chevening Scholarships',
      country: 'United Kingdom',
      amount: '100% Tuition Waiver + Monthly Living Allowance',
      level: "Master's (1 Year)",
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'DAAD Helmut-Schmidt-Programme',
      country: 'Germany',
      amount: 'Full Tuition Waiver + €934/month Stipend + Health Insurance',
      level: "Master's in Public Policy & Governance",
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'Australia Awards Scholarships',
      country: 'Australia',
      amount: 'Full University Tuition + Return Airfare + Establishment Stipend',
      level: "Undergraduate, Master's, PhD",
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'Vanier Canada Graduate Scholarships',
      country: 'Canada',
      amount: '$50,000 CAD / year for 3 years ($150,000 total)',
      level: 'PhD / Doctoral Studies',
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'Eiffel Excellence Scholarship',
      country: 'France',
      amount: '€1,181 to €1,800 monthly allowance + flights + insurance',
      level: "Master's, PhD",
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'Swiss Government Excellence Scholarships',
      country: 'Switzerland',
      amount: 'CHF 1,920 to CHF 3,500 monthly stipend + insurance',
      level: 'Research Fellowship, PhD, Postdoc',
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'MEXT Japanese Government Scholarship',
      country: 'Japan',
      amount: '100% Tuition Exemption + 145,000 JPY/month + flights',
      level: "Undergraduate, Master's, PhD",
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'SINGA Singapore International Graduate Award',
      country: 'Singapore',
      amount: 'Full PhD Tuition + SGD 2,700/month + $1,000 settling-in grant',
      level: 'PhD in Science & Engineering',
      route: platformRoutes.scholarships.path,
    },
    {
      name: 'Government of Ireland International Scholarship',
      country: 'Ireland',
      amount: 'Full Tuition Fee Waiver + €10,000 living stipend',
      level: "Master's, PhD",
      route: platformRoutes.scholarships.path,
    },
  ],

  consultation: {
    title: '1-on-1 Strategy Consultation with Licensed Immigration Specialists',
    duration: '45 Minutes',
    formats: ['Encrypted HD Video Session', 'Phone Call', 'In-Person (Selected Jurisdictions)'],
    includes: [
      'Comprehensive profile & points evaluation',
      'Document pre-screening & risk audit',
      'Customized filing timeline & roadmap',
      'Direct Q&A with licensed RCIC consultant or immigration attorney',
    ],
    route: platformRoutes.consultation.path,
  },

  paymentMethods: [
    {
      method: 'Credit / Debit Card (Stripe)',
      speed: 'Instant Confirmation',
      security: 'PCI-DSS Level 1 Encrypted',
      bestFor: 'Consultations, application retainers, initial package fees',
      route: platformRoutes.wallet.path,
    },
    {
      method: 'Bank Wire Transfer (SWIFT / SEPA / IBAN)',
      speed: '1 to 2 Business Days',
      security: 'Direct Institutional Bank-to-Bank Escrow',
      bestFor: 'Full package settlements, government fee disbursements, investor capital',
      route: platformRoutes.wallet.path,
    },
    {
      method: 'Cryptocurrency Escrow (BTC, ETH, USDT, USDC)',
      speed: '15 to 30 Minutes on Blockchain',
      security: 'Dedicated single-use escrow wallet address with 30-min price lock',
      bestFor: 'International clients seeking fast borderless settlement with zero FX penalties',
      route: platformRoutes.wallet.path,
    },
  ],

  documentCenter: {
    supportedFormats: ['PDF', 'JPG', 'PNG', 'WebP'],
    maxFileSize: '25 MB per document',
    features: ['Instant AI OCR clarity verification', 'Automated data indexing', 'Encrypted cloud vault', '24–48h legal consultant review'],
    categories: [
      'Passport & Identity (Passport bio page, National ID)',
      'Proof of Funds (Official 6-month bank statements, investment proofs)',
      'Academic Transcripts (Degrees, diplomas, ECA reports)',
      'Employment References (Signed experience letters with duties & NOC/TEER codes)',
      'Police Clearance Certificates (PCC from all countries lived in 6+ months)',
      'Medical Examination Reports (IME by authorized panel physician)',
    ],
    route: platformRoutes.documents.path,
  },

  applicationWorkflow: [
    { step: 1, name: 'Profile & Eligibility Evaluation', route: platformRoutes.eligibility.path },
    { step: 2, name: 'Document Vault Upload & AI OCR Audit', route: platformRoutes.documents.path },
    { step: 3, name: 'Legal Specialist Review & Dossier Compilation', route: platformRoutes.cases.path },
    { step: 4, name: 'Official Government Submission', route: platformRoutes.cases.path },
    { step: 5, name: 'Biometrics & Interview Preparation', route: platformRoutes.appointments.path },
    { step: 6, name: 'Visa Issuance & Pre-Landing Orientation', route: platformRoutes.cases.path },
  ],

  faq: [
    {
      q: 'Do you handle Canada immigration?',
      a: 'Yes, absolutely. We specialize in Canada Permanent Residence through Express Entry (Federal Skilled Worker, Canadian Experience Class, Trades), Provincial Nominee Programs (PNP) across Ontario, BC, and Alberta, Study-to-PR post-graduation pathways, and Start-up Visas.',
      route: platformRoutes.countryDetail('CA').path,
    },
    {
      q: 'Where can I find investment programs?',
      a: 'You can explore all Citizenship by Investment (CBI) and Golden Visa programs on our dedicated Citizenship by Investment Portal. We cover Caribbean direct passports ($100k-$250k) and European Golden Visas (Portugal, Greece, Spain, Malta).',
      route: platformRoutes.cbiPrograms.path,
    },
    {
      q: 'How do I book a consultation?',
      a: 'You can schedule a private 45-minute 1-on-1 strategy session directly on our Consultation Booking Page. Select your preferred date, time, and session format (HD Video or Phone) to connect with a licensed immigration specialist.',
      route: platformRoutes.consultation.path,
    },
    {
      q: 'Can I apply for a scholarship?',
      a: 'Yes! We feature 10 fully funded global scholarships (such as Fulbright in the US, Chevening in the UK, DAAD in Germany, and Vanier in Canada) offering up to $150,000 in tuition and living grants. You can explore deadlines and start your application on our Global Scholarships Directory.',
      route: platformRoutes.scholarships.path,
    },
    {
      q: 'How do I upload my documents?',
      a: 'Log into your account and open the Document Center. Drag and drop your passport, bank statements, or academic transcripts (PDF, JPG, PNG up to 25MB). Our AI OCR will instantly verify clarity and index your files for our legal team.',
      route: platformRoutes.documents.path,
    },
    {
      q: 'Where can I see my application?',
      a: 'Once logged in, you can monitor your active case timeline, status milestones (from Profile Created to Visa Issued), and case officer notes in your Client Case Tracking Dashboard.',
      route: platformRoutes.cases.path,
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Credit/Debit Cards via Stripe (instant), International Bank Wire Transfers via SWIFT/SEPA with unique client references, and Cryptocurrency Escrow (BTC, ETH, USDT, USDC) with 30-minute rate locks.',
      route: platformRoutes.wallet.path,
    },
    {
      q: 'What services does your company provide?',
      a: 'Global Citizens Solution provides licensed immigration consultancy across 50+ countries. Our services include Skilled Worker Permanent Residence, Golden Visas & Citizenship by Investment, Global Scholarships & University Placement, Work Permits & Nomad Visas, Encrypted Document Vault with AI OCR, and 1-on-1 Consultations.',
      route: platformRoutes.packages.path,
    },
  ],
};

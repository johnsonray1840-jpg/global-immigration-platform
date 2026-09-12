import { platformRoutes } from './website-knowledge';
import { formatTimeSensitiveFooter, findTimeSensitivePolicy } from './time-sensitive-registry';

export interface CountryPathwayInfo {
  name: string;
  category: 'SKILLED_PR' | 'WORK_PERMIT' | 'STUDY_GRADUATE' | 'INVESTMENT_GOLDEN_VISA' | 'PASSIVE_INCOME_NOMAD' | 'FAMILY_SPONSORSHIP';
  description: string;
  eligibilitySnippet: string;
}

export interface CountryKnowledgeProfile {
  code: string;
  name: string;
  aliases: string[];
  flag: string;
  currency: string;
  governingAuthority: string;
  officialLanguage: string;
  overview: string;
  pathways: CountryPathwayInfo[];
  keyRequirements: string[];
  processingTimeOverview: string;
  primaryRoute: string;
  faqPromptSuggestions: string[];
}

export const countryProfiles: CountryKnowledgeProfile[] = [
  {
    code: 'CA',
    name: 'Canada',
    aliases: ['canada', 'canadian', 'toronto', 'vancouver', 'ontario', 'quebec', 'alberta', 'ircc', 'express entry'],
    flag: '🇨🇦',
    currency: 'CAD ($)',
    governingAuthority: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    officialLanguage: 'English & French',
    overview: 'Canada offers world-renowned, transparent points-based permanent residence pathways and strong study-to-work transitions.',
    pathways: [
      {
        name: 'Express Entry (FSW / CEC / FST)',
        category: 'SKILLED_PR',
        description: 'Direct Permanent Residence via Comprehensive Ranking System (CRS) scoring age, education (ECA), language (CLB 7–9+), and skilled experience.',
        eligibilitySnippet: 'Requires 67/100 points on FSW grid, minimum CLB 7, and ECA evaluation.',
      },
      {
        name: 'Provincial Nominee Programs (PNP)',
        category: 'SKILLED_PR',
        description: 'Provinces (Ontario OINP, BC PNP, Alberta AAIP) nominate candidates meeting local economic demands, awarding +600 CRS bonus points.',
        eligibilitySnippet: 'Varies by province; streams available with or without a job offer.',
      },
      {
        name: 'Study-to-PR (Study Permit & PGWP)',
        category: 'STUDY_GRADUATE',
        description: 'Complete a qualifying post-secondary program at a DLI, receive up to a 3-year Post-Graduation Work Permit, and transition to PR via Canadian Experience Class.',
        eligibilitySnippet: 'Requires Provincial Attestation Letter (PAL), tuition proof, and living funds.',
      },
      {
        name: 'Start-Up Visa & Business Class',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Direct PR for innovative entrepreneurs who secure support from a designated venture capital fund, angel investor group, or business incubator.',
        eligibilitySnippet: 'Designated letter of support and minimum language CLB 5.',
      },
      {
        name: 'Family Sponsorship',
        category: 'FAMILY_SPONSORSHIP',
        description: 'Canadian citizens and PRs can sponsor spouses, common-law partners, and dependent children with no financial minimum if sponsoring a spouse.',
        eligibilitySnippet: 'Sponsor must be a Canadian Citizen or PR living in Canada.',
      },
    ],
    keyRequirements: [
      'Language Test (IELTS General / CELPIP for English or TEF / TCF for French)',
      'Educational Credential Assessment (ECA via WES / ICAS / IQAS)',
      'Proof of Settlement Funds (CAD $14,690+ for single applicant under FSW)',
      'Police Clearance Certificates and IRCC Medical Exam',
    ],
    processingTimeOverview: 'Express Entry: ~6 months | Study Permits: 8–12 weeks | PNPs: 12–18 months',
    primaryRoute: platformRoutes.countryDetail('CA').path,
    faqPromptSuggestions: ['How do I calculate my Canada CRS score?', 'What are the top PNP options for tech workers?'],
  },
  {
    code: 'AU',
    name: 'Australia',
    aliases: ['australia', 'australian', 'sydney', 'melbourne', 'brisbane', 'subclass 189', 'subclass 190', 'subclass 491'],
    flag: '🇦🇺',
    currency: 'AUD ($)',
    governingAuthority: 'Department of Home Affairs, Australian Government',
    officialLanguage: 'English',
    overview: 'Australia operates a high-demand points-tested skilled migration system and world-class post-study work rights in regional and metro centres.',
    pathways: [
      {
        name: 'General Skilled Migration (Subclass 189 Skilled Independent)',
        category: 'SKILLED_PR',
        description: 'Direct Permanent Residence without employer sponsorship based on points grid (SkillSelect).',
        eligibilitySnippet: 'Minimum 65 points, under 45 years of age, positive skills assessment, Competent English.',
      },
      {
        name: 'State Nominated (Subclass 190 PR / Subclass 491 Regional)',
        category: 'SKILLED_PR',
        description: 'State government nomination providing +5 points (190 direct PR) or +15 points (491 5-year provisional visa leading to Subclass 191 PR).',
        eligibilitySnippet: 'Nominated by an Australian state/territory on their skills shortage list.',
      },
      {
        name: 'Temporary Skill Shortage (Subclass 482) & Employer Nomination (Subclass 186)',
        category: 'WORK_PERMIT',
        description: 'Employer-sponsored work permit for up to 4 years with a direct transition path to permanent residency via Subclass 186 ENS.',
        eligibilitySnippet: 'Requires approved sponsoring employer and 2+ years relevant experience.',
      },
      {
        name: 'Higher Education & Graduate Work (Subclass 500 & 485)',
        category: 'STUDY_GRADUATE',
        description: 'Study at accredited Australian universities, followed by a 2–4 year Temporary Graduate work visa.',
        eligibilitySnippet: 'CRICOS registered course enrollment and Genuine Student (GS) test.',
      },
    ],
    keyRequirements: [
      'Positive Skills Assessment from designated assessing body (ACS, Engineers Australia, VETASSESS, TRA)',
      'SkillSelect EOI submission with minimum 65 points (competitive scores typically 85+)',
      'English test (IELTS / PTE Academic with Competent / Proficient / Superior bands)',
      'Australian Federal Police / Home country character clearances',
    ],
    processingTimeOverview: 'Subclass 189: 3–9 months | Subclass 190: 6–12 months | Subclass 482: 1–3 months',
    primaryRoute: platformRoutes.countryDetail('AU').path,
    faqPromptSuggestions: ['How to pass the Australian Skills Assessment?', 'What is the Subclass 190 State Nomination?'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    aliases: ['uk', 'united kingdom', 'britain', 'england', 'scotland', 'london', 'british', 'home office', 'ukvi'],
    flag: '🇬🇧',
    currency: 'GBP (£)',
    governingAuthority: 'UK Home Office / UK Visas and Immigration (UKVI)',
    officialLanguage: 'English',
    overview: 'The UK points-based immigration system provides fast-track sponsored work visas, global talent endorsements, and graduate routes.',
    pathways: [
      {
        name: 'Skilled Worker Visa (70 Points System)',
        category: 'WORK_PERMIT',
        description: 'Employer-sponsored work visa with a 5-year pathway to Indefinite Leave to Remain (ILR) and British Citizenship.',
        eligibilitySnippet: 'Job offer from licensed sponsor at £38,700/yr (or occupation going rate), CEFR B1 English.',
      },
      {
        name: 'Global Talent Visa',
        category: 'SKILLED_PR',
        description: 'Prestige visa for leaders and emerging leaders in Tech, Science, Engineering, Medicine, and Arts without employer sponsorship. 3-year fast-track to ILR.',
        eligibilitySnippet: 'Endorsement from Tech Nation, Royal Society, British Academy, or Arts Council England.',
      },
      {
        name: 'Graduate Visa & High Potential Individual (HPI)',
        category: 'STUDY_GRADUATE',
        description: 'Unsponsored 2-year work permit for UK university graduates (3 years for PhDs) or graduates of top 50 global universities.',
        eligibilitySnippet: 'Completion of eligible UK degree or degree from Global Universities list.',
      },
      {
        name: 'Innovator Founder Visa',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'For entrepreneurs with an innovative, viable, and scalable business approved by an endorsing body. 3-year fast-track to ILR.',
        eligibilitySnippet: 'Endorsement from approved UK business endorsing body.',
      },
    ],
    keyRequirements: [
      'Certificate of Sponsorship (CoS) from licensed UK employer (for Skilled Worker)',
      'English proficiency at CEFR B1 (IELTS 4.0+ in all components or UK degree equivalent)',
      'Immigration Health Surcharge (IHS) £1,035/year per adult',
      'Financial maintenance proof (£1,270 in bank account for 28 consecutive days unless certified by sponsor)',
    ],
    processingTimeOverview: 'Standard Priority: 3 weeks outside UK | Inside UK: 8 weeks | Super Priority: 24–48 hours',
    primaryRoute: platformRoutes.countryDetail('GB').path,
    faqPromptSuggestions: ['What are the requirements for a UK Skilled Worker Visa?', 'How does the UK Global Talent Visa work?'],
  },
  {
    code: 'US',
    name: 'United States',
    aliases: ['usa', 'united states', 'america', 'american', 'uscis', 'green card', 'greencard', 'h1b', 'eb2', 'eb5'],
    flag: '🇺🇸',
    currency: 'USD ($)',
    governingAuthority: 'U.S. Citizenship and Immigration Services (USCIS) & Department of State',
    officialLanguage: 'English',
    overview: 'The United States offers specialized employment Green Cards, immigrant investor routes, and merit-based talent petitions.',
    pathways: [
      {
        name: 'EB-2 NIW (National Interest Waiver)',
        category: 'SKILLED_PR',
        description: 'Direct Green Card petition for professionals with advanced degrees or exceptional ability whose proposed endeavor has substantial merit and national importance.',
        eligibilitySnippet: 'Self-petitioned; no employer sponsor or PERM labor certification required.',
      },
      {
        name: 'EB-1A Extraordinary Ability / EB-1C Executive Transfer',
        category: 'SKILLED_PR',
        description: 'Top-tier immigrant petition with no backlog for global leaders in science, arts, education, business, or multinational executives.',
        eligibilitySnippet: 'Evidence of major international award or meeting 3 out of 10 regulatory criteria.',
      },
      {
        name: 'EB-5 Immigrant Investor Program',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Direct Green Card for investors committing capital into a new commercial enterprise creating at least 10 full-time American jobs.',
        eligibilitySnippet: '$800,000 USD in a Targeted Employment Area (TEA / Rural) or $1,050,000 USD non-TEA.',
      },
      {
        name: 'H-1B Specialty Occupation & L-1 Intracompany Transfer',
        category: 'WORK_PERMIT',
        description: 'Temporary work visas with dual intent, allowing transition to employer-sponsored permanent residence (EB-2 / EB-3 PERM).',
        eligibilitySnippet: 'Bachelor degree in specific specialty + sponsoring employer.',
      },
    ],
    keyRequirements: [
      'Documented evidence of qualifying degree / credentials / expert standing',
      'Form I-140 Immigrant Petition filing with USCIS',
      'USCIS Filing and RIA fees where applicable',
      'Consular Processing (Form DS-260) or Adjustment of Status (Form I-485)',
    ],
    processingTimeOverview: 'EB-2 NIW: 6–14 months (Premium processing available in 45 days) | EB-5 Rural: Under 12 months',
    primaryRoute: platformRoutes.countryDetail('US').path,
    faqPromptSuggestions: ['How do I qualify for EB-2 NIW?', 'What are the EB-5 investment requirements?'],
  },
  {
    code: 'DE',
    name: 'Germany',
    aliases: ['germany', 'german', 'deutschland', 'berlin', 'munich', 'chancenkarte', 'opportunity card', 'blue card'],
    flag: '🇩🇪',
    currency: 'EUR (€)',
    governingAuthority: 'Federal Ministry of the Interior (BMI) & Federal Foreign Office',
    officialLanguage: 'German',
    overview: 'Germany leads Europe in welcoming skilled non-EU specialists through points-based job search visas and fast-track EU Blue Cards.',
    pathways: [
      {
        name: 'Opportunity Card (Chancenkarte)',
        category: 'WORK_PERMIT',
        description: 'Points-based job search visa allowing qualified non-EU talent to enter Germany for up to 1 year while working part-time (20 hrs/week).',
        eligibilitySnippet: '6 points minimum on age, qualification, language (German A1 or English B2), and experience.',
      },
      {
        name: 'EU Blue Card Germany',
        category: 'WORK_PERMIT',
        description: 'Fast-track residency for university graduates with a qualifying job offer. Grants permanent settlement (PR) in just 21 months with German B1 or 27 months with A1.',
        eligibilitySnippet: 'Recognized degree + employment contract meeting salary threshold (€41,041 - €45,300).',
      },
      {
        name: 'Skilled Worker Visa (Fachkräfteeinwanderungsgesetz)',
        category: 'WORK_PERMIT',
        description: 'Direct work visa for vocational specialists and degree holders with recognized foreign qualifications.',
        eligibilitySnippet: 'Official recognition (Anerkennung) of foreign vocational or academic qualification.',
      },
      {
        name: 'German University Study & 18-Month Job Seeker',
        category: 'STUDY_GRADUATE',
        description: 'Study at tuition-free public universities, followed by an 18-month post-study search permit.',
        eligibilitySnippet: 'University admission + Blocked Account (Sperrkonto) €11,904/yr.',
      },
    ],
    keyRequirements: [
      'Blocked Account (Sperrkonto) proof of €1,027/month for job search / study',
      'Degree verification through Anabin database (ZAB Statement of Comparability)',
      'Proof of statutory or private German health insurance (Incoming-Versicherung)',
      'Basic German language certification (Goethe / Telc / TestDaF) where required',
    ],
    processingTimeOverview: 'Opportunity Card: 4–8 weeks | EU Blue Card: 3–6 weeks | Study Visa: 6–10 weeks',
    primaryRoute: platformRoutes.countryDetail('DE').path,
    faqPromptSuggestions: ['How does the German Chancenkarte points system work?', 'What is the salary threshold for an EU Blue Card in Germany?'],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    aliases: ['uae', 'dubai', 'abu dhabi', 'emirates', 'uae golden visa', 'green visa'],
    flag: '🇦🇪',
    currency: 'AED (د.إ)',
    governingAuthority: 'Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) / GDRFA Dubai',
    officialLanguage: 'Arabic (English widely used in business)',
    overview: 'The UAE offers tax-free living (0% personal income tax), 10-year renewable Golden Visas, and dynamic freelance/remote work hubs.',
    pathways: [
      {
        name: '10-Year UAE Golden Visa',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Long-term residency for real estate investors (AED 2M property), entrepreneurs, exceptional executives (AED 30k/mo salary), doctors, scientists, and PhD holders.',
        eligibilitySnippet: '2M AED property purchase, 30,000 AED/mo executive employment contract, or Ministry nomination.',
      },
      {
        name: '5-Year Green Visa',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Self-residency for skilled professionals, freelancers, and small business owners without requiring an employer sponsor.',
        eligibilitySnippet: 'Bachelor degree, freelance permit from MoHRE, and annual self-employment income of AED 360,000.',
      },
      {
        name: '1-Year Remote Work Visa (Virtual Working Programme)',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Live in Dubai while working remotely for your employer outside the UAE.',
        eligibilitySnippet: 'Proof of employment abroad and minimum $3,500 USD monthly salary.',
      },
    ],
    keyRequirements: [
      'Title Deed from Dubai Land Department (DLD) or equivalent emirate authority (for real estate)',
      'Attested educational degrees (MoFA attestation)',
      'UAE Medical Fitness test (blood test & chest X-ray)',
      'Emirates ID biometric capture',
    ],
    processingTimeOverview: 'Golden Visa: 1–3 weeks | Remote Work Visa: 5–10 business days',
    primaryRoute: platformRoutes.countryDetail('AE').path,
    faqPromptSuggestions: ['How do I get a Dubai 10-Year Golden Visa?', 'What are the rules for the UAE Remote Work Visa?'],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    aliases: ['new zealand', 'nz', 'auckland', 'wellington', 'kiwi', 'immigration new zealand', 'inz'],
    flag: '🇳🇿',
    currency: 'NZD ($)',
    governingAuthority: 'Immigration New Zealand (INZ)',
    officialLanguage: 'English & Māori',
    overview: 'New Zealand provides a clean 6-point Skilled Migrant Category, the Green List Straight to Residence route, and high quality of life.',
    pathways: [
      {
        name: 'Skilled Migrant Category (SMC 6-Point System)',
        category: 'SKILLED_PR',
        description: 'Points-based residency awarding points for NZ professional registration, advanced qualifications, or high income, combined with NZ skilled work.',
        eligibilitySnippet: 'Requires 6 points + skilled job offer from an Accredited Employer paying median wage.',
      },
      {
        name: 'Green List: Straight to Residence & Work to Residence',
        category: 'SKILLED_PR',
        description: 'Fast-track direct PR for tier-1 shortage occupations (doctors, nurses, ICT managers, software engineers, civil engineers).',
        eligibilitySnippet: 'Tier-1 Green List job offer from an accredited employer.',
      },
      {
        name: 'Accredited Employer Work Visa (AEWV)',
        category: 'WORK_PERMIT',
        description: 'Temporary work permit for up to 5 years connected to an approved Accredited Employer.',
        eligibilitySnippet: 'Job Check approved by INZ paying at least the standard wage threshold.',
      },
    ],
    keyRequirements: [
      'Job offer from an INZ-Accredited Employer',
      'NZQA International Qualifications Assessment (IQA) where required',
      'IELTS General 6.5 overall (or equivalent PTE Academic score)',
      'Police certificates and INZ medical examination',
    ],
    processingTimeOverview: 'Green List Straight to Residence: 2–4 months | SMC: 4–8 months | AEWV: 4–6 weeks',
    primaryRoute: platformRoutes.countryDetail('NZ').path,
    faqPromptSuggestions: ['What jobs are on the New Zealand Green List?', 'How does the NZ 6-point SMC system work?'],
  },
  {
    code: 'PT',
    name: 'Portugal',
    aliases: ['portugal', 'portuguese', 'lisbon', 'porto', 'd8', 'd7', 'portugal golden visa', 'aima'],
    flag: '🇵🇹',
    currency: 'EUR (€)',
    governingAuthority: 'Agency for Integration, Migration and Asylum (AIMA)',
    officialLanguage: 'Portuguese',
    overview: 'Portugal remains Europe’s premier destination for digital nomads, passive income retirees, and investment fund residency.',
    pathways: [
      {
        name: 'D8 Digital Nomad Visa',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Residency for remote employees and freelancers earning at least 4 times the Portuguese minimum wage (€3,280/month).',
        eligibilitySnippet: 'Proof of remote employment/contracts and €3,280/mo average earnings over past 3 months.',
      },
      {
        name: 'D7 Passive Income & Retirement Visa',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Residency for retirees and individuals with stable passive income (pension, dividends, royalties, rental yields).',
        eligibilitySnippet: 'Proof of minimum €820/month passive income + 1 year savings in Portuguese bank account.',
      },
      {
        name: 'Golden Residence Permit (Fund Investment Route)',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: '€500,000 investment in regulated non-real estate Portuguese venture capital / private equity funds. Requires only 7 days/year stay.',
        eligibilitySnippet: '€500k capital transfer into qualifying CMVM-regulated venture capital fund.',
      },
    ],
    keyRequirements: [
      'Portuguese Tax Number (NIF) and funded Portuguese bank account',
      'Proof of accommodation (12-month lease agreement or property deed)',
      'Comprehensive private health insurance covering Portugal',
      'Clean criminal record certificate with Apostille / legalization',
    ],
    processingTimeOverview: 'D8 / D7 Consular Visa: 60–90 days | Golden Visa Fund: 6–12 months',
    primaryRoute: platformRoutes.countryDetail('PT').path,
    faqPromptSuggestions: ['What are the income requirements for Portugal D8 visa?', 'Can I still get the Portugal Golden Visa through funds?'],
  },
  {
    code: 'ES',
    name: 'Spain',
    aliases: ['spain', 'spanish', 'madrid', 'barcelona', 'valencia', 'spain digital nomad', 'non-lucrative'],
    flag: '🇪🇸',
    currency: 'EUR (€)',
    governingAuthority: 'Ministry of Inclusion, Social Security and Migration & UGE-CE',
    officialLanguage: 'Spanish',
    overview: 'Spain offers a dynamic Digital Nomad Visa with Beckham Law 24% flat tax advantages, Non-Lucrative retirement routes, and Golden Visas.',
    pathways: [
      {
        name: 'Spain Digital Nomad Visa (Ley de Startups)',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Up to 3-year residence permit (renewable to 5 years) for remote workers employed by companies outside Spain earning 200% of minimum wage (~€2,646/mo).',
        eligibilitySnippet: 'Remote work for 1+ year, employer permission letter, 3+ years experience or university degree.',
      },
      {
        name: 'Non-Lucrative Visa (Visado No Lucrativo - NLV)',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Residence permit for individuals who wish to live in Spain without conducting economic activity.',
        eligibilitySnippet: 'Proof of 400% IPREM (~€28,800/yr for main applicant) in savings/investments.',
      },
      {
        name: 'Spain Golden Visa Residency',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Residency via qualifying investment in real estate (€500k), Spanish government bonds (€2M), or company shares (€1M).',
        eligibilitySnippet: '€500k unencumbered real estate purchase or capital fund transfer.',
      },
    ],
    keyRequirements: [
      'Spanish NIE number (Número de Identidad de Extranjero)',
      'Private Spanish healthcare policy with no co-payments (Sin copago)',
      'Legalized / Apostilled police clearance certificates from past 5 years',
      'Official sworn Spanish translations (Traducción Jurada) of all documents',
    ],
    processingTimeOverview: 'Digital Nomad Visa in Spain (UGE): 20 business days | Consular NLV: 1–3 months',
    primaryRoute: platformRoutes.countryDetail('ES').path,
    faqPromptSuggestions: ['How to apply for the Spain Digital Nomad Visa?', 'What is the Beckham Law tax benefit in Spain?'],
  },
  {
    code: 'MT',
    name: 'Malta',
    aliases: ['malta', 'maltese', 'valletta', 'mprp', 'mein', 'community malta', 'malta golden visa'],
    flag: '🇲🇹',
    currency: 'EUR (€)',
    governingAuthority: 'Residency Malta Agency & Community Malta Agency',
    officialLanguage: 'Maltese & English',
    overview: 'Malta offers direct Schengen permanent residence, English-speaking European living, and Citizenship by Direct Investment.',
    pathways: [
      {
        name: 'Malta Permanent Residence Programme (MPRP)',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Lifetime permanent residence in the EU / Schengen zone via property purchase (€300k–€350k) or rental (€10k–€12k/yr) + government contribution (€28k–€58k) and €2k NGO donation.',
        eligibilitySnippet: 'Show €500k capital assets (with €150k in liquid assets) + government contributions.',
      },
      {
        name: 'Maltese Citizenship by Naturalisation for Exceptional Services (MEIN)',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Direct European citizenship and passport after 12 or 36 months of verified residency with qualifying sovereign contribution (€600k–€750k) and real estate investment.',
        eligibilitySnippet: 'Stringent 4-tier due diligence audit, sovereign contribution + real estate purchase (€700k) or lease (€16k/yr).',
      },
      {
        name: 'Malta Nomad Residence Permit',
        category: 'PASSIVE_INCOME_NOMAD',
        description: '1-year renewable residence permit for remote workers earning at least €3,500 gross monthly.',
        eligibilitySnippet: 'Remote employment or freelance contracts outside Malta + €3,500/mo income.',
      },
    ],
    keyRequirements: [
      'Tier 1 to Tier 4 comprehensive background and anti-money laundering due diligence',
      'Property lease or purchase deed in Malta / Gozo',
      'All-risk European health insurance policy',
      'Certified apostilled civil status documents',
    ],
    processingTimeOverview: 'MPRP: 4–6 months | Nomad Permit: 4–8 weeks | MEIN Citizenship: 14–38 months',
    primaryRoute: platformRoutes.countryDetail('MT').path,
    faqPromptSuggestions: ['What are the total costs for Malta MPRP?', 'How does Malta Citizenship by Direct Investment work?'],
  },
  {
    code: 'GR',
    name: 'Greece',
    aliases: ['greece', 'greek', 'athens', 'thessaloniki', 'santorini', 'mykonos', 'greece golden visa'],
    flag: '🇬🇷',
    currency: 'EUR (€)',
    governingAuthority: 'Ministry of Migration and Asylum, Hellenic Republic',
    officialLanguage: 'Greek',
    overview: 'Greece offers 5-year renewable European Golden Visa residency, affordable cost of living, and strategic Mediterranean access.',
    pathways: [
      {
        name: 'Greece Golden Visa (Tiered Real Estate Investment)',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: '5-year renewable European residency for the entire family. Tier 1 (€800k in Athens/Thessaloniki/islands), Tier 2 (€400k rest of Greece), or Tier 3 (€250k conversion projects).',
        eligibilitySnippet: 'Full unencumbered purchase of qualifying real estate in Greece.',
      },
      {
        name: 'Financially Independent Person (FIP) Visa',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Residency for non-EU citizens with at least €2,000/month stable passive income (pension, dividends, rents).',
        eligibilitySnippet: 'Proof of €2,000/mo income + 20% for spouse and 15% per child.',
      },
      {
        name: 'Greece Digital Nomad Visa',
        category: 'PASSIVE_INCOME_NOMAD',
        description: 'Residency for remote workers earning at least €3,500 net monthly from foreign employers.',
        eligibilitySnippet: 'Remote work contract + €3,500/mo income proof.',
      },
    ],
    keyRequirements: [
      'Greek Tax Number (AFM) and Greek bank account',
      'Notarized real estate contract and land registry certificate',
      'Greek private health insurance coverage',
      'Clean criminal record from country of origin and residence',
    ],
    processingTimeOverview: 'Golden Visa: 3–6 months | Digital Nomad Visa: 1–2 months',
    primaryRoute: platformRoutes.countryDetail('GR').path,
    faqPromptSuggestions: ['What are the new 2024 Greece Golden Visa thresholds?', 'Can my family join on the Greece Golden Visa?'],
  },
  {
    code: 'FR',
    name: 'France',
    aliases: ['france', 'french', 'paris', 'passeport talent', 'talent passport', 'french tech visa'],
    flag: '🇫🇷',
    currency: 'EUR (€)',
    governingAuthority: 'Ministère de l\'Intérieur (Ministry of the Interior, France)',
    officialLanguage: 'French',
    overview: 'France provides the multi-year Talent Passport (Passeport Talent) for highly qualified talent, founders, and researchers.',
    pathways: [
      {
        name: 'Talent Passport: Qualified Employee & EU Blue Card France',
        category: 'WORK_PERMIT',
        description: '4-year renewable residence permit for university graduates with a French employment contract paying at least 1.5x minimum wage (€42k+ for Blue Card).',
        eligibilitySnippet: 'Master degree or 5 years experience + qualifying French employment contract.',
      },
      {
        name: 'Talent Passport: Business Creator & Innovative Project (French Tech Visa)',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Residency for startup founders and investors endorsed by a French public incubator (French Tech Ticket).',
        eligibilitySnippet: 'Qualifying investment of at least €30,000 or French Tech incubator partner endorsement.',
      },
      {
        name: 'Long-Stay Visitor Visa (Visiteur)',
        category: 'PASSIVE_INCOME_NOMAD',
        description: '1-year renewable visa for financially self-sufficient individuals not working in France.',
        eligibilitySnippet: 'Proof of funds equal to French minimum wage (€16,000+/yr) and housing proof.',
      },
    ],
    keyRequirements: [
      'France-Visas online dossier and consular appointment',
      'Certified French translations of civil and academic records',
      'Attestation of accommodation in France (Attestation d\'hébergement or lease)',
      'Proof of health insurance and sufficient financial resources',
    ],
    processingTimeOverview: 'Talent Passport: 2–6 weeks | Long Stay Visitor: 4–8 weeks',
    primaryRoute: platformRoutes.countryDetail('FR').path,
    faqPromptSuggestions: ['How do I qualify for the French Talent Passport?', 'What is the French Tech Visa process?'],
  },
  {
    code: 'IE',
    name: 'Ireland',
    aliases: ['ireland', 'irish', 'dublin', 'csep', 'critical skills', 'irish immigration'],
    flag: '🇮🇪',
    currency: 'EUR (€)',
    governingAuthority: 'Department of Justice & Immigration Service Delivery (ISD Ireland)',
    officialLanguage: 'English & Irish',
    overview: 'Ireland is Europe’s primary English-speaking tech hub, featuring the Critical Skills Employment Permit and 2-year Stamp 4 PR transition.',
    pathways: [
      {
        name: 'Critical Skills Employment Permit (CSEP)',
        category: 'WORK_PERMIT',
        description: 'Work permit for high-demand professions (ICT, engineering, nursing, finance) leading to Stamp 4 permanent residence after just 2 years.',
        eligibilitySnippet: 'Job offer with salary €38,000+ on Critical Skills list, or €64,000+ for all other eligible roles.',
      },
      {
        name: 'Third Level Graduate Scheme (Stamp 1G)',
        category: 'STUDY_GRADUATE',
        description: '1 to 2-year post-study work visa for graduates of Irish universities to work full-time or transition to a CSEP.',
        eligibilitySnippet: 'Degree from recognized Irish higher education institution.',
      },
      {
        name: 'General Employment Permit',
        category: 'WORK_PERMIT',
        description: 'Employer-sponsored permit for roles not on the ineligible occupations list.',
        eligibilitySnippet: 'Requires Labor Market Needs Test and minimum €34,000 salary.',
      },
    ],
    keyRequirements: [
      'Valid Employment Permit issued by the Department of Enterprise, Trade and Employment (DETE)',
      'Irish National Visa Application (AVATS) submission',
      'Private medical insurance certificate',
      'Irish Residence Permit (IRP) appointment upon arrival in Ireland',
    ],
    processingTimeOverview: 'DETE Permit: 4–8 weeks | Consular Visa: 3–6 weeks',
    primaryRoute: platformRoutes.countryDetail('IE').path,
    faqPromptSuggestions: ['How to transition from CSEP to Stamp 4 PR in Ireland?', 'What jobs qualify for Irish Critical Skills?'],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    aliases: ['netherlands', 'dutch', 'holland', 'amsterdam', 'ind', 'kennismigrant', 'zoekjaar'],
    flag: '🇳🇱',
    currency: 'EUR (€)',
    governingAuthority: 'Immigration and Naturalisation Service (IND)',
    officialLanguage: 'Dutch (90%+ English proficiency nationwide)',
    overview: 'The Netherlands offers streamlined fast-track visas for Highly Skilled Migrants, graduate orientation years, and 30% tax facility.',
    pathways: [
      {
        name: 'Highly Skilled Migrant (Kennismigrant) Visa',
        category: 'WORK_PERMIT',
        description: 'Fast-track visa sponsored by an IND-recognized sponsor with salary thresholds (€5,688/mo for 30+, €4,171/mo for under 30).',
        eligibilitySnippet: 'Employment contract with IND-recognized sponsor meeting statutory salary threshold.',
      },
      {
        name: 'Orientation Year for Highly Educated Persons (Zoekjaar)',
        category: 'STUDY_GRADUATE',
        description: '1-year open work permit for graduates of top 200 global universities or Dutch universities within the past 3 years.',
        eligibilitySnippet: 'Master/PhD from top 200 university (Times/QS/Shanghai rankings).',
      },
      {
        name: 'Dutch-American Friendship Treaty (DAFT)',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Simplified 2-year residence permit for US citizens starting a business in the Netherlands with a €4,500 capital deposit.',
        eligibilitySnippet: 'US citizenship + registered Dutch enterprise + €4,500 minimum capital.',
      },
    ],
    keyRequirements: [
      'Sponsorship by an IND-recognized organization (for Kennismigrant)',
      'BSN (Burgerservicenummer) citizen registration at local municipality (Gemeente)',
      'Dutch statutory basic health insurance (Basisverzekering)',
      'Tuberculosis test (where required by nationality)',
    ],
    processingTimeOverview: 'IND Highly Skilled Migrant: 2–4 weeks | Zoekjaar: 4–8 weeks',
    primaryRoute: platformRoutes.countryDetail('NL').path,
    faqPromptSuggestions: ['What are the salary thresholds for Dutch Highly Skilled Migrants?', 'How does the Zoekjaar Search Year visa work?'],
  },
  {
    code: 'CBI',
    name: 'Caribbean CBI (St. Kitts, Dominica, Grenada, Antigua, St. Lucia)',
    aliases: ['caribbean', 'dominica', 'st kitts', 'saint kitts', 'grenada', 'antigua', 'st lucia', 'saint lucia', 'caribbean passport'],
    flag: '🌴',
    currency: 'USD ($)',
    governingAuthority: 'Eastern Caribbean Citizenship by Investment Units (CIU / CBIU)',
    officialLanguage: 'English',
    overview: 'Direct sovereign citizenship and second passports within 3–6 months granting visa-free travel to 140+ countries including the UK, EU Schengen, and Singapore.',
    pathways: [
      {
        name: 'National Economic Fund / Government Donation',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Direct non-refundable donation starting at $200,000 USD for Dominica, St. Lucia, Antigua, and Grenada ($250,000 for St. Kitts).',
        eligibilitySnippet: 'Pass mandatory government due diligence and source-of-funds verification.',
      },
      {
        name: 'Approved Real Estate Investment',
        category: 'INVESTMENT_GOLDEN_VISA',
        description: 'Minimum $400,000 USD investment in government-approved 5-star resort shares or luxury villas, held for 5–7 years.',
        eligibilitySnippet: 'Purchase share in approved resort project with rental returns.',
      },
    ],
    keyRequirements: [
      'Clean background check and zero criminal record across all jurisdictions',
      'Audited source of wealth and banking transaction trail',
      'Mandatory virtual or in-person due diligence interview',
      'Certified medical fitness certificate with HIV test',
    ],
    processingTimeOverview: 'Fast-Track: 3–6 months for full citizenship approval and passport issuance',
    primaryRoute: platformRoutes.cbiPrograms.path,
    faqPromptSuggestions: ['Which Caribbean country is fastest for CBI?', 'What are the visa-free travel benefits of a Caribbean passport?'],
  },
];

/**
 * Detects if a query is explicitly targeting a specific country or jurisdiction
 */
export function detectCountryIntent(query: string): CountryKnowledgeProfile | null {
  const q = query.toLowerCase();

  for (const country of countryProfiles) {
    if (country.aliases.some((alias) => q.includes(alias))) {
      return country;
    }
  }

  return null;
}

/**
 * Generates an unmixed, country-accurate response for the detected nation
 */
export function formatCountrySpecificResponse(country: CountryKnowledgeProfile): string {
  const timePolicy = findTimeSensitivePolicy(country.code);

  const pathwaysMarkdown = country.pathways
    .map(
      (p, idx) =>
        `### ${idx + 1}. ${p.name}
- **Overview**: ${p.description}
- **Key Eligibility Criteria**: ${p.eligibilitySnippet}`
    )
    .join('\n\n');

  const requirementsMarkdown = country.keyRequirements
    .map((r) => `- ${r}`)
    .join('\n');

  return `## ${country.flag} Immigration Pathways to ${country.name}

${country.overview}

**Official Authority**: ${country.governingAuthority}
**Currency & Language**: ${country.currency} | ${country.officialLanguage}
**General Processing Timeline**: ${country.processingTimeOverview}

---

${pathwaysMarkdown}

---

### Core Documentation & Entry Requirements for ${country.name}:
${requirementsMarkdown}

### Next Steps on Platform:
- [Explore Full ${country.name} Guide & Visa Programs](${country.primaryRoute})
- [Check Points & Eligibility for ${country.name}](${platformRoutes.eligibility.path})
- [Compare ${country.name} with Other Destinations](${platformRoutes.compare.path})
- [Book a Strategy Session with a ${country.name} Licensed Specialist](${platformRoutes.consultation.path})

${formatTimeSensitiveFooter(timePolicy)}`;
}


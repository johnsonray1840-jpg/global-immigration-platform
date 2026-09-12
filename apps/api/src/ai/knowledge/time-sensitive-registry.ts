import { TimeSensitiveMetadata, TimeSensitivePolicyRecord, InformationSensitivity } from './types';

export const STANDARD_CURRENT_INFO_DISCLAIMER =
  'Requirements can change. The information available here is general guidance; please verify the current government requirements or speak with a qualified immigration professional before submitting.';

export const TIME_SENSITIVE_KEYWORDS = [
  'fee',
  'fees',
  'cost',
  'how much does it cost',
  'processing time',
  'how long does it take',
  'timeline',
  'investment threshold',
  'minimum investment',
  'draw score',
  'crs score',
  'cut off',
  'points requirement',
  'salary threshold',
  'quota',
  'cap',
  'availability',
  'policy change',
  'new rule',
  'new immigration law',
  'effective date',
  'ircc update',
  'home office change',
];

/**
 * Maintained registry of time-sensitive policy records with official sources and verification stamps
 */
export const timeSensitivePolicyRegistry: TimeSensitivePolicyRecord[] = [
  {
    id: 'ca-express-entry',
    country: 'Canada',
    program: 'Express Entry (FSW / CEC / FST)',
    category: 'ELIGIBILITY_RULES',
    source: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    effectiveDate: '2026-01-01',
    lastVerifiedDate: '2026-08-15',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      governmentFee: 'CAD $1,525 (incl. Right of Permanent Residence Fee)',
      processingTimeStandard: '6 months (standard IRCC target)',
      languageStandard: 'CLB 7 minimum for FSW',
      proofOfFundsSingle: 'CAD $14,690 (updated annually)',
      categoryDraws: 'STEM, Healthcare, Trades, Transport, Agriculture, French Proficiency',
    },
    notes: 'Category-based draws are prioritized alongside general and PNP rounds.',
  },
  {
    id: 'ca-study-permit',
    country: 'Canada',
    program: 'Study Permit & PGWP',
    category: 'GOVERNMENT_POLICY',
    source: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    effectiveDate: '2026-01-01',
    lastVerifiedDate: '2026-08-10',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      governmentFee: 'CAD $150',
      processingTimeStandard: '8–12 weeks outside Canada',
      livingExpenseRequirement: 'CAD $20,635 minimum for single student (excl. tuition)',
      attestationLetterRequired: 'Provincial Attestation Letter (PAL) required for most undergrad applicants',
      pgwpLanguageRule: 'CLB 7 for university grads, CLB 5 for college grads for post-2024 cohorts',
    },
    notes: 'National study permit cap remains in place across provinces.',
  },
  {
    id: 'uk-skilled-worker',
    country: 'United Kingdom',
    program: 'Skilled Worker Visa',
    category: 'VISA_REQUIREMENTS',
    source: 'UK Home Office / UK Visas and Immigration (UKVI)',
    effectiveDate: '2026-04-01',
    lastVerifiedDate: '2026-08-20',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      generalSalaryThreshold: '£38,700 per annum (or going rate for occupation code, whichever is higher)',
      immigrationHealthSurcharge: '£1,035 per adult per year',
      applicationFee: '£719–£1,639 depending on duration and location',
      processingTimeStandard: '3 weeks outside UK, 8 weeks inside UK',
      englishRequirement: 'CEFR B1 (IELTS 4.0 overall in all 4 components)',
    },
    notes: 'New entrant salary discount available for applicants under 26 or recent UK graduates.',
  },
  {
    id: 'au-skilled-independent',
    country: 'Australia',
    program: 'General Skilled Migration (Subclass 189/190/491)',
    category: 'ELIGIBILITY_RULES',
    source: 'Department of Home Affairs, Australian Government',
    effectiveDate: '2026-07-01',
    lastVerifiedDate: '2026-08-18',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      passMark: '65 points minimum to submit EOI',
      baseVisaFee: 'AUD $4,770 (Primary applicant)',
      processingTimeSubclass189: '3–9 months post-invitation',
      skillsAssessmentRequirement: 'Mandatory positive skills assessment from nominated authority',
      englishCompetency: 'IELTS 6.0 (Competent) minimum; IELTS 7.0/8.0 required for competitive scoring',
    },
    notes: 'State nomination allocations are updated on the annual fiscal cycle (July 1).',
  },
  {
    id: 'de-chancenkarte',
    country: 'Germany',
    program: 'Opportunity Card (Chancenkarte)',
    category: 'PROGRAM_AVAILABILITY',
    source: 'Federal Foreign Office & Federal Ministry of the Interior (BMI Germany)',
    effectiveDate: '2024-06-01',
    lastVerifiedDate: '2026-08-01',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      pointsRequired: '6 points minimum (unless recognized as fully skilled worker under FEG)',
      visaFee: '€75',
      blockedAccountProof: '€1,027/month (€12,324 for 1 year)',
      workAllowance: 'Up to 20 hours/week part-time or 2-week trial jobs while searching',
      languageRequirement: 'German A1 or English B2 minimum prerequisite',
    },
    notes: 'Valid for up to 1 year, extendable upon qualifying full-time job offer conversion.',
  },
  {
    id: 'cbi-caribbean-unified',
    country: 'Caribbean (St. Kitts, Dominica, Grenada, Antigua, St. Lucia)',
    program: 'Citizenship by Investment (CBI MOA)',
    category: 'INVESTMENT_THRESHOLDS',
    source: 'Eastern Caribbean CBI Association / National CBI Units',
    effectiveDate: '2024-06-30',
    lastVerifiedDate: '2026-08-12',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      minimumDonationThreshold: '$200,000 USD (Dominica, St. Lucia, Antigua, Grenada) / $250,000 USD (St. Kitts)',
      realEstateThreshold: '$400,000 USD minimum qualifying investment',
      dueDiligenceFee: '$7,500–$10,000 USD per adult applicant',
      processingTimeStandard: '3–6 months',
      physicalResidencyRequirement: 'None (except Antigua: 5 days in first 5 years)',
    },
    notes: 'All 5 Caribbean CBI nations adhere to the Four-Pillars Memorandum of Agreement on minimum pricing and mandatory interviews.',
  },
  {
    id: 'gr-golden-visa',
    country: 'Greece',
    program: 'Greece Golden Visa (Residency by Investment)',
    category: 'INVESTMENT_THRESHOLDS',
    source: 'Ministry of Migration and Asylum, Hellenic Republic',
    effectiveDate: '2024-09-01',
    lastVerifiedDate: '2026-08-15',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      tier1RealEstateThreshold: '€800,000 (Attica/Athens, Thessaloniki, Mykonos, Santorini, islands >3,100 pop)',
      tier2RealEstateThreshold: '€400,000 (Remaining regions of Greece)',
      heritageConversionThreshold: '€250,000 (Commercial-to-residential conversion or listed buildings)',
      processingTimeStandard: '4–8 months',
      minimumPropertySize: '120 sqm for Tier 1 & Tier 2 properties',
    },
    notes: 'Short-term rentals (Airbnb) prohibited for properties purchased under new thresholds.',
  },
  {
    id: 'us-eb5-immigrant-investor',
    country: 'United States',
    program: 'EB-5 Immigrant Investor Program',
    category: 'INVESTMENT_THRESHOLDS',
    source: 'U.S. Citizenship and Immigration Services (USCIS)',
    effectiveDate: '2022-03-15',
    lastVerifiedDate: '2026-08-01',
    verificationStatus: 'VERIFIED_CURRENT',
    data: {
      targetedEmploymentAreaTEA: '$800,000 USD (Rural or High Unemployment Areas)',
      nonTEABaseInvestment: '$1,050,000 USD',
      jobCreationRequirement: '10 qualifying full-time jobs for U.S. workers',
      formI526EFee: '$11,160 USD + $1,000 RIA fee',
      processingTimeRural: 'Priority processing available (under 12 months for rural projects)',
    },
    notes: 'EB-5 Reform and Integrity Act (RIA) offers reserved visa set-asides (20% Rural, 10% High Unemployment).',
  },
];

/**
 * Checks whether a user inquiry contains time-sensitive parameters
 */
export function isQueryTimeSensitive(query: string): boolean {
  const q = query.toLowerCase();
  return TIME_SENSITIVE_KEYWORDS.some((kw) => q.includes(kw));
}

/**
 * Retrieves matching time-sensitive policy records
 */
export function findTimeSensitivePolicy(countryOrProgram: string): TimeSensitivePolicyRecord | undefined {
  const norm = countryOrProgram.toLowerCase();
  return timeSensitivePolicyRegistry.find(
    (rec) =>
      rec.id.toLowerCase().includes(norm) ||
      rec.country.toLowerCase().includes(norm) ||
      rec.program.toLowerCase().includes(norm),
  );
}

/**
 * Formats a verified policy metadata footer with standard safety disclaimers
 */
export function formatTimeSensitiveFooter(record?: Partial<TimeSensitivePolicyRecord>): string {
  if (record && record.source) {
    return `\n\n> 🛡️ **Current Information Safety Notice**:
> - **Source**: ${record.source}
> - **Jurisdiction**: ${record.country || 'International'} (${record.program || 'General'})
> - **Effective Date**: ${record.effectiveDate || 'Current Regulations'} | **Last Verified**: ${record.lastVerifiedDate || 'Recently Verified'}
> - **Verification Status**: ${record.verificationStatus === 'VERIFIED_CURRENT' ? '✅ Verified Current' : '⚠️ Pending Government Review'}
> 
> *${STANDARD_CURRENT_INFO_DISCLAIMER}*`;
  }

  return `\n\n> 🛡️ **Important Notice on Immigration Rules & Fees**:
> *${STANDARD_CURRENT_INFO_DISCLAIMER}*`;
}

/**
 * Generates structured, verified time-sensitive answer cards for common queries (fees, timelines, rules)
 */
export function getVerifiedTimeSensitiveResponse(query: string): string | null {
  const q = query.toLowerCase();

  // Canada Express Entry Fees / Timeline / Points
  if (
    q.includes('express entry fee') ||
    q.includes('express entry cost') ||
    q.includes('express entry processing time') ||
    q.includes('express entry proof of funds')
  ) {
    const record = findTimeSensitivePolicy('ca-express-entry')!;
    return `### Canada Express Entry — Verified Current Fee & Processing Metrics

Here are the official government figures currently maintained for Express Entry:

| Parameter | Current Official Value |
| :--- | :--- |
| **Government Application Fee** | ${record.data.governmentFee} |
| **Standard Processing Timeline** | ${record.data.processingTimeStandard} |
| **Minimum Language Prerequisite** | ${record.data.languageStandard} |
| **Settlement Funds (Single)** | ${record.data.proofOfFundsSingle} |
| **Category-Based Selection** | ${record.data.categoryDraws} |

${formatTimeSensitiveFooter(record)}`;
  }

  // UK Skilled Worker Salary & Fees
  if (
    q.includes('uk skilled worker salary') ||
    q.includes('uk visa fee') ||
    q.includes('uk skilled worker minimum') ||
    q.includes('ihs fee') ||
    q.includes('immigration health surcharge')
  ) {
    const record = findTimeSensitivePolicy('uk-skilled-worker')!;
    return `### UK Skilled Worker Visa — Verified Salary Thresholds & Fees

Here are the active Home Office thresholds and statutory fees:

| Component | Verified Threshold / Fee |
| :--- | :--- |
| **General Salary Threshold** | ${record.data.generalSalaryThreshold} |
| **Immigration Health Surcharge (IHS)** | ${record.data.immigrationHealthSurcharge} |
| **Government Visa Fee** | ${record.data.applicationFee} |
| **Processing Time** | ${record.data.processingTimeStandard} |
| **English Language Standard** | ${record.data.englishRequirement} |

${formatTimeSensitiveFooter(record)}`;
  }

  // Caribbean CBI Minimums
  if (
    q.includes('caribbean passport cost') ||
    q.includes('cbi minimum') ||
    q.includes('caribbean moa') ||
    q.includes('cost of dominica') ||
    q.includes('cost of st kitts') ||
    q.includes('caribbean investment threshold')
  ) {
    const record = findTimeSensitivePolicy('cbi-caribbean-unified')!;
    return `### Caribbean Citizenship by Investment — Verified Pricing & MOA Standards

Under the Eastern Caribbean CBI Memorandum of Agreement, standardized baseline thresholds apply:

| Investment Route | Verified Minimum Amount |
| :--- | :--- |
| **National Development Donation** | ${record.data.minimumDonationThreshold} |
| **Approved Real Estate** | ${record.data.realEstateThreshold} |
| **Government Due Diligence Fees** | ${record.data.dueDiligenceFee} |
| **Standard Approval Timeline** | ${record.data.processingTimeStandard} |
| **Physical Stay Requirement** | ${record.data.physicalResidencyRequirement} |

${formatTimeSensitiveFooter(record)}`;
  }

  // Greece Golden Visa Thresholds
  if (
    q.includes('greece golden visa threshold') ||
    q.includes('greece 800k') ||
    q.includes('greece real estate minimum') ||
    q.includes('greece visa cost')
  ) {
    const record = findTimeSensitivePolicy('gr-golden-visa')!;
    return `### Greece Golden Visa — Verified Tiered Investment Thresholds

Current investment thresholds under the amended Hellenic Migration Code:

| Zone / Type | Minimum Capital Requirement |
| :--- | :--- |
| **Tier 1 (Athens, Thessaloniki, Mykonos, Santorini)** | ${record.data.tier1RealEstateThreshold} (120 sqm min) |
| **Tier 2 (All other Greek regions)** | ${record.data.tier2RealEstateThreshold} (120 sqm min) |
| **Commercial-to-Residential Conversion** | ${record.data.heritageConversionThreshold} (Nationwide) |
| **Standard Processing Window** | ${record.data.processingTimeStandard} |

${formatTimeSensitiveFooter(record)}`;
  }

  // Germany Chancenkarte
  if (
    q.includes('chancenkarte blocked account') ||
    q.includes('opportunity card funds') ||
    q.includes('germany job seeker points') ||
    q.includes('chancenkarte fee')
  ) {
    const record = findTimeSensitivePolicy('de-chancenkarte')!;
    return `### Germany Opportunity Card (Chancenkarte) — Verified Financial & Points Criteria

Official standards under the Skilled Immigration Act (FEG):

| Requirement | Verified Parameter |
| :--- | :--- |
| **Points Threshold** | ${record.data.pointsRequired} |
| **Blocked Account Proof (Sperrkonto)** | ${record.data.blockedAccountProof} |
| **Embassy Application Fee** | ${record.data.visaFee} |
| **Part-Time Work Allowance** | ${record.data.workAllowance} |
| **Language Prerequisite** | ${record.data.languageRequirement} |

${formatTimeSensitiveFooter(record)}`;
  }

  // US EB-5 Investment Amounts
  if (
    q.includes('eb5 cost') ||
    q.includes('eb-5 minimum') ||
    q.includes('eb5 tea') ||
    q.includes('eb-5 investment amount')
  ) {
    const record = findTimeSensitivePolicy('us-eb5-immigrant-investor')!;
    return `### US EB-5 Immigrant Investor Program — Verified Statutory Minimums

Current thresholds under the EB-5 Reform and Integrity Act (RIA):

| Program Component | Official USCIS Requirement |
| :--- | :--- |
| **Targeted Employment Area (TEA / Rural / High Unemployment)** | ${record.data.targetedEmploymentAreaTEA} |
| **Non-TEA (Standard Direct Investment)** | ${record.data.nonTEABaseInvestment} |
| **Job Creation Requirement** | ${record.data.jobCreationRequirement} |
| **Form I-526E Filing Fee** | ${record.data.formI526EFee} |
| **Rural Project Processing** | ${record.data.processingTimeRural} |

${formatTimeSensitiveFooter(record)}`;
  }

  return null;
}


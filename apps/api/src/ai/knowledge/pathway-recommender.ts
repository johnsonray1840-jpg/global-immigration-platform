import { platformRoutes } from './website-knowledge';

export interface ApplicantProfileInput {
  age?: number;
  nationality?: string;
  residence?: string;
  education?: string; // High School, Bachelor's, Master's, PhD, Diploma
  occupation?: string;
  workExperienceYears?: number;
  languageAbility?: string; // High/CLB 9+, Moderate/CLB 7, Basic, Tested, None
  maritalStatus?: string; // Single, Married, Common-Law
  hasChildren?: boolean;
  hasJobOffer?: boolean;
  studyHistory?: string; // Local / Foreign
  investmentCapacity?: number; // USD / EUR capital
  destination?: string; // Canada, UK, Germany, Australia, USA, Portugal, Caribbean, etc.
  goal?: string; // Permanent Residence, Work, Study, Investment, Second Passport, Nomad
}

export interface PathwayRecommendation {
  pathwayName: string;
  destination: string;
  suitabilityStatus: 'Potentially suitable' | 'May qualify' | 'Appears relevant' | 'Requires further assessment';
  whyItFits: string;
  generalEligibility: string[];
  typicalDocumentation: string[];
  importantConsiderations: string[];
  recommendedNextStep: {
    label: string;
    route: string;
    description: string;
  };
}

export interface RecommendationResult {
  headline: string;
  suitabilitySummary: string;
  pathways: PathwayRecommendation[];
  formalDisclaimer: string;
}

export function evaluatePathways(input: ApplicantProfileInput): RecommendationResult {
  const recommendations: PathwayRecommendation[] = [];
  const dest = input.destination?.toLowerCase() || '';
  const goal = input.goal?.toLowerCase() || '';
  const isCanada = !dest || dest.includes('canada');
  const isEurope = dest.includes('germany') || dest.includes('uk') || dest.includes('portugal') || dest.includes('europe') || dest.includes('spain');
  const isAustralia = dest.includes('australia') || dest.includes('aus');
  const isUSA = dest.includes('usa') || dest.includes('united states') || dest.includes('america');
  const isCBI = dest.includes('caribbean') || dest.includes('cbi') || (input.investmentCapacity && input.investmentCapacity >= 100000);

  // 1. Canada Express Entry (Federal Skilled Worker / CEC)
  if (isCanada && (!goal || goal.includes('pr') || goal.includes('work') || goal.includes('permanent'))) {
    const isMasterOrPhD = input.education?.toLowerCase().includes('master') || input.education?.toLowerCase().includes('phd');
    const isOptimalAge = input.age && input.age >= 20 && input.age <= 32;
    const hasSolidExp = input.workExperienceYears && input.workExperienceYears >= 3;

    const suitability: 'Potentially suitable' | 'May qualify' | 'Appears relevant' | 'Requires further assessment' =
      isOptimalAge && isMasterOrPhD && hasSolidExp ? 'Potentially suitable' : 'May qualify';

    recommendations.push({
      pathwayName: 'Canada Express Entry (Federal Skilled Worker / CEC)',
      destination: 'Canada',
      suitabilityStatus: suitability,
      whyItFits: `Your profile ${input.age ? `at age ${input.age}` : ''} ${input.education ? `with a ${input.education}` : ''} ${input.workExperienceYears ? `and ${input.workExperienceYears} years experience` : ''} aligns with the core Human Capital factors evaluated in the Comprehensive Ranking System (CRS).`,
      generalEligibility: [
        'Minimum 67/100 points on the Federal Skilled Worker selection grid (evaluating age, education, language, and experience).',
        'Official Language Benchmark: Minimum CLB 7 (IELTS 6.0 in all bands), with CLB 9 (IELTS 8777) significantly maximizing CRS rank.',
        'Educational Credential Assessment (ECA) for degrees obtained outside Canada.',
        'At least 1 continuous year of full-time skilled work under TEER 0, 1, 2, or 3.',
      ],
      typicalDocumentation: [
        'Valid International Passport (bio page).',
        'Official Language Score Card (IELTS General / CELPIP-G / TEF Canada).',
        'ECA Report (WES, ICAS, or IQAS).',
        'Detailed Employment Reference Letters with duties and NOC/TEER codes.',
        'Police Clearance Certificates (PCC) and Immigration Medical Exam (IME).',
        'Proof of Settlement Funds (unless working in Canada with a valid job offer).',
      ],
      importantConsiderations: [
        'CRS draw cut-offs fluctuate bi-weekly; category-based draws (STEM, Healthcare, French, Trades) frequently have lower cut-offs.',
        'Age points begin declining gradually after age 30.',
        'Spouse language and education can contribute bonus CRS points if applying together.',
      ],
      recommendedNextStep: {
        label: 'Calculate Express Entry Score',
        route: platformRoutes.eligibility.path,
        description: 'Run your exact CRS point calculation and language benchmarks.',
      },
    });
  }

  // 2. Provincial Nominee Programs (PNP)
  if (isCanada && (!goal || goal.includes('pr') || goal.includes('work') || goal.includes('provincial'))) {
    recommendations.push({
      pathwayName: 'Canada Provincial Nominee Programs (PNPs: Ontario, BC, Alberta)',
      destination: 'Canada',
      suitabilityStatus: 'Appears relevant',
      whyItFits: 'Provincial Nominee streams offer a valuable boost of +600 CRS points for applicants with in-demand occupational backgrounds or regional ties.',
      generalEligibility: [
        'Active Express Entry profile or direct provincial Expression of Interest (EOI).',
        'Occupation listed on the province’s in-demand skills list (e.g., Tech/Healthcare in Ontario, Tech Stream in BC, Accelerated Tech in Alberta).',
        'Intention to settle in the nominating province.',
      ],
      typicalDocumentation: [
        'Express Entry Profile Number and Job Seeker Validation Code.',
        'Educational credentials & ECA verification.',
        'Proof of relevant work experience in target NOC/TEER code.',
        'Proof of settlement funds for the specific province.',
      ],
      importantConsiderations: [
        'A provincial nomination guarantees an Invitation to Apply (ITA) in the subsequent Express Entry draw.',
        'Some provincial streams require an approved job offer, while human capital streams do not.',
      ],
      recommendedNextStep: {
        label: 'Book an RCIC Consultant',
        route: platformRoutes.consultation.path,
        description: 'Review provincial category quotas and PNP nomination strategies.',
      },
    });
  }

  // 3. Germany Opportunity Card (Chancenkarte) & EU Blue Card
  if ((isEurope || dest.includes('germany')) && (!goal || goal.includes('work') || goal.includes('pr') || goal.includes('job'))) {
    recommendations.push({
      pathwayName: 'Germany Opportunity Card (Chancenkarte) / EU Blue Card',
      destination: 'Germany',
      suitabilityStatus: 'May qualify',
      whyItFits: 'Germany offers accessible points-based entry for foreign graduates and direct fast-track settlement permits in 21–27 months on an EU Blue Card.',
      generalEligibility: [
        'Chancenkarte: Score at least 6 points based on recognized qualification, age under 35/40, work experience, and German (A1/A2) or English (B2) skills.',
        'EU Blue Card: University degree + qualifying employment contract in Germany meeting annual minimum gross salary threshold.',
        'Sufficient financial proof (~€11,208/year in blocked account or employment earnings).',
      ],
      typicalDocumentation: [
        'Recognized University Degree or Anabin database equivalence statement.',
        'Language Certificates (Goethe/TestDaF for German, IELTS/TOEFL for English).',
        'Valid Passport and Comprehensive German Health Insurance.',
        'Blocked bank account proof (Sperrkonto) or signed employment contract.',
      ],
      importantConsiderations: [
        'Chancenkarte allows part-time work (up to 20h/week) and trial work while interviewing.',
        'Fastest route to German permanent residency (Niederlassungserlaubnis) in Europe.',
      ],
      recommendedNextStep: {
        label: 'Explore Germany Guide',
        route: platformRoutes.countryDetail('DE').path,
        description: 'Review Chancenkarte point matrix and salary thresholds.',
      },
    });
  }

  // 4. European Digital Nomad Visas (Portugal D8 / Spain Nomad)
  if ((isEurope || dest.includes('portugal') || dest.includes('spain')) && (goal.includes('nomad') || goal.includes('remote') || goal.includes('work') || !goal)) {
    recommendations.push({
      pathwayName: 'Portugal D8 Digital Nomad Visa / Spain Remote Work Visa',
      destination: 'Portugal & Spain',
      suitabilityStatus: 'Potentially suitable',
      whyItFits: 'Ideal for professionals, software engineers, and online business owners earning remote foreign income who desire European residence and Schengen travel.',
      generalEligibility: [
        'Portugal D8: Proof of monthly remote employment income of at least 4x Portuguese minimum wage (~€3,280/month).',
        'Spain Nomad Visa: Monthly remote income of at least 200% of Spanish minimum wage (~€2,600/month) + 3 months contract history.',
        'Clean criminal record and 1-year accommodation proof.',
      ],
      typicalDocumentation: [
        'Remote Employment Contract or Freelance Client Service Agreements.',
        'Bank statements showing last 6 months of remote wage deposits.',
        'Tax returns and proof of tax residence.',
        'Police Clearance Certificate (PCC) with Hague Apostille.',
        'Proof of registered accommodation and private medical insurance.',
      ],
      importantConsiderations: [
        'Counts toward the 5-year permanent residence and EU citizenship timeline.',
        'Spain offers a favorable 24% flat tax regime (Beckham Law) for qualifying nomad applicants.',
      ],
      recommendedNextStep: {
        label: 'Explore Visa Programs',
        route: platformRoutes.programs.path,
        description: 'Compare European remote work income thresholds and tax rules.',
      },
    });
  }

  // 5. Citizenship & Residency by Investment (Caribbean CBI / Golden Visas)
  if (isCBI || (input.investmentCapacity && input.investmentCapacity >= 100000) || goal.includes('cbi') || goal.includes('invest') || goal.includes('passport')) {
    recommendations.push({
      pathwayName: 'Caribbean Citizenship by Investment / European Golden Visas',
      destination: 'Caribbean Nations (St. Kitts, Dominica, Grenada) & Southern Europe (Greece, Portugal)',
      suitabilityStatus: 'Potentially suitable',
      whyItFits: 'Provides direct second passport issuance within 3–6 months or European residency with no relocation/physical stay burdens.',
      generalEligibility: [
        'Caribbean CBI: Government donation from $100,000–$240,000 or $200,000+ approved real estate purchase.',
        'Greece Golden Visa: €250,000–€800,000 qualifying real estate acquisition.',
        'Portugal Golden Visa: €500,000 qualifying venture capital/investment fund allocation.',
        'Passing strict government due diligence and clean source of funds audit.',
      ],
      typicalDocumentation: [
        'Certified Passport Copies and National IDs.',
        'Audited Source of Wealth Documentation (commercial earnings, sale of assets, dividends).',
        'Official 12-Month Banking History.',
        'Comprehensive Police Clearances and Medical Certificates.',
      ],
      importantConsiderations: [
        'Entire family included (spouse, dependent children, dependent parents).',
        'Visa-free access to 140+ countries (UK, Schengen, Singapore, Hong Kong).',
      ],
      recommendedNextStep: {
        label: 'Explore Citizenship by Investment',
        route: platformRoutes.cbiPrograms.path,
        description: 'Calculate itemized capital outlay and family surcharge schedules.',
      },
    });
  }

  // 6. Global Study-to-Work & Scholarships
  if (goal.includes('study') || goal.includes('scholarship') || (input.age && input.age < 30 && !input.workExperienceYears)) {
    recommendations.push({
      pathwayName: 'Global Study-to-Work & Scholarship Pathway (USA, Canada, UK, Germany)',
      destination: 'Global Tier-1 Destinations',
      suitabilityStatus: 'Potentially suitable',
      whyItFits: 'Enrolling in an accredited degree program provides an immediate visa, scholarship funding, and open post-graduation work rights (PGWP/OPT) leading to PR.',
      generalEligibility: [
        'Unconditional Admission Letter from an accredited university (DLI / SEVP / CAS).',
        'Proof of financial capacity (first-year tuition + living costs) or scholarship grant award.',
        'Academic transcripts meeting GPA requirements.',
      ],
      typicalDocumentation: [
        'Official University Acceptance Letter.',
        'Scholarship Award Letter or 6-Month Bank Statements.',
        'Academic Transcripts and Degree Certificates.',
        'Statement of Purpose (SOP) and Language Test Scores (IELTS/TOEFL).',
      ],
      importantConsiderations: [
        'Access 10+ fully funded scholarships offering up to $150,000 in tuition and living grants.',
        'Unlocks 2 to 3 years of post-study work authorization.',
      ],
      recommendedNextStep: {
        label: 'Browse 10+ Global Scholarships',
        route: platformRoutes.scholarships.path,
        description: 'Explore active deadlines, degree levels, and funding amounts.',
      },
    });
  }

  // Fallback if no specific condition matched
  if (recommendations.length === 0) {
    recommendations.push({
      pathwayName: 'Comprehensive Skilled Migration & Points Assessment',
      destination: input.destination || 'Global',
      suitabilityStatus: 'Requires further assessment',
      whyItFits: 'Your profile exhibits foundational qualifications that require a detailed points and statutory criteria audit.',
      generalEligibility: [
        'Post-secondary education evaluated by an authorized credential assessment body.',
        'Demonstrated skilled work experience and verified language proficiency.',
      ],
      typicalDocumentation: [
        'Passport bio page.',
        'Degree certificates and academic transcripts.',
        'Employment letters and CV/Resume.',
      ],
      importantConsiderations: [
        'Specific point thresholds depend on target country selection and draw cut-offs.',
      ],
      recommendedNextStep: {
        label: 'Launch Points Assessment',
        route: platformRoutes.eligibility.path,
        description: 'Run our automated points calculator across multiple destinations.',
      },
    });
  }

  return {
    headline: `Immigration Pathway Evaluation ${input.destination ? `for ${input.destination}` : ''}`,
    suitabilitySummary: `Based on the preliminary details provided, the following pathways appear relevant and require further formal assessment:`,
    pathways: recommendations,
    formalDisclaimer:
      'Disclaimer: This evaluation provides informational guidance on potential program alignment. Immigration regulations and score cut-offs change frequently; a formal legal assessment by our certified RCIC consultants and legal specialists is recommended before submitting an application.',
  };
}

/**
 * Formats a recommendation result into rich, executive markdown.
 */
export function formatRecommendationMarkdown(result: RecommendationResult): string {
  let md = `### ${result.headline}\n\n`;
  md += `${result.suitabilitySummary}\n\n`;

  result.pathways.forEach((p, idx) => {
    md += `#### ${idx + 1}. ${p.pathwayName}\n`;
    md += `- **Status**: *${p.suitabilityStatus}*\n`;
    md += `- **Why It Fits**: ${p.whyItFits}\n`;
    md += `- **General Eligibility**:\n`;
    p.generalEligibility.forEach((e) => (md += `  • ${e}\n`));
    md += `- **Typical Documentation**:\n`;
    p.typicalDocumentation.forEach((d) => (md += `  • ${d}\n`));
    md += `- **Important Considerations**:\n`;
    p.importantConsiderations.forEach((c) => (md += `  • ${c}\n`));
    md += `- **Recommended Next Step**: [${p.recommendedNextStep.label}](${p.recommendedNextStep.route}) — ${p.recommendedNextStep.description}\n\n`;
  });

  md += `> **Important Notice**: ${result.formalDisclaimer}`;
  return md;
}

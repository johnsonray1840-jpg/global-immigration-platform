import { platformRoutes } from './website-knowledge';
import { INFORMATIONAL_ASSISTANT_DISCLAIMER } from './legal-safety-guard';

export type HighRiskCategory =
  | 'CRIMINAL_HISTORY'
  | 'VISA_REFUSAL'
  | 'DEPORTATION_REMOVAL'
  | 'INADMISSIBILITY'
  | 'OVERSTAY'
  | 'MISREPRESENTATION_BAN'
  | 'ASYLUM_REFUGEE'
  | 'COMPLEX_FAMILY'
  | 'IMMIGRATION_APPEAL';

export interface HighRiskRule {
  id: HighRiskCategory;
  name: string;
  keywords: string[];
  generalFrameworkOverview: string;
  potentialRemedies: string[];
  keyCautions: string[];
}

export const highRiskRules: HighRiskRule[] = [
  {
    id: 'CRIMINAL_HISTORY',
    name: 'Criminal History & Inadmissibility',
    keywords: [
      'criminal record',
      'criminal history',
      'dui',
      'drunk driving',
      'arrested',
      'convicted',
      'conviction',
      'felony',
      'misdemeanor',
      'criminal rehabilitation',
      'deemed rehabilitation',
      'criminal inadmissible',
      'police certificate problem',
    ],
    generalFrameworkOverview:
      'Criminal convictions (including minor offenses or offenses committed abroad, such as impaired driving/DUI) can render an applicant criminally inadmissible under foreign immigration laws. Equivalency assessments determine whether the foreign offense equates to a standard or serious crime under the destination country’s criminal code.',
    potentialRemedies: [
      '**Canada**: Application for Criminal Rehabilitation (or Deemed Rehabilitation if 10+ years have elapsed since sentence completion) or Temporary Resident Permit (TRP) for compelling travel.',
      '**United States**: INA § 212(h) Waiver of Inadmissibility filed via Form I-601 with proof of extreme hardship to qualifying relatives.',
      '**United Kingdom & Australia**: Character statutory declarations, character reference portfolios, and evidence of substantial rehabilitation over time.',
    ],
    keyCautions: [
      'Never conceal or omit any arrest, charge, or conviction, even if expunged, dismissed, or pardoned in your home country.',
      'Immigration officers evaluate foreign convictions against domestic laws (e.g., DUI in Canada is serious criminality with no automatic deemed rehabilitation).',
    ],
  },
  {
    id: 'VISA_REFUSAL',
    name: 'Previous Visa Refusals & Case Reapplication',
    keywords: [
      'visa refusal',
      'visa rejected',
      'refused my visa',
      'rejection letter',
      '214b',
      'section 214(b)',
      'ircc refusal',
      'gcms notes',
      'refused student visa',
      'refused tourist visa',
      'refused pr',
    ],
    generalFrameworkOverview:
      'A prior visa refusal does not permanently disqualify an applicant from future immigration, provided the refusal was based on eligibility grounds (e.g., ties to home country, financial evidence, or documentation gaps) rather than fraud or misrepresentation.',
    potentialRemedies: [
      '**Order Official File Notes (GCMS / FOIA / SAR)**: Obtain the internal visa officer case notes to understand the exact factual deficiency.',
      '**Fresh Reapplication with Rectified Evidence**: Submit a comprehensive submission letter addressing every specific ground cited by the previous officer.',
      '**Administrative Review / Reconsideration**: Request a formal review if the decision contained an administrative error or overlooked submitted evidence.',
    ],
    keyCautions: [
      'Always disclose all prior refusals across all countries; international databases share visa history.',
      'Do not reapply immediately with identical documentation; new, material evidence is required.',
    ],
  },
  {
    id: 'DEPORTATION_REMOVAL',
    name: 'Previous Deportation, Exclusion, or Removal Orders',
    keywords: [
      'deportation',
      'deported',
      'removal order',
      'exclusion order',
      'departure order',
      'authorization to return',
      'arc application',
      'i-212',
      'i212 waiver',
      'expedited removal',
    ],
    generalFrameworkOverview:
      'Being subject to a deportation or removal order creates a statutory bar against re-entering the issuing country without explicit legal authorization from senior immigration authorities.',
    potentialRemedies: [
      '**Canada**: Authorization to Return to Canada (ARC) application demonstrating compelling humanitarian or economic reasons to return.',
      '**United States**: Form I-212 (Application for Permission to Reapply for Admission into the United States After Deportation or Removal).',
      '**UK & EU**: Revocation of Deportation Order or expiry of statutory exclusion period with formal consular clearance.',
    ],
    keyCautions: [
      'Attempting to enter while subject to an active removal order is a serious criminal immigration offense.',
      'Removal orders require formal legal representation and detailed legal submissions.',
    ],
  },
  {
    id: 'MISREPRESENTATION_BAN',
    name: 'Misrepresentation Allegations & 5-Year Bans',
    keywords: [
      'misrepresentation',
      'procedural fairness letter',
      'pfl letter',
      'section 40',
      '5 year ban',
      '10 year ban',
      'fraud allegation',
      'misrepresented facts',
      'inadmissible for misrepresentation',
      '212(a)(6)(c)',
    ],
    generalFrameworkOverview:
      'Misrepresentation involves providing false information, submitting altered documents, or omitting material facts that could induce an administrative error. Destination countries enforce severe statutory bans against misrepresentation (e.g., Canada 5-year ban under IRPA §40; UK 10-year deception ban; US permanent inadmissibility under INA §212(a)(6)(C)(i)).',
    potentialRemedies: [
      '**Procedural Fairness Response (PFL)**: Timely submission (usually within 15–30 days) of a rigorous legal rebuttal showing lack of intent, third-party fraud (unauthorized consultant), or innocent mistake.',
      '**US Non-immigrant / Immigrant Waiver (I-601 / 212(d)(3))**: Demonstrating extreme hardship to a US citizen or LPR spouse/parent.',
      '**Judicial Review at Federal Court**: Challenging an unreasonable or procedurally unfair misrepresentation finding before a judge.',
    ],
    keyCautions: [
      'Misrepresentation findings apply across all future visa and PR categories for the duration of the ban.',
      'Immediate intervention by a licensed attorney or RCIC is critical upon receiving a Procedural Fairness Letter.',
    ],
  },
  {
    id: 'OVERSTAY',
    name: 'Visa Overstay & Unlawful Presence',
    keywords: [
      'overstay',
      'overstayed',
      'out of status',
      'expired visa',
      'unlawful presence',
      'restoration of status',
      'lost status',
      '3 year bar',
      '10 year bar overstay',
    ],
    generalFrameworkOverview:
      'Remaining in a country beyond the authorized period of stay results in loss of legal status and may trigger statutory re-entry bars upon departure (e.g., US 3-year bar for >180 days unlawful presence, 10-year bar for >1 year).',
    potentialRemedies: [
      '**Canada Restoration of Status**: Must be filed within 90 days of losing temporary resident status.',
      '**Voluntary Departure & Status Adjustment**: Regularizing status through eligible spousal sponsorship or specialized inland programs where allowed by statute.',
      '**Non-Immigrant INA § 212(d)(3) Waiver**: Applying for waiver relief before re-applying for US entry.',
    ],
    keyCautions: [
      'Continued unauthorized stay compounds inadmissibility and risks detention/removal.',
      'A formal case audit is required before departing to assess applicable re-entry bars.',
    ],
  },
  {
    id: 'ASYLUM_REFUGEE',
    name: 'Asylum, Refugee & Humanitarian Claims',
    keywords: [
      'asylum',
      'refugee',
      'unhcr',
      'persecution',
      'fleeing my country',
      'political asylum',
      'safe third country',
      'humanitarian and compassionate',
      'h&c application',
      'refugee claim',
    ],
    generalFrameworkOverview:
      'Asylum and refugee protection are governed by international treaties (1951 Geneva Convention) and domestic statutes for individuals with a well-founded fear of persecution based on race, religion, nationality, political opinion, or membership in a particular social group.',
    potentialRemedies: [
      '**In-Country Asylum Claim / IRB Refugee Board**: Formal hearing with detailed country condition evidence and personal testimony.',
      '**Humanitarian & Compassionate (H&C) Grounds**: Discretionary permanent residence relief based on establishment, best interests of affected children, and adverse hardship in country of origin.',
      '**Private Sponsorship of Refugees (PSR)**: Community and group-of-five sponsorship programs.',
    ],
    keyCautions: [
      'Asylum procedures have strict jurisdictional rules, including Safe Third Country Agreements (STCA).',
      'Asylum claims require individualized legal representation by specialized refugee counsel.',
    ],
  },
  {
    id: 'IMMIGRATION_APPEAL',
    name: 'Immigration Appeals & Judicial Review',
    keywords: [
      'immigration appeal',
      'appeal visa decision',
      'judicial review',
      'federal court',
      'iad appeal',
      'administrative review',
      'tribunal appeal',
      'immigration lawyer appeal',
      'challenge refusal',
    ],
    generalFrameworkOverview:
      'Refusal decisions can often be challenged through administrative tribunals (e.g., Canada Immigration Appeal Division - IAD; UK First-tier Tribunal) or Judicial Review before the Federal/High Court to examine legal and procedural fairness.',
    potentialRemedies: [
      '**Judicial Review (Federal Court)**: Applying for leave to challenge unreasonable findings or breaches of procedural fairness within strict deadlines (15–60 days).',
      '**IAD Sponsorship Appeals**: Full merits hearing for spousal and family sponsorship refusals.',
      '**UK Administrative Review / First-tier Tribunal (Immigration and Asylum Chamber)**: Correcting caseworking errors or human rights appeals.',
    ],
    keyCautions: [
      'Appeals and judicial review applications have strict, non-negotiable statutory filing deadlines from the date of refusal receipt.',
      'Must be filed and represented by a licensed attorney or authorized legal counsel.',
    ],
  },
];

/**
 * Checks if a user inquiry touches complex high-risk legal topics
 */
export function detectHighRiskTopic(query: string): HighRiskRule | null {
  const q = query.toLowerCase();

  for (const rule of highRiskRules) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return rule;
    }
  }

  return null;
}

/**
 * Generates an objective, non-conclusive general advisory for complex high-risk cases
 */
export function formatHighRiskAdvisoryResponse(rule: HighRiskRule): string {
  const remediesMarkdown = rule.potentialRemedies.map((rem) => `- ${rem}`).join('\n');
  const cautionsMarkdown = rule.keyCautions.map((c) => `- ⚠️ ${c}`).join('\n');

  return `### ⚖️ General Information & Guidance: ${rule.name}

> **Important Notice on Complex Cases**:
> The following information is general regulatory background. Because individual circumstances, legal history, and country statutes vary significantly, **this overview does not constitute a definitive legal conclusion or case determination**. A formal assessment with a qualified immigration professional is strongly advised.

---

#### 1. General Regulatory Framework:
${rule.generalFrameworkOverview}

---

#### 2. Standard Legal Mechanisms & Potential Remedies:
${remediesMarkdown}

---

#### 3. Critical Considerations:
${cautionsMarkdown}

---

### 🛡️ Recommended Next Step:
Complex cases involving ${rule.name.toLowerCase()} require a meticulous review of documentation, court records, refusal letters, and official case notes.

We recommend scheduling a **Confidential 1-on-1 Legal Strategy Session** with our licensed RCIC consultants and partner immigration attorneys:
- [Book a Confidential Legal Strategy Consultation](${platformRoutes.consultation.path})
- [Upload Decision Letters to Document Center for Pre-Screening](${platformRoutes.documents.path})
- [Review Regulated Legal Representation Packages](${platformRoutes.packages.path})

---
*> ${INFORMATIONAL_ASSISTANT_DISCLAIMER}*`;
}


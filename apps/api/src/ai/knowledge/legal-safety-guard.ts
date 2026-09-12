import { platformRoutes } from './website-knowledge';

export const INFORMATIONAL_ASSISTANT_DISCLAIMER =
  'I am the Global Immigration Concierge, an AI-powered informational assistant by Global Citizens Solution. I provide general regulatory guidance, program comparisons, and platform navigation. I am not a government immigration officer, a government agency, or a practicing attorney, and this chat does not constitute binding legal advice or a government decision. For certified legal representation and case submissions, please consult with our licensed RCIC immigration consultants and qualified immigration attorneys.';

export const ILLEGAL_FRAUD_KEYWORDS = [
  'fake document',
  'fake passport',
  'fake bank statement',
  'fake degree',
  'fake job offer',
  'forge document',
  'forged certificate',
  'falsify',
  'fabricate',
  'counterfeit',
  'lie on my application',
  'lie to ircc',
  'lie to embassy',
  'hide my criminal record',
  'hide criminal history',
  'hide prior refusal',
  'hide visa rejection',
  'hide deportation',
  'work illegally',
  'work under the table',
  'work cash in hand',
  'cash in hand job',
  'overstay my visa',
  'overstay without getting caught',
  'stay illegally',
  'cross border illegally',
  'bypass border control',
  'evade immigration',
  'deceive immigration',
  'scam immigration',
  'marriage of convenience',
  'sham marriage',
  'fake marriage for pr',
  'buy a fake job offer',
  'pay for lmia illegally',
];

export const GUARANTEE_TRAPS = [
  'guarantee approval',
  'guaranteed visa',
  'can you promise i will get pr',
  '100% approval guarantee',
  'are you a government officer',
  'are you the ircc',
  'are you a lawyer',
  'are you an immigration lawyer',
  'do you make the visa decision',
];

/**
 * Checks if the user inquiry requests unlawful actions, fraud, or misrepresentation
 */
export function detectFraudOrMisrepresentation(query: string): boolean {
  const q = query.toLowerCase();
  return ILLEGAL_FRAUD_KEYWORDS.some((kw) => q.includes(kw));
}

/**
 * Checks if query asks for guarantees or questions official decision-making authority
 */
export function detectGuaranteeOrAuthorityTrap(query: string): boolean {
  const q = query.toLowerCase();
  return GUARANTEE_TRAPS.some((kw) => q.includes(kw));
}

/**
 * Generates an ethical, professional refusal when unlawful or fraudulent activity is requested
 */
export function generateFraudRefusalResponse(query: string): string {
  const q = query.toLowerCase();

  let contextSpecificWarning = '';
  if (q.includes('fake') || q.includes('forge') || q.includes('falsif') || q.includes('fabricat')) {
    contextSpecificWarning = `Submitting false, altered, or fabricated documents constitutes **document fraud and misrepresentation** under international immigration laws (e.g., Section 40 of Canada's IRPA, Section 212 of the US INA, and Part 9 of the UK Immigration Rules). This leads to mandatory 5-year or lifetime entry bans, immediate deportation, and criminal prosecution.`;
  } else if (q.includes('hide') || q.includes('lie') || q.includes('deceive')) {
    contextSpecificWarning = `Failing to disclose prior visa refusals, travel history, or criminal records is classified as **willful misrepresentation**. Government immigration databases and biometric security systems (such as the Five Eyes Alliance: US, UK, Canada, Australia, NZ) cross-reference application data across borders. Undisclosed records will be discovered.`;
  } else if (q.includes('overstay') || q.includes('illegal') || q.includes('under the table') || q.includes('cash')) {
    contextSpecificWarning = `Working without lawful authorization or overstaying a visa status is a serious violation of immigration control, voiding existing legal status and resulting in detention, expedited removal, and multi-year re-entry bars.`;
  } else if (q.includes('marriage') || q.includes('sham')) {
    contextSpecificWarning = `Entering into a marriage or civil partnership solely for immigration benefits (*marriage of convenience*) is strictly illegal and subject to severe criminal penalties and permanent revocation of residence status.`;
  } else {
    contextSpecificWarning = `Attempting to circumvent legal immigration protocols or misrepresent facts carries severe legal consequences, including permanent inadmissibility bans and criminal liability.`;
  }

  return `### ⚠️ Legal Compliance & Integrity Advisory

**Global Citizens Solution strictly adheres to international immigration laws and ethical standards.**

I cannot provide advice, strategies, or instructions on:
- Creating, obtaining, or submitting fraudulent or altered documents
- Misrepresenting or withholding personal, medical, or criminal history
- Working without valid legal authorization or overstaying visa terms
- Any actions intended to deceive border or immigration authorities

---

#### ⚖️ Legal Implications:
${contextSpecificWarning}

---

### 🛡️ Lawful, Legitimate Pathways Available:
We specialize in identifying 100% compliant, legitimate legal immigration routes suited to your background:
- **Overcoming Inadmissibility or Past Refusals**: Apply for a Temporary Resident Permit (TRP), Criminal Rehabilitation, or submit a formal legal submission letter.
- **Genuine Skilled & Employment Routes**: Obtain a verified job offer or apply via independent points-based systems (Express Entry, Australia SkillSelect, Germany Chancenkarte).
- **Study & Career Transition**: Enroll in recognized universities with lawful post-study work rights.
- **1-on-1 Legal Strategy Session**: Discuss your case confidentially with a licensed RCIC consultant or immigration attorney to explore legitimate avenues.

**Direct Platform Links:**
- [Book a Confidential Legal Consultation](${platformRoutes.consultation.path})
- [Run a Lawful Eligibility Evaluation](${platformRoutes.eligibility.path})
- [Explore Verified Visa Programs](${platformRoutes.programs.path})

---
*> ${INFORMATIONAL_ASSISTANT_DISCLAIMER}*`;
}

/**
 * Generates an explicit professional identity & non-guarantee response
 */
export function generateAuthorityClarificationResponse(query: string): string {
  return `### 🛡️ Professional Role & Safety Disclosure

**1. Who I Am:**
I am the **Global Immigration Concierge**, an AI-powered informational assistant developed for **Global Citizens Solution**.
- I am **not** a government immigration officer, a visa consular officer, or an employee of IRCC, the UK Home Office, USCIS, or any government agency.
- I am **not** a licensed attorney, and our conversational chat provides general regulatory information and platform navigation rather than individualized legal representation.

**2. No Approval Guarantees:**
- **No immigration authority or ethical consultancy can guarantee visa, PR, or citizenship approval.**
- Sovereign governments and their appointed consular officers retain 100% sole discretionary authority over all immigration decisions, background verifications, and processing timelines.

**3. How to Obtain Official Legal Representation:**
If you require certified legal representation, individualized eligibility review, or official dossier filing, we connect you directly with:
- **Licensed RCIC Immigration Consultants** (Canada)
- **Qualified Immigration Attorneys & Barristers** (UK, US, EU)
- **Certified Investment Migration Advisors**

**Direct Links:**
- [Book a 1-on-1 Strategy Session with a Licensed RCIC / Attorney](${platformRoutes.consultation.path})
- [Review Our Regulated Service Packages](${platformRoutes.packages.path})
- [Read Platform Legal Disclaimer](${platformRoutes.home.path}legal/disclaimer)

---
*> ${INFORMATIONAL_ASSISTANT_DISCLAIMER}*`;
}

/**
 * Safety post-processor: ensures no output inadvertently promises guarantees or claims government officer status
 */
export function enforceResponseLegalSafety(text: string): string {
  let cleaned = text;

  // Replace forbidden guarantee phrases
  const guaranteeReplacements: Array<[RegExp, string]> = [
    [/you will definitely be approved/gi, 'you may have strong potential eligibility'],
    [/you are guaranteed to qualify/gi, 'you appear to meet key potential criteria'],
    [/guaranteed approval/gi, 'potential eligibility'],
    [/100% guaranteed/gi, 'subject to official government evaluation'],
    [/i guarantee/gi, 'we anticipate based on standard regulations'],
    [/as a government officer/gi, 'as an informational assistant'],
    [/i am a licensed lawyer/gi, 'our licensed legal partners'],
    [/we guarantee approval/gi, 'we provide comprehensive professional filing support'],
  ];

  for (const [pattern, replacement] of guaranteeReplacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}

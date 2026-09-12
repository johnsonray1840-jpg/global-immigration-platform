import { platformRoutes, websiteKnowledge } from './website-knowledge';

export interface FAQEntry {
  id: number;
  category: string;
  question: string;
  matchPatterns: string[];
  answer: string;
  route?: string;
  suggestedFollowUps?: string[];
}

export const faq80KnowledgeBase: FAQEntry[] = [
  // ==========================================
  // GENERAL IMMIGRATION (1 - 10)
  // ==========================================
  {
    id: 1,
    category: 'GENERAL_IMMIGRATION',
    question: 'What is immigration?',
    matchPatterns: ['what is immigration', 'meaning of immigration', 'definition of immigration'],
    answer: `### What is Immigration?

**Immigration** is the formal legal process through which an individual moves to a foreign country with the intention of residing, working, studying, or establishing permanent residence and eventual citizenship.

Key immigration pathways include:
- **Economic & Skilled Migration**: Points-based permanent residence for skilled workers.
- **Residency & Citizenship by Investment**: Fast-track golden visas and passports through capital investment.
- **Study-to-Immigration**: Higher education leading to post-graduate work permits and PR.
- **Family Sponsorship**: Reuniting with spouse, children, or parents who are citizens/PRs.

**Next Step**: [Explore 50+ Destination Guides](${platformRoutes.countries.path}) or [Evaluate Your Eligibility](${platformRoutes.eligibility.path}).`,
    route: platformRoutes.programs.path,
  },
  {
    id: 2,
    category: 'GENERAL_IMMIGRATION',
    question: 'What is the difference between a visa and permanent residence?',
    matchPatterns: ['difference between a visa and permanent residence', 'visa vs permanent residence', 'visa vs pr', 'is visa same as pr'],
    answer: `### Difference Between a Visa and Permanent Residence (PR)

- **Visa (Temporary Authorization)**:
  - An official endorsement permitting you to enter and remain in a country for a **specific purpose and duration** (e.g., Tourist, Student, Temporary Work Permit).
  - Subject to expiration dates and renewal criteria; does not grant long-term settlement rights.
- **Permanent Residence (PR)**:
  - A permanent legal immigration status granting the right to **live, work, study, and access universal healthcare** indefinitely without employer sponsorship.
  - Can be maintained by fulfilling minimum physical residency requirements and serves as the direct stepping stone to full **Citizenship**.

**Explore Options**: [Explore Permanent Residence Programs](${platformRoutes.programs.path})`,
    route: platformRoutes.programs.path,
  },
  {
    id: 3,
    category: 'GENERAL_IMMIGRATION',
    question: 'What is permanent residence?',
    matchPatterns: ['what is permanent residence', 'meaning of pr', 'definition of permanent residence', 'what does pr mean'],
    answer: `### What is Permanent Residence (PR)?

**Permanent Residence (PR)** is a sovereign legal status granting a foreign national the right to reside in a host country indefinitely.

**Key Benefits of Permanent Residency**:
1. **Unrestricted Employment**: Work for any employer or operate your own business without needing separate work permits.
2. **Social Benefits**: Access to subsidized or free public healthcare and education systems for your entire family.
3. **Protection & Mobility**: Enter and exit the country freely with a PR card or biometric residence permit.
4. **Pathway to Citizenship**: Apply for full citizenship and passport after meeting standard physical presence thresholds (usually 3–5 years).

**Check Your Score**: [Run Free PR Eligibility Check](${platformRoutes.eligibility.path})`,
    route: platformRoutes.eligibility.path,
  },
  {
    id: 4,
    category: 'GENERAL_IMMIGRATION',
    question: 'What is citizenship?',
    matchPatterns: ['what is citizenship', 'definition of citizenship', 'meaning of citizenship', 'what does being a citizen mean'],
    answer: `### What is Citizenship?

**Citizenship** is the highest legal relationship between an individual and a sovereign state, conferring full constitutional rights, civic protections, and responsibilities.

**Core Privileges of Citizenship**:
- **National Passport**: Enjoy unrestricted global mobility and consular protection abroad.
- **Unconditional Residence**: Cannot be deported or lose status due to absence from the country.
- **Political Rights**: Full right to vote, stand for public office, and hold security-cleared federal positions.
- **Hereditary Rights**: Pass citizenship down automatically to future generations and children born abroad.

**Direct Routes**: [Explore Citizenship by Investment Programs](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },
  {
    id: 5,
    category: 'GENERAL_IMMIGRATION',
    question: 'What is the difference between permanent residence and citizenship?',
    matchPatterns: ['difference between permanent residence and citizenship', 'pr vs citizenship', 'permanent resident vs citizen'],
    answer: `### Difference Between Permanent Residence (PR) and Citizenship

| Feature | Permanent Residence (PR) | Citizenship |
| :--- | :--- | :--- |
| **Right to Reside** | Indefinite, but subject to stay obligations | Absolute & irrevocable |
| **Passport** | Keeps original home country passport | Issues host nation's official passport |
| **Voting Rights** | Generally cannot vote in federal elections | Full voting & political rights |
| **Absence Rules** | Can lose PR if away for extended periods | Freedom to live abroad indefinitely |
| **Deportability** | Status can be revoked for serious crimes | Protected by constitutional rights |

**Next Steps**: [Compare Citizenship & PR Programs](${platformRoutes.programs.path})`,
    route: platformRoutes.programs.path,
  },
  {
    id: 6,
    category: 'GENERAL_IMMIGRATION',
    question: 'Can I immigrate to another country without a job offer?',
    matchPatterns: ['immigrate without a job offer', 'can i immigrate without job', 'move abroad without job offer', 'pr without job offer'],
    answer: `### Immigrating Without a Job Offer

**Yes, several premier destinations offer direct immigration without requiring an existing job offer:**

1. **Canada Express Entry (Federal Skilled Worker)**: Points-based system selecting candidates based on age, education (ECA), language test scores (IELTS/CELPIP), and foreign work experience.
2. **Germany Opportunity Card (Chancenkarte)**: 1-year points-based visa allowing qualified talent to enter Germany to seek skilled employment.
3. **Australia Skilled Independent (Subclass 189)**: Points-tested permanent residence for occupations on the national skilled list.
4. **Citizenship & Residency by Investment**: Immediate residence/citizenship through qualifying funds without employment requirements.
5. **Digital Nomad & Passive Income Visas (Portugal D8/D7, Spain)**: For remote workers with foreign employment or passive income.

**Assess Your Chances**: [Launch Points Calculator](${platformRoutes.eligibility.path})`,
    route: platformRoutes.eligibility.path,
  },
  {
    id: 7,
    category: 'GENERAL_IMMIGRATION',
    question: 'How do I know which immigration pathway is right for me?',
    matchPatterns: ['which immigration pathway is right for me', 'how to choose pathway', 'best visa for me', 'which country should i apply to'],
    answer: `### Choosing the Right Immigration Pathway

The optimal pathway depends on five personal profile pillars:
1. **Age & Education**: If you are under 35 with a degree, skilled points systems (Canada Express Entry, Australia Subclass 189) offer direct PR.
2. **Career & Remote Work**: Remote workers earning €3,000+/mo qualify for European Digital Nomad Visas (Portugal D8, Spain).
3. **Financial Capital**: High-net-worth individuals can access fast-track Golden Visas (Greece, Portugal) or Caribbean CBI passports in 3–6 months.
4. **Academic Goals**: Studying abroad offers an accessible route to PR via post-study work permits (PGWP / Graduate visa).
5. **Family Ties**: Spousal or family sponsorship if you have qualifying relatives residing as citizens/PRs.

**Recommended Step**: [Book a 1-on-1 Profile Strategy Session](${platformRoutes.consultation.path}) with an RCIC consultant or immigration lawyer.`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 8,
    category: 'GENERAL_IMMIGRATION',
    question: 'How long does immigration usually take?',
    matchPatterns: ['how long does immigration take', 'immigration processing time', 'visa processing timeline', 'how many months to get visa'],
    answer: `### General Immigration Processing Timelines

Processing timelines vary significantly by country, program category, and government caseload:

- **Caribbean Citizenship by Investment**: **3 to 6 months** (Fast-track direct passport).
- **European Digital Nomad Visas (Portugal, Spain)**: **1 to 3 months**.
- **Canada Express Entry PR**: **6 to 12 months** from Invitation to Apply (ITA).
- **Australia Skilled Migration**: **6 to 10 months**.
- **Student Visa Applications**: **3 to 8 weeks** following university admission.
- **Family & Spousal Sponsorship**: **10 to 14 months**.
- **US Employment Green Cards (EB-2 / EB-3)**: **12 to 24+ months** depending on nationality and priority date.

**Track Your Milestones**: [Client Case Tracking Dashboard](${platformRoutes.cases.path})`,
    route: platformRoutes.cases.path,
  },
  {
    id: 9,
    category: 'GENERAL_IMMIGRATION',
    question: 'How much does immigration cost?',
    matchPatterns: ['how much does immigration cost', 'cost of immigration', 'total fees for immigration', 'how expensive is immigration'],
    answer: `### Breakdown of Immigration Costs

Total immigration outlay consists of four components:

1. **Statutory Government Filing Fees**:
   - Canada Express Entry PR: ~$1,525 CAD per adult (including Right of PR fee).
   - Australia Skilled PR: ~$4,640 AUD for primary applicant.
   - UK Skilled Worker: ~£719–£1,639 + Immigration Health Surcharge (£1,035/year).
2. **Third-Party Pre-Requisite Costs**:
   - Language Tests (IELTS / CELPIP / PTE): ~$250–$300.
   - Credential Evaluations (ECA by WES): ~$240–$320.
   - Certified Translations & Police Clearances: ~$100–$300.
   - Immigration Medical Examination (IME): ~$200–$400.
3. **Mandatory Proof of Settlement Funds (Living Assets)**:
   - Liquid funds you must possess to support yourself (e.g., Canada requires ~$14,690 CAD for a single applicant; not paid to the government).
4. **Professional Legal & Consultancy Representation**:
   - Transparent all-inclusive tiers from $1,200 to $5,000 across our [Service Packages](${platformRoutes.packages.path}).`,
    route: platformRoutes.packages.path,
  },
  {
    id: 10,
    category: 'GENERAL_IMMIGRATION',
    question: 'Can my family immigrate with me?',
    matchPatterns: ['can my family immigrate with me', 'bring my family', 'include spouse and children', 'family accompanying applicant'],
    answer: `### Immigrating with Family Members

**Yes! Most permanent residence, skilled work, investment, and student visa programs allow you to include immediate qualifying family members as accompanying dependents:**

- **Eligible Dependents**:
  - **Spouse or Legal Common-Law Partner**.
  - **Dependent Children** (typically unmarried and under age 22; extensions apply for full-time students or medical dependencies).
  - **Dependent Parents / Grandparents** (available under selected programs like Greece/Malta Golden Visas and Caribbean CBI).
- **Dependent Rights**:
  - Accompanying spouses typically receive an **Open Work Permit** or direct Permanent Residence with unrestricted work rights.
  - Dependent children access subsidized local schooling and healthcare.

**Explore Package**: [Family Relocation & Sponsorship Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },

  // ==========================================
  // PERMANENT RESIDENCE (11 - 20)
  // ==========================================
  {
    id: 11,
    category: 'PERMANENT_RESIDENCE',
    question: 'Which countries offer permanent residence pathways?',
    matchPatterns: ['which countries offer permanent residence', 'countries offering pr', 'best countries for pr', 'pr countries list'],
    answer: `### Top Countries Offering Direct & Clear PR Pathways

1. **Canada**: Express Entry (FSW, CEC, FST), Provincial Nominee Programs (PNPs), and Quebec Skilled Worker.
2. **Australia**: General Skilled Migration (Subclass 189, 190, 491), Employer Nomination Scheme (Subclass 186).
3. **New Zealand**: Skilled Migrant Category (6-point system) and Green List Fast Track.
4. **Germany / EU**: EU Blue Card (PR in 21–27 months), Opportunity Card transition, and Settlement Permit (Niederlassungserlaubnis).
5. **United Kingdom**: Skilled Worker Route leading to Indefinite Leave to Remain (ILR) after 5 years.
6. **Portugal & Spain**: 5-year residency leading to permanent residency and EU citizenship.

**Compare Now**: [Side-by-Side Country Comparison](${platformRoutes.compare.path})`,
    route: platformRoutes.compare.path,
  },
  {
    id: 12,
    category: 'PERMANENT_RESIDENCE',
    question: 'How can I apply for permanent residence?',
    matchPatterns: ['how can i apply for permanent residence', 'how to apply for pr', 'steps to get pr', 'apply for pr process'],
    answer: `### How to Apply for Permanent Residence

Applying for PR involves 5 structured stages:

1. **Initial Profile Evaluation & Points Audit**: Calculate your score on the selection grid: [Eligibility Assessment](${platformRoutes.eligibility.path}).
2. **Credential & Language Preparation**:
   - Complete official language examination (IELTS General, CELPIP, or TEF).
   - Obtain Educational Credential Assessment (ECA) for foreign degrees.
3. **Expression of Interest (EOI) / Pool Submission**: Create and lodge your online government profile (e.g., Express Entry pool / SkillSelect).
4. **Invitation to Apply (ITA) & Full Dossier Filing**: Upload verified identity, police clearances, financial proofs, and reference letters to our [Document Center](${platformRoutes.documents.path}).
5. **Government Adjudication & PR Card Issuance**: Background verification, biometrics, and Confirmation of Permanent Residence (COPR).

**Next Step**: [Schedule a Strategy Session with an RCIC Specialist](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 13,
    category: 'PERMANENT_RESIDENCE',
    question: 'What are the requirements for permanent residence?',
    matchPatterns: ['requirements for permanent residence', 'pr requirements', 'what do i need for pr', 'criteria for pr'],
    answer: `### Standard Requirements for Permanent Residence

While specific criteria depend on the destination country, skilled PR streams evaluate:

1. **Age**: Maximum points awarded between ages 20–29; eligibility remains open up to 45 (Australia) or older with high points (Canada).
2. **Education**: Recognized post-secondary diploma, bachelor’s, master’s, or doctorate verified by official ECA.
3. **Language Proficiency**: Meeting minimum Canadian Language Benchmark (CLB 7–9+) or Competent English standards.
4. **Work Experience**: At least 1 to 3 years of full-time, skilled employment in an eligible occupational code (NOC/TEER / ANZSCO).
5. **Clean Background**: Passing mandatory Police Clearance Certificates (PCC) and Immigration Medical Examination (IME).
6. **Proof of Settlement Funds**: Showing unencumbered funds to support your family upon landing.

**Check Score**: [Calculate Your Points Here](${platformRoutes.eligibility.path})`,
    route: platformRoutes.eligibility.path,
  },
  {
    id: 14,
    category: 'PERMANENT_RESIDENCE',
    question: 'Can I get permanent residence through work?',
    matchPatterns: ['permanent residence through work', 'work visa to pr', 'can i get pr by working', 'job leading to pr'],
    answer: `### Transitioning from Work to Permanent Residence

**Yes! Employment is one of the most reliable and direct pathways to permanent residency:**

- **Canada (Canadian Experience Class - CEC)**: 1 year of skilled in-Canada work under TEER 0, 1, 2, or 3 qualifies you for Express Entry CEC draws.
- **Germany (EU Blue Card)**: Fast-track to permanent Settlement Permit in just **21 months** (with B1 German) or **27 months** (with A1 German).
- **United Kingdom (Skilled Worker to ILR)**: 5 continuous years of qualifying employment leads directly to Indefinite Leave to Remain (ILR).
- **Australia (Subclass 186 ENS)**: Direct employer-sponsored PR transition after 2 years on a Subclass 482 Temporary Skill Shortage visa.

**View Programs**: [Explore Skilled Work & PR Packages](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 15,
    category: 'PERMANENT_RESIDENCE',
    question: 'Can I get permanent residence through investment?',
    matchPatterns: ['permanent residence through investment', 'invest for pr', 'golden visa pr', 'residency by investment'],
    answer: `### Permanent Residence Through Investment (Golden Visas)

**Yes, several top global jurisdictions offer residency and permanent residence directly in exchange for qualifying capital investments:**

- **Portugal Golden Residence Permit**: €500,000 investment in venture capital/private equity funds. Requires only 7 days/year stay, granting PR and citizenship eligibility after 5 years.
- **Greece Golden Visa**: €250,000–€800,000 real estate investment granting immediate 5-year renewable permanent residence for the whole family.
- **Malta MPRP**: Real estate purchase/lease combined with government contribution granting lifetime EU permanent residency.
- **United States EB-5 Immigrant Investor**: $800,000 investment in a Targeted Employment Area (TEA) yielding direct US Permanent Residence (Green Cards).

**Explore Investment Portals**: [Citizenship by Investment & Golden Visas](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },
  {
    id: 16,
    category: 'PERMANENT_RESIDENCE',
    question: 'Can students eventually obtain permanent residence?',
    matchPatterns: ['can students get pr', 'study to pr', 'international student permanent residence', 'student visa leading to pr'],
    answer: `### The Study-to-Permanent Residence Pathway

**Yes! Studying abroad is one of the most popular and strategic routes to permanent residence:**

1. **Step 1: Complete Degree**: Graduate from a Designated Learning Institution (DLI) or accredited foreign university.
2. **Step 2: Obtain Post-Study Work Permit**:
   - Canada: Post-Graduation Work Permit (PGWP) for up to 3 years.
   - UK: Graduate Route Visa for 2–3 years.
   - Australia: Temporary Graduate Visa (Subclass 485) for 2–4 years.
3. **Step 3: Accumulate Skilled Local Work Experience**: Gain 1–2 years of local employment.
4. **Step 4: Transition to PR**: Benefit from extra points awarded for local education and domestic work experience (e.g., Canadian Experience Class or Australian Subclass 190).

**Explore Pathways**: [Browse 10+ Global Scholarships](${platformRoutes.scholarships.path}) | [Student Success Package](${platformRoutes.packages.path})`,
    route: platformRoutes.scholarships.path,
  },
  {
    id: 17,
    category: 'PERMANENT_RESIDENCE',
    question: 'Can a temporary visa lead to permanent residence?',
    matchPatterns: ['can a temporary visa lead to pr', 'temporary to permanent', 'switch temporary visa to pr', 'trv to pr'],
    answer: `### Converting a Temporary Visa to Permanent Residence

**Yes, dual intent and transition pathways exist in most major immigration frameworks:**

- **Work Permits to PR**: Employer-sponsored work permits (Canada LMIA, UK Skilled Worker, German Blue Card) provide the local experience and points required to bridge to PR.
- **Student Visas to PR**: Post-graduation work authorizations (PGWP / OPT) enable graduates to gain skilled experience that directly unlocks PR invitations.
- **Digital Nomad Visas to PR**: Visas like Portugal's D8 and Spain's Nomad Visa count toward the statutory 5-year residency requirement for permanent residency and EU citizenship.
- **Important Note**: Standard tourist/visitor visas do not automatically convert to PR; you must qualify under an official economic, family, or investment category.

**Evaluate Profile**: [Launch Points Assessment](${platformRoutes.eligibility.path})`,
    route: platformRoutes.eligibility.path,
  },
  {
    id: 18,
    category: 'PERMANENT_RESIDENCE',
    question: 'What documents are usually required for PR?',
    matchPatterns: ['documents required for pr', 'pr document checklist', 'what papers do i need for pr', 'documents for permanent residence'],
    answer: `### Standard Document Checklist for PR Applications

1. **Identity & Civil Status**:
   - Valid International Passport (bio page).
   - Birth certificates, Marriage certificates, or Divorce decrees.
2. **Educational Records**:
   - Degree/Diploma certificates and official transcripts.
   - Official Educational Credential Assessment (ECA) report (WES, ICAS, IQAS).
3. **Language Test Results**:
   - Official score sheets (IELTS General, CELPIP-G, PTE Core, or TEF/TCF Canada) dated within the last 2 years.
4. **Proof of Work Experience**:
   - Detailed reference letters on corporate letterheads signed by HR/managers detailing duties, NOC/TEER codes, salary, and hours.
   - Pay slips, tax returns (W-2/T4/ITR), and bank deposit statements.
5. **Background & Security**:
   - Police Clearance Certificates (PCC) from all countries lived in for 6+ months since age 18.
   - Immigration Medical Examination (IME) confirmation.
6. **Proof of Settlement Funds**:
   - 6-month official stamped bank statements and investment statements.

**Upload for Pre-Screening**: [Document Center with AI OCR](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 19,
    category: 'PERMANENT_RESIDENCE',
    question: 'How long does PR processing take?',
    matchPatterns: ['how long does pr processing take', 'pr processing time', 'months to get pr', 'timeline for permanent residence'],
    answer: `### Permanent Residence Processing Timelines

- **Canada Express Entry (FSW / CEC)**: **6 months** from initial application submission following an Invitation to Apply (ITA).
- **Canada Provincial Nominee Programs (Non-Express Entry)**: **12 to 18 months**.
- **Australia General Skilled Migration (189 / 190)**: **6 to 10 months** after formal visa lodgment.
- **German Settlement Permit (Niederlassungserlaubnis)**: **21 to 27 months** of qualifying residence on an EU Blue Card.
- **UK Indefinite Leave to Remain (ILR)**: **6 months** standard processing (priority 5-day options available) after 5 continuous years on a Skilled Worker visa.

**Track Your Case**: [Client Case Tracking Dashboard](${platformRoutes.cases.path})`,
    route: platformRoutes.cases.path,
  },
  {
    id: 20,
    category: 'PERMANENT_RESIDENCE',
    question: 'Can I include my spouse and children in a PR application?',
    matchPatterns: ['include spouse and children in pr', 'add family to pr', 'pr with family', 'can my dependents get pr with me'],
    answer: `### Adding Dependents to Your PR Application

**Yes! Under permanent residency programs (Express Entry, Australia GSM, Golden Visas), your qualifying dependents are granted the exact same Permanent Resident status simultaneously:**

- **Spouse / Common-Law Partner**: Granted PR status alongside the primary applicant, with immediate unrestricted rights to work or study.
- **Dependent Children**: Unmarried children under age 22 at the time of profile lock-in receive PR status and access domestic education and healthcare.
- **Medical & Security Requirements**: All accompanying family members must pass mandatory police clearances and immigration medical examinations.

**View Full Package**: [Family Relocation Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },

  // ==========================================
  // CITIZENSHIP (21 - 28)
  // ==========================================
  {
    id: 21,
    category: 'CITIZENSHIP',
    question: 'How can I become a citizen of another country?',
    matchPatterns: ['how to become a citizen', 'ways to get citizenship', 'how can i become citizen of another country', 'routes to citizenship'],
    answer: `### Primary Pathways to Foreign Citizenship

1. **Citizenship by Naturalization**: Fulfilling statutory legal residency (typically 3–5 years as a permanent resident), passing language and civics exams.
2. **Citizenship by Investment (CBI)**: Making a government-approved capital contribution or real estate purchase for direct passport issuance within 3–6 months.
3. **Citizenship by Descent (Jus Sanguinis)**: Claiming citizenship through qualifying parents, grandparents, or great-grandparents (e.g., Italy, Ireland, Poland, Portugal).
4. **Citizenship by Marriage**: Expedited naturalization after legally residing with a citizen spouse (usually 2–3 years).

**Explore Fast-Track Programs**: [Citizenship by Investment Directory](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },
  {
    id: 22,
    category: 'CITIZENSHIP',
    question: 'Can permanent residents become citizens?',
    matchPatterns: ['can permanent residents become citizens', 'pr to citizenship', 'transition from pr to citizen', 'can a pr get passport'],
    answer: `### Transitioning from Permanent Residency to Citizenship

**Yes, permanent residency is the standard prerequisite for citizenship by naturalization in virtually all constitutional democracies:**

- **Canada**: Reside physically for at least 1,095 days (3 years) within 5 years as a PR + pass basic citizenship test and language check (CLB 4).
- **United Kingdom**: Hold Indefinite Leave to Remain (ILR) for at least 12 months + 5 years continuous residence + pass Life in the UK test.
- **United States**: Maintain Green Card for 5 years (or 3 years if married to a US citizen) + pass naturalization interview.
- **Australia**: 4 years continuous lawful stay including at least 12 months on a PR visa.

**Review Requirements**: [Explore Country Details](${platformRoutes.countries.path})`,
    route: platformRoutes.countries.path,
  },
  {
    id: 23,
    category: 'CITIZENSHIP',
    question: 'How long does citizenship usually take?',
    matchPatterns: ['how long does citizenship take', 'citizenship timeline', 'years to get passport', 'how many years for citizenship'],
    answer: `### Citizenship Timelines by Pathway

- **Citizenship by Investment (Caribbean / Vanuatu)**: **3 to 6 months** (Fast-track direct passport).
- **Canada**: **3 years** physical presence + ~6 to 12 months processing.
- **United Kingdom**: **5 to 6 years** (5 years residence + 1 year on ILR).
- **United States**: **5 years** on Green Card + ~8 to 14 months processing.
- **Portugal & Spain**: **5 years** of legal residency (with basic A2 language exam).
- **Germany (Modernized Law)**: **5 years** standard (or 3 years for exceptional integration).

**Explore Options**: [Book a Consultation with a Specialist](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 24,
    category: 'CITIZENSHIP',
    question: 'Can I have dual citizenship?',
    matchPatterns: ['can i have dual citizenship', 'dual nationality allowed', 'keep my original passport', 'two passports allowed'],
    answer: `### Dual Citizenship Rules & Regulations

**Yes, many premier countries fully permit and recognize dual and multiple citizenships:**

- **Countries Allowing Dual Citizenship**: Canada, United States, United Kingdom, Australia, Ireland, Portugal, France, Italy, Switzerland, Germany, and all Caribbean CBI nations (St. Kitts, Dominica, Grenada, Antigua, Saint Lucia).
- **Countries Restricting Dual Citizenship**: Singapore, Japan, China, India (offers OCI card instead), and UAE (permitted by special decree).
- **Key Advantage**: Holding dual citizenship allows you to retain your original passport while enjoying visa-free travel, tax optimization, and global asset security under a second passport.

**Learn More**: [Citizenship by Investment Portal](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },
  {
    id: 25,
    category: 'CITIZENSHIP',
    question: 'What is citizenship by investment?',
    matchPatterns: ['what is citizenship by investment', 'cbi definition', 'cbi meaning', 'buy passport legally', 'investment passport'],
    answer: `### What is Citizenship by Investment (CBI)?

**Citizenship by Investment (CBI)** is an officially legislated government program that grants foreign investors and their families direct, permanent citizenship and national passports in exchange for a substantial, legally vetted capital investment into the host nation's economy.

**Core Mechanisms**:
1. **Government Sovereign Fund Contribution**: Non-refundable donation to national development funds.
2. **Approved Real Estate Acquisition**: Purchase of shares or full titles in designated 5-star resort developments.
3. **Government Bonds / Enterprise Investment**: Investment in authorized state infrastructure.

**Key Benefits**: No physical presence requirements, visa-free access to 140+ countries (UK, Schengen, Singapore), completed within 3 to 6 months.

**Explore CBI**: [Citizenship by Investment Portal](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },
  {
    id: 26,
    category: 'CITIZENSHIP',
    question: 'Which countries offer citizenship by investment?',
    matchPatterns: ['which countries offer citizenship by investment', 'cbi countries list', 'countries with cbi', 'where can i get cbi'],
    answer: `### Top Countries Offering Citizenship by Investment (CBI)

1. **St. Kitts & Nevis**: Oldest CBI program (established 1984), visa-free travel to 150+ countries.
2. **Dominica**: High-reputation Commonwealth passport, accessible donation thresholds.
3. **Grenada**: Unique E-2 Investor Visa treaty access with the United States + visa-free access to China and Schengen.
4. **Antigua & Barbuda**: Excellent pricing for larger families (up to 6 members).
5. **Saint Lucia**: Flexible options across sovereign funds, real estate, and government bonds.
6. **Malta (MEIN)**: Premium direct European Union citizenship by direct investment.
7. **Vanuatu**: Fast Asia-Pacific passport processing in 2 to 3 months.

**Explore Programs**: [Citizenship by Investment Guide](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },
  {
    id: 27,
    category: 'CITIZENSHIP',
    question: 'What are the requirements for citizenship by investment?',
    matchPatterns: ['requirements for citizenship by investment', 'cbi requirements', 'cbi criteria', 'who qualifies for cbi'],
    answer: `### Standard Requirements for Citizenship by Investment

1. **Age**: Primary applicant must be at least 18 years old.
2. **Clean Criminal Record**: Flawless background verification; no criminal convictions or Interpol notices.
3. **Source of Funds Audit**: Complete documentation proving that investment capital originates from legitimate commercial, salary, inheritance, or investment sources.
4. **Government Due Diligence Check**: Passing multi-tiered background checks by international intelligence agencies.
5. **Good Health**: Passing an official medical exam and HIV test.
6. **Eligible Family Dependents**: Spouse, dependent children under 25–30, and dependent parents aged 55–65+.

**Book Private Wealth Review**: [Schedule a Consultation](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 28,
    category: 'CITIZENSHIP',
    question: 'How much does citizenship by investment cost?',
    matchPatterns: ['how much does cbi cost', 'cbi pricing', 'citizenship by investment cost', 'passport price'],
    answer: `### Cost Breakdown for Citizenship by Investment (CBI)

1. **Caribbean CBI Programs (St. Kitts, Dominica, Grenada, Antigua, Saint Lucia)**:
   - **Sovereign Fund Donation**: Starting from **$100,000 to $240,000** for a single applicant (higher for families).
   - **Real Estate Option**: Minimum **$200,000 to $400,000** in approved luxury resorts (resalable after 5–7 years).
   - **Due Diligence & Government Fees**: ~$7,500 to $10,000 for main applicant + $4,000 to $7,500 per adult dependent.
2. **Malta Citizenship by Direct Investment (MEIN)**:
   - Minimum direct contribution of **€600,000** (36 months residency) or **€750,000** (12 months residency) + €10,000 philanthropic donation + real estate purchase (€700k+) or 5-year lease (€16k/yr).

**Calculate Exact Outlay**: [Citizenship by Investment Explorer](${platformRoutes.cbiPrograms.path})`,
    route: platformRoutes.cbiPrograms.path,
  },

  // ==========================================
  // WORK IMMIGRATION (29 - 34)
  // ==========================================
  {
    id: 29,
    category: 'WORK_VISAS',
    question: 'How can I get a work visa?',
    matchPatterns: ['how can i get a work visa', 'get work permit', 'steps for work visa', 'apply for work permit'],
    answer: `### How to Obtain an International Work Visa

1. **Identify the Right Category**:
   - **Employer-Sponsored**: Secure a qualifying job offer from a licensed corporate sponsor (UK Skilled Worker, US H-1B, Canada LMIA).
   - **Job Seeker / Points-Based**: Enter on a job search visa without an initial contract (Germany Opportunity Card / Chancenkarte).
   - **Remote / Nomad Visas**: For remote employees or online freelancers (Portugal D8, Spain Nomad Visa).
2. **Labor Market Compliance (If Required)**: Employer demonstrates domestic recruitment efforts (e.g., LMIA in Canada or Certificate of Sponsorship in the UK).
3. **Dossier Preparation**: Gather educational credentials, signed contracts, employment references, and police clearances.
4. **Embassy Lodgment & Biometrics**: Submit through government visa portals with biometric enrollment.

**Explore Packages**: [Skilled Worker & Work Visa Packages](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 30,
    category: 'WORK_VISAS',
    question: 'Do I need a job offer to get a work visa?',
    matchPatterns: ['do i need a job offer for work visa', 'work visa without job offer', 'job offer required for work permit'],
    answer: `### Work Visas: Job Offer vs. No Job Offer

- **Programs Requiring a Job Offer**:
  - UK Skilled Worker Visa (Requires Certificate of Sponsorship).
  - Canada Employer-Specific Work Permit (Requires approved LMIA).
  - US H-1B Specialty Occupation / L-1 Intra-Company Transfer.
  - Standard European National Work Permits.
- **Programs NOT Requiring an Upfront Job Offer**:
  - **Germany Opportunity Card (Chancenkarte)**: 1-year job seeker visa based on points.
  - **Austria Red-White-Red Card for Very Highly Qualified Workers**.
  - **Digital Nomad Visas (Portugal D8, Spain, Dubai)**: Requires existing remote foreign employment.
  - **Post-Graduation Work Permits (PGWP / OPT)**: Open work permits granted to international graduates.

**Evaluate Your Profile**: [Launch Points Calculator](${platformRoutes.eligibility.path})`,
    route: platformRoutes.eligibility.path,
  },
  {
    id: 31,
    category: 'WORK_VISAS',
    question: 'Which countries have skilled-worker immigration programs?',
    matchPatterns: ['countries with skilled worker programs', 'skilled migration countries', 'best countries for skilled workers'],
    answer: `### Leading Countries with Skilled Worker Immigration Programs

1. **Canada**: Express Entry (Federal Skilled Worker, Canadian Experience Class) and Provincial Nominee Programs.
2. **Germany**: Opportunity Card (Chancenkarte), EU Blue Card, and Fast-track Skilled Immigration Act.
3. **United Kingdom**: Skilled Worker Visa (70-point threshold) and Global Talent Visa.
4. **Australia**: SkillSelect General Skilled Migration (Subclass 189, 190, 491).
5. **New Zealand**: Skilled Migrant Category (SMC 6-point system) and Green List.
6. **United States**: EB-2 National Interest Waiver (self-petitioned) and H-1B Specialty Occupation.

**Explore Country Guides**: [50+ Country Directory](${platformRoutes.countries.path})`,
    route: platformRoutes.countries.path,
  },
  {
    id: 32,
    category: 'WORK_VISAS',
    question: 'Can I bring my family on a work visa?',
    matchPatterns: ['bring family on work visa', 'dependents on work permit', 'can my wife work on my work visa'],
    answer: `### Bringing Family Members on a Work Visa

**Yes! Most skilled work authorizations permit you to bring your spouse and dependent children under accompanying dependent visas:**

- **Spousal Work Rights**:
  - **Canada / UK / Germany / Australia**: Spouses of skilled workers generally receive an **Open Work Permit** or unrestricted right to work for any employer.
  - **United States**: Spouses on L-2 and E-2 visas can work automatically (incident to status); H-4 spouses qualify for an EAD once an I-140 immigrant petition is approved.
- **Children's Education**: Dependent children are entitled to attend state primary and secondary schools.

**Explore Package**: [Family Relocation Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 33,
    category: 'WORK_VISAS',
    question: 'Can a work visa lead to permanent residence?',
    matchPatterns: ['can work visa lead to pr', 'work permit to permanent residency', 'how to convert work visa to pr'],
    answer: `### Transitioning from Work Visa to PR

**Yes, skilled work experience is the single strongest factor in qualifying for permanent residence worldwide:**

- **Germany**: EU Blue Card holders can obtain permanent Settlement Permits in **21 months** (with B1 German) or **27 months** (with A1 German).
- **Canada**: 1 year of Canadian skilled work unlocks the Canadian Experience Class (CEC) stream under Express Entry.
- **United Kingdom**: 5 years on a Skilled Worker Visa leads directly to Indefinite Leave to Remain (ILR).
- **Australia**: 2 years on a Subclass 482 visa transitions directly to Subclass 186 Employer Nomination PR.

**Plan Your Roadmap**: [Book an RCIC / Immigration Specialist](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 34,
    category: 'WORK_VISAS',
    question: 'What documents do I need for a work visa?',
    matchPatterns: ['documents needed for work visa', 'work visa checklist', 'work permit document requirements'],
    answer: `### Work Visa Document Checklist

1. **Signed Employment Contract / Job Offer**: Detailing job title, duties, salary, and duration.
2. **Government Sponsorship / Labor Approval**: Certificate of Sponsorship (UK), approved LMIA (Canada), or labor clearance.
3. **Valid Passport**: Minimum 6 months validity with blank visa pages.
4. **Academic & Professional Credentials**: Degrees, diplomas, and official ECA credential evaluations.
5. **Employment Experience Letters**: Signed reference letters from past employers proving required years of experience.
6. **Language Examination Results**: Official score sheet meeting minimum required proficiency.
7. **Police Clearance & Medical Exam**: Clean background certificate and accredited health exam.

**Pre-Screen Files**: [Upload to Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },

  // ==========================================
  // STUDY IMMIGRATION (35 - 40)
  // ==========================================
  {
    id: 35,
    category: 'STUDENT_VISAS',
    question: 'How can I study abroad?',
    matchPatterns: ['how can i study abroad', 'steps to study abroad', 'study overseas process', 'how to apply for foreign university'],
    answer: `### How to Study Abroad: 5-Step Process

1. **University & Course Selection**: Select accredited universities aligned with your career goals and post-study PR policies.
2. **Prepare Admissions Portfolio**: Academic transcripts, Statement of Purpose (SOP), Letters of Recommendation (LOR), and language tests (IELTS/TOEFL/Duolingo).
3. **Secure Official Acceptance**: Receive your unconditional Letter of Acceptance (LOA), I-20 (USA), or CAS (UK).
4. **Apply for Fully-Funded Scholarships**: Explore grants covering full tuition and living expenses: [Browse 10+ Global Scholarships](${platformRoutes.scholarships.path}).
5. **Lodge Student Visa Application**: Demonstrate tuition payment, mandatory living funds proof, and genuine student intent.

**Get Expert Assistance**: [Student Success Package](${platformRoutes.packages.path})`,
    route: platformRoutes.scholarships.path,
  },
  {
    id: 36,
    category: 'STUDENT_VISAS',
    question: 'Do I need admission before applying for a student visa?',
    matchPatterns: ['do i need admission before student visa', 'student visa without admission', 'admission required for visa'],
    answer: `### Admission Requirement for Student Visas

**Yes, an official, unconditional Letter of Acceptance from a recognized educational institution is mandatory before you can lodge a student visa application:**

- **Canada**: Requires an acceptance letter from a Designated Learning Institution (DLI) with an official DLI number.
- **United States**: Requires Form I-20 issued by a SEVP-certified institution after payment of the SEVIS I-901 fee.
- **United Kingdom**: Requires a Confirmation of Acceptance for Studies (CAS) number issued by a licensed Student Sponsor.
- **Germany**: Requires university admission notice (Zulassungsbescheid) or formal study applicant confirmation.

**Explore Universities & Grants**: [Global Scholarships Directory](${platformRoutes.scholarships.path})`,
    route: platformRoutes.scholarships.path,
  },
  {
    id: 37,
    category: 'STUDENT_VISAS',
    question: 'Can international students work while studying?',
    matchPatterns: ['can students work while studying', 'international student work hours', 'part time work for students'],
    answer: `### Working Rights for International Students

**Yes! Major international study destinations permit enrolled students to work part-time during academic terms and full-time during holidays:**

- **Canada**: Up to **20 to 24 hours/week** off-campus during regular academic semesters; unlimited full-time hours during scheduled academic breaks.
- **United Kingdom**: Up to **20 hours/week** for degree-level students at higher education institutions.
- **Australia**: Up to **48 hours per fortnight** while course is in session; unlimited hours during official semester vacations.
- **United States**: Up to **20 hours/week** on-campus employment only; off-campus work permitted after year 1 under CPT or severe economic hardship authorization.
- **Germany**: Up to **140 full days** or **280 half days** per calendar year.

**Explore Opportunities**: [Student Success Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 38,
    category: 'STUDENT_VISAS',
    question: 'Can studying abroad lead to permanent residence?',
    matchPatterns: ['can study abroad lead to pr', 'study to permanent residence', 'student to pr roadmap'],
    answer: `### Converting a Student Visa to Permanent Residence

**Yes! Studying abroad is one of the most effective paths to PR:**

1. **Graduate from an Eligible Program**: Complete a minimum 1 to 2-year post-secondary degree.
2. **Access Open Post-Study Work Permits**:
   - Canada PGWP (up to 3 years).
   - UK Graduate Route (2 years for Master's, 3 years for PhD).
   - Australia Subclass 485 (2 to 4 years).
3. **Gain Local Skilled Experience**: Complete 1 year of qualified employment.
4. **Apply for Fast-Track PR**: Receive maximum points for local education + local work experience through Express Entry Canadian Experience Class (CEC), Provincial Nominees (PNP), or Australian State Sponsorship (Subclass 190).

**Start Early**: [Browse 10+ Global Scholarships](${platformRoutes.scholarships.path})`,
    route: platformRoutes.scholarships.path,
  },
  {
    id: 39,
    category: 'STUDENT_VISAS',
    question: 'Can I bring my spouse or children while studying?',
    matchPatterns: ['bring spouse while studying', 'can my family come with me on student visa', 'student visa dependents'],
    answer: `### Bringing Family Members on a Student Visa

- **Canada**: Spouses of international students in master's, doctoral, and selected professional degree programs are eligible for an **Open Work Permit**. Minor children can attend public schools.
- **United Kingdom**: Dependent visas are restricted to students enrolled in postgraduate research programs (PhD and research master's) or government-sponsored scholarship holders.
- **Australia**: Dependent spouses and children can accompany students; spouses typically receive work rights of up to 48 hours per fortnight (or unlimited if the student is in a master's/PhD program).
- **United States**: Spouses and children can accompany on **F-2 visas** (F-2 visa holders cannot work in the US, but children can attend K-12 schooling).

**Consult Our Team**: [Book a Consultation Session](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 40,
    category: 'STUDENT_VISAS',
    question: 'What documents are required for a student visa?',
    matchPatterns: ['documents required for student visa', 'student visa checklist', 'papers needed for study permit'],
    answer: `### Student Visa Document Checklist

1. **Official Acceptance Letter (LOA / I-20 / CAS / COE)** from an accredited university.
2. **Valid Passport** (minimum 12 months validity).
3. **Proof of Financial Capacity (Tuition + Living Expenses)**:
   - Official 6-month bank statements, sponsor affidavits, or scholarship award letters.
   - Canada: GIC Certificate ($20,635 CAD) + paid tuition receipt.
   - Germany: Blocked Account confirmation (€11,208).
4. **Academic Transcripts & Certificates**: High school / bachelor’s transcripts and graduation diplomas.
5. **Statement of Purpose (SOP) / Study Plan**: Clear explanation of course selection and career goals.
6. **Language Proficiency**: IELTS Academic, TOEFL, PTE, or Duolingo score card.
7. **Medical Examination & Police Clearance**: As requested by embassy guidelines.

**Upload & Verify**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },

  // ==========================================
  // TOURIST / VISITOR (41 - 45)
  // ==========================================
  {
    id: 41,
    category: 'TOURIST_VISAS',
    question: 'How can I apply for a tourist visa?',
    matchPatterns: ['how to apply for tourist visa', 'apply for visitor visa', 'tourist visa steps', 'get a travel visa'],
    answer: `### How to Apply for a Tourist / Visitor Visa

1. **Determine Destination & Visa Category**: Schengen Short-Stay (Type C), US B1/B2, Canada TRV, UK Standard Visitor.
2. **Complete Government Visa Application**: Fill out online application forms (e.g., DS-160 for USA, IRCC portal for Canada).
3. **Compile Travel Dossier**: Flight itinerary, hotel reservations/invitation letter, 3-6 months bank statements, and employment leaves.
4. **Pay Statutory Visa Fee**: Settle embassy fees online or via designated bank.
5. **Attend Biometrics / Consular Interview**: Provide fingerprints, photographs, and answer consular questions regarding travel purpose and home ties.

**Explore Package**: [Holiday & Tourist Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 42,
    category: 'TOURIST_VISAS',
    question: 'What documents do I need for a tourist visa?',
    matchPatterns: ['documents needed for tourist visa', 'tourist visa checklist', 'visitor visa requirements'],
    answer: `### Tourist Visa Document Checklist

1. **Valid Passport**: Minimum 6 months validity beyond intended departure date with blank pages.
2. **Proof of Financial Solvency**: 3 to 6 months bank statements stamped by the bank showing sufficient liquid travel funds.
3. **Proof of Employment & Ties to Home Country**:
   - Letter of employment stating approved leave of absence and expected return date.
   - Property deeds, business registrations, or family ties (marriage/birth certificates).
4. **Travel Itinerary**: Flight reservation receipts and hotel bookings or invitation letter from host with host's legal ID.
5. **Travel Health Insurance**: Mandatory for Schengen visas (minimum €30,000 emergency medical coverage).

**Pre-Screen Files**: [Upload to Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 43,
    category: 'TOURIST_VISAS',
    question: 'How long can I stay on a tourist visa?',
    matchPatterns: ['how long can i stay on tourist visa', 'tourist visa duration', 'schengen 90 days rule', 'visitor visa stay limit'],
    answer: `### Permitted Duration of Stay on Tourist Visas

- **Schengen Area**: Up to **90 days** within any rolling 180-day period across all 29 member states.
- **United States (B1/B2)**: Up to **6 months (180 days)** per entry, as stamped on Form I-94 at border control.
- **Canada (Visitor Visa)**: Up to **6 months** per entry (unless a different date is stamped by CBSA).
- **United Kingdom (Standard Visitor)**: Up to **6 months** per visit.
- **Overstay Warning**: Exceeding permitted days can trigger mandatory entry bans, cancellation of multi-year visas, and future application refusals.

**Explore Options**: [Book a Consultation](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 44,
    category: 'TOURIST_VISAS',
    question: 'Can I work while on a tourist visa?',
    matchPatterns: ['can i work on tourist visa', 'work on visitor visa', 'is working allowed on tourist visa'],
    answer: `### Working on a Tourist Visa: Legal Regulations

**No. Engaging in local employment while on a standard tourist or visitor visa is strictly prohibited by law in virtually all countries:**

- **Prohibited Activities**: Working for a local employer, receiving domestic wages, taking casual local jobs.
- **Permitted Business Activities**: Attending corporate conferences, client meetings, contract negotiations, trade shows, or scouting investment opportunities.
- **Remote Work Exception**: Some jurisdictions allow minor incidental remote work for foreign employers, but to live and work remotely on an ongoing basis, you should apply for an official **Digital Nomad Visa** (e.g., Portugal D8, Spain, Dubai).

**Explore Legal Work Routes**: [Explore Work & Digital Nomad Visas](${platformRoutes.programs.path})`,
    route: platformRoutes.programs.path,
  },
  {
    id: 45,
    category: 'TOURIST_VISAS',
    question: 'Can I change from a tourist visa to another immigration status?',
    matchPatterns: ['change from tourist visa to work visa', 'switch visitor visa to pr', 'change status inside country'],
    answer: `### Changing Status from a Tourist Visa

- **Canada**: Candidates with a valid job offer and approved LMIA can apply for an employer-specific work permit from inside Canada under specific temporary public policies.
- **United States**: Permissible to file a Change of Status (Form I-539 to F-1 student) or Adjustment of Status (I-485 for immediate relatives of US citizens), subject to the 90-day intent rule.
- **Schengen / UK**: Generally requires departing the country to apply for a long-stay D-visa or work permit through the applicant's home country embassy, unless holding exceptional qualifications.

**Review Your Status**: [Book a Legal Strategy Consultation](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },

  // ==========================================
  // FAMILY IMMIGRATION (46 - 50)
  // ==========================================
  {
    id: 46,
    category: 'FAMILY_IMMIGRATION',
    question: 'Can I sponsor my spouse?',
    matchPatterns: ['can i sponsor my spouse', 'sponsor husband', 'sponsor wife', 'spousal sponsorship process'],
    answer: `### Spousal Sponsorship Overview

**Yes! Citizens and permanent residents can sponsor their legal spouse or common-law partner for permanent residency:**

- **Canada Spousal Sponsorship**: No minimum income requirement (unless sponsoring dependent children who have dependent children). In-Canada applicants can obtain an Open Work Permit while processing.
- **UK Spouse Visa**: Sponsor must meet minimum gross income threshold (£29,000+) and accommodation standards; 5-year route to ILR.
- **US Immediate Relative (CR-1/IR-1)**: Sponsoring a foreign spouse yields an immediate Green Card upon arrival in the US.

**Explore Package**: [Family Relocation Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 47,
    category: 'FAMILY_IMMIGRATION',
    question: 'Can I sponsor my children?',
    matchPatterns: ['can i sponsor my children', 'child sponsorship', 'sponsor son', 'sponsor daughter'],
    answer: `### Sponsoring Dependent Children

**Yes, citizens and permanent residents can sponsor their biological or legally adopted dependent children for permanent residence:**

- **Age Limit**: Children must generally be **under age 22** and unmarried.
- **Over-Age Exceptions**: Children aged 22 or older who have depended substantially on financial support due to a physical or mental condition.
- **Rights Granted**: Sponsored children receive full permanent residency with immediate access to public schooling and healthcare.

**Explore Details**: [Family Relocation Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 48,
    category: 'FAMILY_IMMIGRATION',
    question: 'Can I sponsor my parents?',
    matchPatterns: ['can i sponsor my parents', 'sponsor mother', 'sponsor father', 'parents sponsorship pr', 'super visa'],
    answer: `### Sponsoring Parents & Grandparents

- **Canada Parents & Grandparents Program (PGP)**: Annual lottery quota granting direct PR. Sponsors must meet Minimum Necessary Income (MNI) for 3 consecutive tax years.
- **Canada Super Visa (Alternative)**: Multi-entry visa valid for up to 10 years, allowing parents to stay continuously for **up to 5 years per visit** (requires medical insurance).
- **United States (Immediate Relative)**: US citizens aged 21+ can sponsor parents for Green Cards with no annual quota limits.
- **Australia (Parent Visas)**: Contributory Parent (Subclass 143) and Non-Contributory Parent pathways.

**Learn More**: [Schedule a Consultation](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 49,
    category: 'FAMILY_IMMIGRATION',
    question: 'How does family sponsorship work?',
    matchPatterns: ['how does family sponsorship work', 'family sponsorship process', 'steps to sponsor family'],
    answer: `### How Family Sponsorship Works

1. **Sponsor Eligibility Check**: The sponsor must be an adult citizen or permanent resident meeting financial and residency rules.
2. **Evidence of Genuine Relationship**: Submitting marriage certificates, cohabitation proof (joint leases, bank accounts), photographs, and communication records.
3. **Application Lodgment**: Two concurrent applications: the Sponsor's Assessment and the Principal Applicant's Permanent Residence application.
4. **Background & Medical Checks**: Sponsored family members complete police clearances and biometric appointments.
5. **Permanent Resident Visa Issuance**: Arrival and issuance of the official PR card.

**Get Representation**: [Family Relocation Package](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 50,
    category: 'FAMILY_IMMIGRATION',
    question: 'How long does family sponsorship take?',
    matchPatterns: ['how long does family sponsorship take', 'spousal sponsorship timeline', 'parents sponsorship time'],
    answer: `### Family Sponsorship Processing Timelines

- **Canada Spousal Sponsorship**: **10 to 12 months** on average (both inland and outland streams).
- **US Spousal Visa (CR-1 / IR-1)**: **12 to 18 months** for consular processing.
- **UK Spouse Visa**: **3 to 6 months** (priority 6-week processing available).
- **Canada Super Visa (Parents)**: **2 to 4 months**.
- **Canada Parents PR Program (PGP)**: **20 to 24 months** following lottery invitation.

**Track Case**: [Client Case Tracking Dashboard](${platformRoutes.cases.path})`,
    route: platformRoutes.cases.path,
  },

  // ==========================================
  // DOCUMENTS (51 - 58)
  // ==========================================
  {
    id: 51,
    category: 'DOCUMENTS',
    question: 'What documents do I need for immigration?',
    matchPatterns: ['what documents do i need for immigration', 'master immigration document checklist', 'required papers for visa'],
    answer: `### Master Immigration Document Checklist

1. **Identity & Travel**: International passport (bio page, minimum 6 months validity) and national identity cards.
2. **Civil Status Records**: Birth certificates, marriage certificates, or divorce orders.
3. **Academic Credentials**: Degrees, diplomas, transcripts, and official Educational Credential Assessment (ECA) reports.
4. **Language Test Scores**: Official IELTS, CELPIP, PTE, or TEF/TCF score sheet (within 2 years).
5. **Employment Records**: Signed reference letters on corporate letterhead, pay slips, and tax returns.
6. **Financial Evidence**: 6-month stamped bank statements and source of funds documentation.
7. **Background & Security**: Police Clearance Certificates (PCC) and Immigration Medical Examination (IME).

**Upload to AI Vault**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 52,
    category: 'DOCUMENTS',
    question: 'Do I need a passport?',
    matchPatterns: ['do i need a passport', 'is passport mandatory for visa', 'passport requirement for immigration'],
    answer: `### Passport Requirements for Immigration

**Yes, an official, unexpired international passport is strictly mandatory for any cross-border immigration application:**

- **Validity Rule**: Must have at least **6 months validity** remaining beyond your planned arrival date (preferably valid for 2+ years for PR applications).
- **Blank Pages**: At least 2 to 4 blank visa pages for entry stamps and visa stickers.
- **Damage Policy**: Passports with torn pages, water damage, or altered photos will be rejected by immigration authorities.

**Upload Passport Scan**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 53,
    category: 'DOCUMENTS',
    question: 'Do I need a police clearance certificate?',
    matchPatterns: ['do i need a police clearance certificate', 'pcc requirement', 'police report for immigration', 'criminal background check'],
    answer: `### Police Clearance Certificates (PCC)

**Yes! Police Clearance Certificates (PCC) are mandatory for all permanent residency, work permit, and citizenship applicants aged 18 and older:**

- **Where Required**: You must provide a police certificate from **every country** where you have lived for **6 or more consecutive months** since turning 18.
- **Validity Window**: Police certificates are generally valid for **6 to 12 months** from the date of issue.
- **Clearance Level**: Must state that no criminal record or convictions exist.

**Upload for Review**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 54,
    category: 'DOCUMENTS',
    question: 'Do I need proof of funds?',
    matchPatterns: ['do i need proof of funds', 'settlement funds required', 'bank statement for immigration', 'show money for visa'],
    answer: `### Proof of Settlement Funds (POF)

**Yes, most economic, skilled worker, and student immigration streams require proof of liquid funds to ensure you can support yourself without social assistance:**

- **Acceptable POF**: Official stamped bank statements, cash savings, fixed deposit certificates, mutual funds, or liquid treasury bonds in your name.
- **Unacceptable POF**: Real estate valuations, borrowed money, crypto assets (unless liquidated into fiat), or credit card limits.
- **Exemptions**: Skilled applicants currently authorized to work legally in Canada with a valid job offer are exempt from POF under Canadian Experience Class.

**Upload Bank Statements**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 55,
    category: 'DOCUMENTS',
    question: 'Do I need medical examinations?',
    matchPatterns: ['do i need medical examinations', 'immigration medical exam', 'ime requirement', 'panel physician medical test'],
    answer: `### Immigration Medical Examinations (IME)

**Yes, permanent residency and long-stay visa applicants must undergo an Immigration Medical Examination (IME) to ensure admissibility:**

- **Authorized Doctors**: The examination must be performed exclusively by an official government-approved **Panel Physician**.
- **Tests Included**: Physical exam, chest X-ray (tuberculosis screening), blood tests (syphilis, HIV, hepatitis), and urinalysis.
- **Validity**: Medical exam results are valid for **12 months** from the date of examination.

**Upload Medical Sheet**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 56,
    category: 'DOCUMENTS',
    question: 'Do I need a language test?',
    matchPatterns: ['do i need a language test', 'is ielts required', 'ielts for pr', 'celpip requirement', 'tef french test'],
    answer: `### Language Examination Requirements

**Yes! For skilled immigration, student visas, and permanent residency, standardized language tests are mandatory:**

- **English Tests for Canada / Australia / UK**:
  - **IELTS (General Training for PR / Academic for Study)**.
  - **CELPIP General (Canada PR)**.
  - **PTE Academic / PTE Core**.
- **French Tests for Canada**:
  - **TEF Canada** or **TCF Canada** (earns significant bonus CRS points).
- **Validity**: Language score cards are strictly valid for **2 years** from the test date.

**Evaluate Language Points**: [Launch Eligibility Calculator](${platformRoutes.eligibility.path})`,
    route: platformRoutes.eligibility.path,
  },
  {
    id: 57,
    category: 'DOCUMENTS',
    question: 'Do my documents need to be translated?',
    matchPatterns: ['do documents need to be translated', 'certified translation requirement', 'notarized translation for visa'],
    answer: `### Certified Translation Requirements

**Yes! Any supporting document that is not in the official language of the destination country (English or French for Canada; English for UK/US/Australia) must be accompanied by an official certified translation:**

- **Certified Translator**: The translation must be executed by a professional certified translator or accredited translation agency.
- **Translator's Affidavit**: Must include an affidavit or signed certification stating translation accuracy, the translator's credentials, and contact details.
- **Original Stamp**: A notarized copy of the original non-English document must be attached to the translation.

**Pre-Screen Translations**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 58,
    category: 'DOCUMENTS',
    question: "What happens if I don't have one of the required documents?",
    matchPatterns: ["missing document for visa", "dont have required document", "cannot get police clearance", "alternative document for immigration"],
    answer: `### Resolving Missing Supporting Documents

If you cannot obtain a specific mandatory document due to war, closed institutions, or civil registry constraints:

1. **Letter of Explanation (LOE)**: Submit a formal, detailed affidavit explaining why the document is unobtainable and showing documented attempts to secure it.
2. **Alternative Secondary Evidence**: Provide secondary proofs (e.g., if a birth certificate is missing, provide school leaving certificates, hospital birth records, and sworn parental affidavits).
3. **Statutory Declaration**: A sworn declaration signed in the presence of a notary public or commissioner of oaths.

**Consult Legal Counsel**: [Book an Immigration Specialist](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },

  // ==========================================
  // APPLICATION PROCESS (59 - 65)
  // ==========================================
  {
    id: 59,
    category: 'APPLICATION_PROCESS',
    question: 'What is the immigration application process?',
    matchPatterns: ['what is the immigration application process', 'application workflow', 'steps to apply for immigration'],
    answer: `### The Global Immigration Application Process

1. **Eligibility Evaluation**: Audit points and match with qualifying programs: [Check Eligibility](${platformRoutes.eligibility.path}).
2. **Document Gathering & AI OCR Scan**: Compile passports, transcripts, references, and bank proofs in our [Document Center](${platformRoutes.documents.path}).
3. **Legal Audit & Dossier Compilation**: Immigration lawyers verify statutory compliance and prepare submission briefs.
4. **Government Lodgment**: Formal filing with immigration authorities (IRCC, UKVI, USCIS, Home Affairs).
5. **Biometrics & Medicals**: Complete fingerprinting and medical exams at visa application centers.
6. **Visa Approval & Landing Support**: Final visa stamping and pre-landing orientation.

**Get Started**: [Create Free Account](${platformRoutes.register.path})`,
    route: platformRoutes.register.path,
  },
  {
    id: 60,
    category: 'APPLICATION_PROCESS',
    question: 'What happens after I submit my application?',
    matchPatterns: ['what happens after i submit my application', 'after application submission', 'next steps after submitting visa'],
    answer: `### What Happens After Submitting Your Application

1. **Acknowledgment of Receipt (AOR)**: Government issues an official tracking number and file confirmation.
2. **Completeness & Eligibility Check**: Visa officers verify that all mandatory documents and fees are present.
3. **Biometrics & Medical Instructions (BIL / IME)**: You receive an official letter to complete fingerprints and medicals at an authorized center within 30 days.
4. **Background & Security Screening**: Verification of police clearances, employment references, and security checks.
5. **Final Decision & Passport Request (PPR)**: Issuance of visa stamp and Confirmation of Permanent Residence (COPR).

**Track Live Updates**: [Client Case Tracking Dashboard](${platformRoutes.cases.path})`,
    route: platformRoutes.cases.path,
  },
  {
    id: 61,
    category: 'APPLICATION_PROCESS',
    question: 'Can I track my application?',
    matchPatterns: ['can i track my application', 'how to track application', 'track my visa status', 'where is my application'],
    answer: `### How to Track Your Application

**Yes! Clients can track their application in real-time through our dedicated portal:**

1. **Sign in** at **[Sign In](${platformRoutes.login.path})**.
2. Navigate to **[Client Case Tracking](${platformRoutes.cases.path})**.
3. View your active milestone status:
   - *Profile Created*
   - *Documents Verified (AI OCR)*
   - *Under Legal Review*
   - *Submitted to Government*
   - *Biometrics Scheduled*
   - *Visa Issued / Approved*
4. Read real-time case officer notes and direct milestone updates.

**Open Dashboard**: [Client Case Tracking](${platformRoutes.cases.path})`,
    route: platformRoutes.cases.path,
  },
  {
    id: 62,
    category: 'APPLICATION_PROCESS',
    question: 'Can I update my application after submission?',
    matchPatterns: ['update application after submission', 'change details on submitted visa', 'add document after submitting'],
    answer: `### Updating an Application After Submission

**Yes, you are legally obligated to update immigration authorities if there is a material change in your circumstances:**

- **Material Changes Requiring Updates**: Change of address, new marital status (marriage/divorce), birth of a child, new passport, or change in employment.
- **How to Submit Updates**:
  - For active clients: Upload the new documentation directly to your [Document Center](${platformRoutes.documents.path}) and notify your case officer.
  - Our legal team will transmit a formal government webform update with the new evidence.

**Upload New File**: [Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 63,
    category: 'APPLICATION_PROCESS',
    question: 'What happens if my application is refused?',
    matchPatterns: ['what happens if application is refused', 'visa refusal reasons', 'what to do if visa rejected'],
    answer: `### Handling a Visa or PR Refusal

If an application is refused by immigration authorities:

1. **Request GCMS / Caseworker Notes**: Obtain the exact internal notes and reasons recorded by the visa officer.
2. **Analyze Grounds for Refusal**: Standard reasons include insufficient proof of funds, incomplete employment evidence, or perceived lack of home ties.
3. **Determine Legal Remedy**:
   - **Re-application**: Address the specific deficiency with fresh evidence and re-submit.
   - **Judicial Review / Appeal**: If the officer made an error of law or breached procedural fairness, file for Judicial Review in Federal Court.

**Request File Audit**: [Book a Consultation with a Legal Specialist](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 64,
    category: 'APPLICATION_PROCESS',
    question: 'Can I apply again after refusal?',
    matchPatterns: ['can i apply again after refusal', 'reapply after visa rejection', 'can i reapply if rejected'],
    answer: `### Re-applying After an Immigration Refusal

**Yes! Unless you received a formal ban for misrepresentation (fraud), you can re-apply at any time:**

- **Key Rule**: Never submit the exact same application that was previously refused.
- **Best Practice**: Obtain official refusal notes, rectify the specific evidentiary deficiencies, provide a comprehensive Letter of Explanation (LOE), and re-submit a fortified dossier.
- **Our Expertise**: Our licensed legal team specializes in overcoming previous refusals for study permits, visitor visas, and skilled PR.

**Get Expert Audit**: [Book an RCIC / Legal Consultation](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 65,
    category: 'APPLICATION_PROCESS',
    question: 'How do I prepare for an immigration consultation?',
    matchPatterns: ['how to prepare for immigration consultation', 'what to bring to consultation', 'prepare for meeting with lawyer'],
    answer: `### Preparing for Your 1-on-1 Immigration Consultation

To maximize the value of your 45-minute strategy consultation:

1. **Upload Resume / CV**: Ensure your education, work history, and current job duties are up to date.
2. **Gather Existing Scores**: Have your IELTS/language test scores, degree transcripts, and ECA assessments ready.
3. **List Target Countries & Goals**: Clarify your preferred destinations, family members accompanying you, and target relocation timeline.
4. **Prepare Key Questions**: Write down specific questions regarding fees, eligibility thresholds, and risk factors.

**Schedule Session**: [Book a Consultation](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },

  // ==========================================
  // PAYMENTS / SERVICES (66 - 72)
  // ==========================================
  {
    id: 66,
    category: 'PAYMENTS',
    question: 'How much does your service cost?',
    matchPatterns: ['how much does your service cost', 'service fees', 'pricing for your services', 'cost of consultancy'],
    answer: `### Global Citizens Solution Service Pricing

We offer clear, transparent, all-inclusive legal service packages:

- **Student Success & Global Scholarship Package**: **$1,200 USD** (University matching, 10+ scholarship applications, SOP optimization, study visa filing).
- **Family Relocation & Sponsorship Package**: **$2,500 USD** (Spousal & dependent sponsorship, medical coordination, dossier review).
- **Skilled Worker & Permanent Residence Package**: **$3,000 USD** (Complete Express Entry/GSM points optimization, ECA assistance, AI OCR audit, direct filing).
- **Investor & Golden Visa VIP Concierge**: **$5,000 USD** (Source of funds audit, real estate/fund due diligence, government dossier handling).

**Compare All Tiers**: [Explore Service Packages](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 67,
    category: 'PAYMENTS',
    question: 'What does your immigration package include?',
    matchPatterns: ['what does your package include', 'package inclusions', 'what is included in service package'],
    answer: `### What Our Service Packages Include

Every Global Citizens Solution package provides comprehensive representation:

1. **Full Legal Representation**: Managed by licensed RCIC consultants and immigration attorneys.
2. **Profile & Points Optimization**: Maximizing CRS and points grid scores.
3. **Encrypted Document Vault with AI OCR**: Pre-screening all files for clarity and compliance.
4. **Statement of Purpose (SOP) & Letter of Explanation (LOE)**: Written by senior immigration copy specialists.
5. **Direct Government Submission & Tracking**: Handling all official correspondence and biometric scheduling.
6. **Milestone Escrow Protection**: Structured payment security tied to delivery stages.

**View Packages**: [Service Packages Directory](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 68,
    category: 'PAYMENTS',
    question: 'Are government fees included?',
    matchPatterns: ['are government fees included', 'do packages include government fee', 'are statutory fees separate'],
    answer: `### Government Statutory Fees vs. Service Fees

- **Consultancy Service Fees**: Cover our professional legal representation, profile evaluation, AI OCR audits, document curation, and case management.
- **Government Statutory Fees**: Separate official fees levied directly by immigration authorities (e.g., IRCC, USCIS, Home Office).
- **Transparency**: All statutory fees are itemized transparently in your personalized fee schedule before filing so you have complete visibility over total costs.

**Review Packages**: [View Service Packages](${platformRoutes.packages.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 69,
    category: 'PAYMENTS',
    question: 'What payment methods do you accept?',
    matchPatterns: ['what payment methods do you accept', 'accepted payment options', 'can i pay with card', 'can i pay with crypto'],
    answer: `### Accepted Payment Methods

We support 3 secure, tier-1 institutional payment rails:

1. **Credit / Debit Cards (Stripe)**: Instant processing with PCI-DSS Level 1 encryption.
2. **Bank Wire Transfer (SWIFT / SEPA / IBAN)**: Institutional bank-to-bank escrow with 1–2 business day confirmation. Includes your unique client reference ID.
3. **Cryptocurrency Escrow (BTC, ETH, USDT, USDC)**: Fast borderless settlement on the blockchain (15–30 minutes) with a dedicated 30-minute price lock and zero FX exchange penalties.

**Manage Payments**: [Billing & Wallet](${platformRoutes.wallet.path})`,
    route: platformRoutes.wallet.path,
  },
  {
    id: 70,
    category: 'PAYMENTS',
    question: 'Can I pay in installments?',
    matchPatterns: ['can i pay in installments', 'milestone payments', 'split payment options', 'installment plan for visa'],
    answer: `### Milestone & Installment Payment Plans

**Yes! Global Citizens Solution offers structured milestone-based payment plans for full service packages:**

- **Retainer Deposit**: Initial deposit to begin profile evaluation, document checklist creation, and AI OCR auditing.
- **Mid-Milestone**: Second tranche payable upon completion of dossier review and positive ECA/language verification.
- **Final Submission Tranche**: Final settlement prior to official government submission.

**Manage Billing**: [Client Billing & Wallet](${platformRoutes.wallet.path})`,
    route: platformRoutes.wallet.path,
  },
  {
    id: 71,
    category: 'PAYMENTS',
    question: 'Can I request a refund?',
    matchPatterns: ['can i request a refund', 'refund policy', 'money back guarantee', 'what is your refund policy'],
    answer: `### Refund & Escrow Policy

Global Citizens Solution maintains an institutional escrow protection policy:

- **Pre-Service Cancellation**: If you cancel before legal drafting or document verification begins, funds held in escrow are refunded minus standard payment gateway processing fees.
- **Milestone Protection**: Funds are disbursed in transparent tranches only as specific work milestones are achieved.
- **Government Fees**: Government statutory filing fees are non-refundable once paid to immigration authorities.

**Review Billing Terms**: [Billing & Wallet](${platformRoutes.wallet.path})`,
    route: platformRoutes.wallet.path,
  },
  {
    id: 72,
    category: 'PAYMENTS',
    question: 'How do I book a consultation?',
    matchPatterns: ['how do i book a consultation', 'book strategy session', 'schedule meeting with lawyer'],
    answer: `### How to Book a 1-on-1 Consultation

1. Visit our **[Consultation Booking Page](${platformRoutes.consultation.path})**.
2. Select your session format: **Encrypted HD Video Session** or **Phone Consultation**.
3. Choose your target country/program and preferred date/time.
4. Provide a brief overview of your background and goals.
5. Confirm booking via instant card or wallet payment.

**Book Now**: [Book a Consultation Session](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },

  // ==========================================
  // WEBSITE (73 - 80)
  // ==========================================
  {
    id: 73,
    category: 'WEBSITE_HELP',
    question: 'How do I create an account?',
    matchPatterns: ['how do i create an account', 'how to register', 'sign up steps', 'create free account'],
    answer: `### How to Create Your Free Account

1. Click on **[Create Account](${platformRoutes.register.path})** in the top navigation bar.
2. Enter your **First Name**, **Last Name**, **Email Address**, and a secure password.
3. Click **Create Account**. A 6-digit verification code will be sent to your email.
4. Enter your code at **[Verify Email](/verify-email)** to activate your portal.
5. You can immediately access the Document Vault, book consultations, and start an application.

**Direct Link**: [Register Now for Free](${platformRoutes.register.path})`,
    route: platformRoutes.register.path,
  },
  {
    id: 74,
    category: 'WEBSITE_HELP',
    question: 'How do I submit an application?',
    matchPatterns: ['how do i submit an application', 'submit visa application on website', 'how to apply online'],
    answer: `### How to Submit an Application Online

1. **Sign In**: Log into your account at **[Sign In](${platformRoutes.login.path})** (or [Create Account](${platformRoutes.register.path})).
2. **Choose Package / Program**: Select your desired service tier from our **[Service Packages](${platformRoutes.packages.path})**.
3. **Upload Supporting Documents**: Upload your passport, transcripts, and proofs to the **[Document Center](${platformRoutes.documents.path})**.
4. **Complete Intake Details**: Fill out the case profile questionnaire in your dashboard.
5. **Submit for Legal Review**: Our legal team will audit your files and prepare the formal submission.

**Get Started**: [Create Free Account](${platformRoutes.register.path})`,
    route: platformRoutes.packages.path,
  },
  {
    id: 75,
    category: 'WEBSITE_HELP',
    question: 'How do I upload documents?',
    matchPatterns: ['how do i upload documents', 'upload files to portal', 'document center upload'],
    answer: `### How to Upload Documents to the Document Vault

1. **Sign In** and navigate to your **[Document Center](${platformRoutes.documents.path})**.
2. Select the relevant category (e.g., *Passport & Identity*, *Proof of Funds*, *Academic Transcripts*, *Police Clearance*).
3. Drag and drop your file or click **Browse Files** (PDF, JPG, PNG, WebP up to 25 MB).
4. Click **Upload & Scan**. Our AI OCR system will immediately verify document legibility and index key information.

**Direct Link**: [Go to Document Center](${platformRoutes.documents.path})`,
    route: platformRoutes.documents.path,
  },
  {
    id: 76,
    category: 'WEBSITE_HELP',
    question: 'Where can I view my application status?',
    matchPatterns: ['where can i view my application status', 'where to see application', 'check my case status'],
    answer: `### How to View Your Application Status

1. Log into your account at **[Sign In](${platformRoutes.login.path})**.
2. Navigate directly to **[Client Case Tracking](${platformRoutes.cases.path})**.
3. View your active milestone timeline (from Profile Created to Visa Issued) and case officer notes.

**Direct Link**: [Client Case Tracking Dashboard](${platformRoutes.cases.path})`,
    route: platformRoutes.cases.path,
  },
  {
    id: 77,
    category: 'WEBSITE_HELP',
    question: 'How do I contact an immigration consultant?',
    matchPatterns: ['how do i contact an immigration consultant', 'contact support', 'speak with a consultant', 'whatsapp contact'],
    answer: `### How to Contact an Immigration Consultant

- **1-on-1 Video/Phone Consultation**: Schedule a dedicated 45-minute private legal session: [Book Consultation](${platformRoutes.consultation.path}).
- **Email Support**: \`${websiteKnowledge.contact.email}\`
- **WhatsApp Support**: \`${websiteKnowledge.contact.whatsapp}\` ([Chat on WhatsApp](${websiteKnowledge.contact.whatsappUrl})).
- **24/7 AI Concierge**: Ask any question directly right here in this chat window.

**Book Session**: [Schedule Consultation Now](${platformRoutes.consultation.path})`,
    route: platformRoutes.consultation.path,
  },
  {
    id: 78,
    category: 'WEBSITE_HELP',
    question: 'Where can I find available immigration programs?',
    matchPatterns: ['where can i find available immigration programs', 'programs list', 'explore programs on website', 'where are visa programs'],
    answer: `### Finding Immigration Programs on Our Platform

- **Immigration Programs Directory**: Browse Skilled Worker, Work Permits, Digital Nomad, and Study programs: [Explore Programs](${platformRoutes.programs.path}).
- **Citizenship by Investment & Golden Visas**: Explore CBI passports and Golden Visas: [Citizenship by Investment](${platformRoutes.cbiPrograms.path}).
- **Country Directory**: Detailed visa options for 50+ countries: [Country Directory](${platformRoutes.countries.path}).

**Direct Link**: [Explore Programs](${platformRoutes.programs.path})`,
    route: platformRoutes.programs.path,
  },
  {
    id: 79,
    category: 'WEBSITE_HELP',
    question: 'Where can I find scholarship opportunities?',
    matchPatterns: ['where can i find scholarship opportunities', 'find scholarships on website', 'scholarship section location'],
    answer: `### Finding Global Scholarships

You can browse all 10 prestigious, fully-funded global scholarships (Fulbright, Chevening, DAAD, Vanier, MEXT, etc.) on our dedicated **[Global Scholarships Directory](${platformRoutes.scholarships.path})**.

Filter by host destination, grant amount (up to $150,000), and academic degree level.

**Direct Link**: [Browse Global Scholarships](${platformRoutes.scholarships.path})`,
    route: platformRoutes.scholarships.path,
  },
  {
    id: 80,
    category: 'WEBSITE_HELP',
    question: 'How do I make a payment?',
    matchPatterns: ['how do i make a payment', 'make deposit on website', 'how to pay invoice'],
    answer: `### How to Make a Payment on the Platform

1. **Online Checkout**: When selecting a [Service Package](${platformRoutes.packages.path}) or booking a [Consultation](${platformRoutes.consultation.path}), pay instantly via Stripe credit/debit card.
2. **Client Wallet**: Log in and visit **[Billing & Wallet](${platformRoutes.wallet.path})** to:
   - Generate an official Bank Wire invoice with your unique client reference ID.
   - Select Cryptocurrency Escrow (BTC, ETH, USDT, USDC) for instant on-chain settlement.

**Direct Link**: [Manage Billing & Wallet](${platformRoutes.wallet.path})`,
    route: platformRoutes.wallet.path,
  },
];

/**
 * Searches the 80-question knowledge base for high-confidence exact/fuzzy matches.
 */
export function findFAQMatch(query: string): FAQEntry | undefined {
  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return undefined;

  for (const faq of faq80KnowledgeBase) {
    if (q.includes(faq.question.toLowerCase())) {
      return faq;
    }
    for (const pattern of faq.matchPatterns) {
      if (q.includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(q)) {
        return faq;
      }
    }
  }

  return undefined;
}

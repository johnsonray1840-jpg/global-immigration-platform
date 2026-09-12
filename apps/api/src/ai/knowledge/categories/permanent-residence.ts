import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const permanentResidenceCategory: KnowledgeCategory = {
  code: 'PERMANENT_RESIDENCE',
  name: 'Permanent Residence (PR)',
  description: 'Points systems, Express Entry, PNPs, and direct permanent residency routes',
  topics: [
    {
      id: 'canada-express-entry',
      category: 'PERMANENT_RESIDENCE',
      title: 'Canada Express Entry & Comprehensive Ranking System (CRS)',
      keywords: ['canada pr', 'express entry', 'crs score', 'fsw', 'cec', 'points calculation', 'canada permanent residence'],
      summary: 'Canada points-based system for Federal Skilled Worker, Canadian Experience Class, and PNPs.',
      content: `Canada Express Entry is the primary system for managing permanent residence applications for skilled workers:

1. **Streams**:
   - **Federal Skilled Worker (FSW)**: For foreign skilled workers with eligible foreign work experience. Requires minimum 67/100 points on the selection grid.
   - **Canadian Experience Class (CEC)**: For individuals with at least 1 year of Canadian skilled work experience.
   - **Provincial Nominee Programs (PNP)**: Gives +600 CRS points upon nomination by a province (OINP, BCPNP, AAIP).

2. **Core Factors Evaluated**:
   - **Age**: Maximum points awarded between ages 20–29 (declines after age 30).
   - **Education**: Assessed via Educational Credential Assessment (ECA) through WES, ICAS, or IQAS.
   - **Language**: Official test scores in IELTS (General), CELPIP (General), or TEF/TCF (French). CLB 9+ maximizes CRS points.
   - **Work Experience**: Foreign and Canadian skilled work under TEER 0, 1, 2, or 3.`,
      primaryRoute: platformRoutes.countryDetail('CA').path,
      relatedRoutes: [
        { label: 'Calculate PR Points', path: platformRoutes.eligibility.path },
        { label: 'Book RCIC Consultant', path: platformRoutes.consultation.path },
        { label: 'Skilled Worker Package', path: platformRoutes.packages.path },
      ],
      suggestedPrompts: [
        'How can I increase my CRS score?',
        'What is the minimum IELTS score for Express Entry?',
        'How does a Provincial Nominee Program work?',
      ],
    },
    {
      id: 'australia-skilled-pr',
      category: 'PERMANENT_RESIDENCE',
      title: 'Australia General Skilled Migration (Subclass 189, 190, 491)',
      keywords: ['australia pr', 'subclass 189', 'subclass 190', 'subclass 491', 'skillselect', 'australian permanent residence'],
      summary: 'Australia points-tested visas for independent and state-nominated skilled migrants.',
      content: `Australia’s General Skilled Migration program allows qualified skilled professionals to live and work permanently:

- **Subclass 189 (Skilled Independent)**: Permanent residence visa without requiring employer or state sponsorship. Minimum 65 points required to submit an Expression of Interest (EOI).
- **Subclass 190 (Skilled Nominated)**: Permanent visa nominated by an Australian state government (+5 points).
- **Subclass 491 (Skilled Work Regional)**: 5-year provisional visa requiring regional residence with a direct pathway to permanent residence (Subclass 191) after 3 years (+15 points).
- **Key Requirements**: Positive skills assessment from relevant assessing body (ACS, Engineers Australia, VETASSESS), competent English (IELTS 6+ or PTE 50+), and age under 45.`,
      primaryRoute: platformRoutes.countryDetail('AU').path,
      relatedRoutes: [
        { label: 'Check Eligibility', path: platformRoutes.eligibility.path },
        { label: 'Book a Consultation', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['How many points do I need for Australia PR?', 'What is a skills assessment for Australia?'],
    },
  ],
};

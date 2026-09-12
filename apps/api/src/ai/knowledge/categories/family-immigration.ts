import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const familyImmigrationCategory: KnowledgeCategory = {
  code: 'FAMILY_IMMIGRATION',
  name: 'Family Immigration & Spousal Sponsorship',
  description: 'Spouse, common-law partner, dependent children, and parent sponsorship programs',
  topics: [
    {
      id: 'spousal-sponsorship',
      category: 'FAMILY_IMMIGRATION',
      title: 'Spousal & Common-Law Sponsorship Guidelines',
      keywords: ['spousal sponsorship', 'sponsor wife', 'sponsor husband', 'family reunification', 'canada spousal pr', 'uk spouse visa'],
      summary: 'Reuniting with spouses and partners through legal permanent sponsorship.',
      content: `Family sponsorship allows citizens and permanent residents to sponsor their immediate relatives:

- **Canada Spousal Sponsorship**:
  - Sponsor must be 18+ and a Canadian citizen or permanent resident living in Canada.
  - No minimum income requirement (unless sponsoring dependent children who have dependent children).
  - Both In-Canada Class (eligible for Open Work Permit while processing) and Family Class (outland) available.
  - Processing average: 10 to 12 months.
- **UK Spouse Visa**:
  - Sponsor must meet the minimum financial requirement (£29,000+ income threshold) and provide adequate accommodation proof.
  - Applicant must demonstrate English proficiency (A1 for initial entry).
  - 5-year route to Indefinite Leave to Remain (ILR).
- **US Immediate Relative (CR-1 / IR-1)**:
  - Consular processing for spouses of US citizens leading directly to a 2-year conditional or 10-year unconditional Green Card upon entry.`,
      primaryRoute: platformRoutes.packages.path,
      relatedRoutes: [
        { label: 'Family Relocation Package', path: platformRoutes.packages.path },
        { label: 'Book Legal Specialist', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['What are the requirements to sponsor my spouse to Canada?', 'What is the UK spouse visa income requirement?'],
    },
  ],
};

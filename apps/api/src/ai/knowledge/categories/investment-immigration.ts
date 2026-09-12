import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const investmentImmigrationCategory: KnowledgeCategory = {
  code: 'INVESTMENT_IMMIGRATION',
  name: 'Investment Immigration & Golden Visas',
  description: 'Capital investment funds, real estate Golden Visas, due diligence, and high-net-worth mobility',
  topics: [
    {
      id: 'golden-visas-europe',
      category: 'INVESTMENT_IMMIGRATION',
      title: 'European Golden Visas & Residency by Investment',
      keywords: ['golden visa', 'portugal golden visa', 'greece golden visa', 'spain golden visa', 'malta mprp', 'residency by investment'],
      summary: 'Obtaining European residency and visa-free Schengen access through qualifying investments.',
      content: `European Golden Visa programs offer legal residence with minimal physical stay requirements:

1. **Portugal Golden Residence Permit**:
   - Minimum investment of **€500,000** in approved non-real estate investment/venture capital funds.
   - Stay requirement: Just 7 days in year 1, and 14 days in subsequent two-year blocks.
   - Eligible for permanent residency or Portuguese (EU) citizenship after 5 years with basic A2 language test.

2. **Greece Golden Visa**:
   - Real estate investment from **€250,000** (industrial conversion or heritage restoration) up to **€800,000** in prime zones (Athens, Thessaloniki, Mykonos, Santorini).
   - Instant 5-year renewable permanent residence permit for the entire family (spouse, children under 21, parents of both spouses).

3. **Malta Permanent Residence Programme (MPRP)**:
   - Direct government contribution (€28k if purchasing property, €58k if leasing) + €2,000 NGO donation + real estate purchase (€300k–€350k) or 5-year lease (€10k–€12k/year).
   - Lifetime permanent residency with visa-free travel throughout the Schengen Area.`,
      primaryRoute: platformRoutes.cbiPrograms.path,
      relatedRoutes: [
        { label: 'Citizenship by Investment Portal', path: platformRoutes.cbiPrograms.path },
        { label: 'Investor Packages', path: platformRoutes.packages.path },
        { label: 'Private Wealth Consultation', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: [
        'What is the minimum investment for a Greece Golden Visa?',
        'How does the Portugal €500k fund route work?',
        'Can my family be included in a Golden Visa application?',
      ],
    },
    {
      id: 'us-eb5-investor',
      category: 'INVESTMENT_IMMIGRATION',
      title: 'United States EB-5 Immigrant Investor Program',
      keywords: ['eb-5', 'eb5 visa', 'us investor visa', 'eb-5 green card', 'targeted employment area'],
      summary: 'Direct US permanent residence (Green Card) for qualifying capital investment in job-creating enterprises.',
      content: `The EB-5 program grants US Green Cards to foreign investors and their immediate family (spouse and unmarried children under 21):

- **Minimum Investment**:
  - **$800,000** in a Targeted Employment Area (TEA - rural or high unemployment zone).
  - **$1,050,000** in non-TEA projects.
- **Job Creation**: Must create or preserve at least 10 full-time jobs for qualifying US workers.
- **Priority Processing**: Rural TEA projects enjoy reserved visa categories (20% quota set-aside) and expedited processing without extensive country backlogs.
- **Concurrent Filing**: If already in the US on a non-immigrant visa (F-1, H-1B, L-1, E-2), investors can file Form I-485 concurrently for immediate Employment Authorization (EAD) and Travel Advance Parole.`,
      primaryRoute: platformRoutes.programs.path,
      relatedRoutes: [
        { label: 'US Country Guide', path: platformRoutes.countryDetail('US').path },
        { label: 'Book Legal Consultation', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['What is the minimum amount for a US EB-5 visa?', 'What is concurrent filing under EB-5?'],
    },
  ],
};

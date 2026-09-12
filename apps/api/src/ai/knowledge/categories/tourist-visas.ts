import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const touristVisasCategory: KnowledgeCategory = {
  code: 'TOURIST_VISAS',
  name: 'Tourist Visas & Short-Stay Permits',
  description: 'Visitor visas, Schengen short stays, ETA/ESTA, document curation, and interview guidance',
  topics: [
    {
      id: 'tourist-visas-overview',
      category: 'TOURIST_VISAS',
      title: 'Visitor & Tourist Visa Application Guidelines',
      keywords: ['tourist visa', 'visitor visa', 'schengen visa', 'us b1 b2 visa', 'canada visitor visa', 'travel document checklist'],
      summary: 'Requirements for short-stay business and leisure visitor visa approvals.',
      content: `Tourist and visitor visas allow temporary entry for leisure, family visits, or business meetings without engaging in local employment:

1. **Schengen Short-Stay Visa (Type C)**:
   - Grants up to 90 days stay within any 180-day period across all 29 Schengen member states.
   - Requires travel insurance with minimum €30,000 coverage, flight reservations, proof of accommodation, and 3-month bank statements.
2. **US B1/B2 Visitor Visa**:
   - 10-year multiple-entry visa for qualifying nationalities. Requires DS-160 filing, fee receipt, and consular interview showing strong home ties.
3. **Canada Visitor Visa (Temporary Resident Visa - TRV)**:
   - Valid for up to 10 years or until passport expiry. Requires proof of financial solvency and purpose of travel.`,
      primaryRoute: platformRoutes.packages.path,
      relatedRoutes: [
        { label: 'View Service Packages', path: platformRoutes.packages.path },
        { label: 'Book Document Pre-Screening', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['What documents are required for a Schengen tourist visa?', 'How do I prove ties to my home country for a visitor visa?'],
    },
  ],
};

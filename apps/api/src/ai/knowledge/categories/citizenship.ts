import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const citizenshipCategory: KnowledgeCategory = {
  code: 'CITIZENSHIP',
  name: 'Citizenship & Naturalization',
  description: 'Pathways to citizenship by naturalization, ancestry, and direct investment',
  topics: [
    {
      id: 'citizenship-naturalization',
      category: 'CITIZENSHIP',
      title: 'Citizenship by Naturalization & Physical Presence',
      keywords: ['citizenship by naturalization', 'how to become a citizen', 'passport requirement', 'dual citizenship', 'physical presence'],
      summary: 'Standard legal criteria to transition from permanent residency to full citizenship.',
      content: `Citizenship grants full political rights, the national passport, and unrestricted right to reside without minimum physical stay conditions.

Standard physical presence timelines:
- **Canada**: Physical presence in Canada for at least 1,095 days (3 years) during the 5 years prior to application.
- **United Kingdom**: 5 years of lawful residence + 12 months on Indefinite Leave to Remain (ILR).
- **United States**: 5 years as a permanent resident (Green Card) or 3 years if married to a US citizen.
- **Portugal**: 5 years of legal residency with basic A2 Portuguese language proficiency.
- **Australia**: 4 years of lawful residence including at least 12 months as a permanent resident.`,
      primaryRoute: platformRoutes.programs.path,
      relatedRoutes: [
        { label: 'Explore Programs', path: platformRoutes.programs.path },
        { label: 'Citizenship by Investment', path: platformRoutes.cbiPrograms.path },
      ],
      suggestedPrompts: ['How many years does it take to get citizenship in Canada?', 'Which countries allow dual citizenship?'],
    },
    {
      id: 'citizenship-by-investment',
      category: 'CITIZENSHIP',
      title: 'Direct Citizenship by Investment (CBI)',
      keywords: ['cbi', 'citizenship by investment', 'caribbean passport', 'st kitts', 'dominica', 'grenada', 'antigua', 'saint lucia', 'malta mein'],
      summary: 'Legally authorized government programs granting fast second citizenship within 3 to 6 months.',
      content: `Citizenship by Investment (CBI) allows high-net-worth individuals and families to acquire a second passport legally through qualifying capital investments:

1. **Caribbean CBI Programs (Fast 3–6 Months Processing)**:
   - **St. Kitts & Nevis, Dominica, Grenada, Antigua & Barbuda, Saint Lucia**.
   - **Contribution**: Sovereign fund donation starting at $100,000–$240,000 or approved real estate purchase.
   - **Benefits**: Visa-free or visa-on-arrival travel to 140+ countries (UK, Schengen, Singapore, Hong Kong), no physical residency requirement, favorable tax regimes.
   
2. **Malta Citizenship for Exceptional Services by Direct Investment (MEIN)**:
   - Tier-1 EU citizenship with full right to live, work, and study anywhere in the European Union.
   - Minimum direct contribution of €600,000 (after 36 months residency) or €750,000 (after 12 months) + €10,000 charity donation + qualifying real estate lease or purchase.`,
      primaryRoute: platformRoutes.cbiPrograms.path,
      relatedRoutes: [
        { label: 'Investor Packages', path: platformRoutes.packages.path },
        { label: 'Book Private Wealth Advisor', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['What is the cheapest Caribbean CBI program?', 'How long does a Caribbean passport take?'],
    },
  ],
};

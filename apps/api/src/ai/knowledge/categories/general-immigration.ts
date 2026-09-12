import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const generalImmigrationCategory: KnowledgeCategory = {
  code: 'GENERAL_IMMIGRATION',
  name: 'General Immigration & Relocation',
  description: 'Foundational concepts, visa types, comparison, and global mobility guidance',
  topics: [
    {
      id: 'general-overview',
      category: 'GENERAL_IMMIGRATION',
      title: 'Global Immigration Overview & Principles',
      keywords: ['immigration', 'relocate', 'move abroad', 'visa options', 'how immigration works', 'best country to move'],
      summary: 'Comprehensive overview of legal pathways to live, work, invest, or study abroad.',
      content: `Global immigration involves selecting a legal pathway based on your background, age, qualifications, financial resources, and relocation objectives.

Key immigration categories include:
1. **Economic & Skilled Migration**: Points-based permanent residence for professionals (Canada, Australia, UK, Germany).
2. **Investment & Residency by Investment**: Fast-track golden visas and direct citizenship through capital investment.
3. **Higher Education & Student Visas**: Studying at accredited institutions with post-study work rights (PGWP / OPT).
4. **Employment & Work Permits**: Employer-sponsored work authorizations and intra-company transfers.
5. **Family Sponsorship**: Reuniting with spouses, dependent children, or parents who are citizens/PRs.

Our platform provides end-to-end evaluation, certified translation, AI document pre-screening, and legal filing.`,
      primaryRoute: platformRoutes.programs.path,
      relatedRoutes: [
        { label: 'Check Eligibility', path: platformRoutes.eligibility.path },
        { label: 'Compare Countries', path: platformRoutes.compare.path },
        { label: 'Book a Consultation', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: [
        'Which country is easiest to immigrate to?',
        'How does points-based immigration work?',
        'What is the difference between PR and citizenship?',
      ],
    },
    {
      id: 'country-comparison',
      title: 'Comparing Destination Countries',
      keywords: ['compare countries', 'cost of living', 'safety index', 'tax rate', 'passport power', 'which country is best'],
      summary: 'Compare safety ratings, healthcare, cost of living, and tax rates across 50+ destinations.',
      content: `Choosing the right country depends on key lifestyle, economic, and immigration factors:

- **Safety & Healthcare**: Switzerland, Japan, Singapore, Canada, and Nordic countries rank highest for family safety and universal healthcare.
- **Tax Efficiency**: UAE (0% income tax), Caribbean CBI nations (0% foreign income tax), and Malta/Portugal specialized tax regimes.
- **Cost of Living**: Eastern Europe (Hungary, Poland, Romania) and Southeast Asia (Malaysia, Thailand) offer lower living costs compared to US/UK/Canada.
- **Language Requirements**: English-speaking destinations (Canada, UK, US, Australia, Ireland, New Zealand) vs multilingual EU nations.`,
      primaryRoute: platformRoutes.compare.path,
      relatedRoutes: [
        { label: 'Country Directory', path: platformRoutes.countries.path },
        { label: 'Explore Programs', path: platformRoutes.programs.path },
      ],
      suggestedPrompts: ['Compare Canada vs Australia for PR', 'Which countries offer low taxes and high safety?'],
    },
  ],
};

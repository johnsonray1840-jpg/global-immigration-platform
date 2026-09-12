import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const scholarshipsCategory: KnowledgeCategory = {
  code: 'SCHOLARSHIPS',
  name: 'Global Scholarships & Education Grants',
  description: '10+ premier fully funded scholarships, university placement, stipends, and deadlines',
  topics: [
    {
      id: 'scholarships-directory',
      category: 'SCHOLARSHIPS',
      title: 'Top 10 Fully Funded Global Scholarships',
      keywords: ['scholarships', 'fully funded scholarship', 'chevening', 'fulbright', 'daad', 'vanier', 'mext', 'singa', 'eiffel', 'swiss government scholarship', 'ireland scholarship'],
      summary: 'Details of prestigious global government scholarships covering 100% tuition, monthly stipends, and airfare.',
      content: `Global Citizens Solution connects prospective students with 10 world-leading fully funded scholarships:

1. **Fulbright Foreign Student Program (USA)**: Full tuition, living stipend, round-trip airfare, and J-1 visa sponsorship ($50,000/yr).
2. **Chevening Scholarships (UK)**: 100% tuition waiver for 1-year master’s at any UK university + monthly living allowance + flights.
3. **DAAD Helmut-Schmidt-Programme (Germany)**: 100% tuition waiver + €934/month living stipend + health insurance + language course.
4. **Australia Awards (Australia)**: Full tuition + return airfare + establishment allowance + health cover.
5. **Vanier Canada Graduate Scholarships (Canada)**: $50,000 CAD/year for 3 years ($150,000 total) for doctoral candidates.
6. **Eiffel Excellence Scholarship (France)**: €1,181–€1,800/mo allowance + return airfare + French healthcare.
7. **Swiss Government Excellence Scholarships (Switzerland)**: Monthly stipend of CHF 1,920–CHF 3,500 + Swiss medical insurance.
8. **MEXT Japanese Government Scholarship (Japan)**: 100% tuition waiver + 145,000 JPY/month + flight tickets.
9. **SINGA Award (Singapore)**: Full PhD tuition + SGD 2,700/mo stipend + $1,000 settling-in grant.
10. **Government of Ireland Scholarship (Ireland)**: Full tuition waiver + €10,000 living stipend for 1 year.`,
      primaryRoute: platformRoutes.scholarships.path,
      relatedRoutes: [
        { label: 'Browse Scholarships Directory', path: platformRoutes.scholarships.path },
        { label: 'Student Success Package', path: platformRoutes.packages.path },
        { label: 'Book Education Specialist', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: [
        'How do I apply for Chevening scholarship in the UK?',
        'What are the requirements for DAAD scholarship in Germany?',
        'Can I get a full scholarship for my Master’s degree?',
      ],
    },
  ],
};

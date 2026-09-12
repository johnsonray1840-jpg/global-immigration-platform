import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const eligibilityCategory: KnowledgeCategory = {
  code: 'ELIGIBILITY',
  name: 'Eligibility Assessment & Points Systems',
  description: 'CRS point calculators, selection grids, age factors, language criteria, and pre-screening evaluations',
  topics: [
    {
      id: 'eligibility-assessment-tool',
      category: 'ELIGIBILITY',
      title: 'Interactive Points & Eligibility Calculator',
      keywords: ['check eligibility', 'calculate points', 'points calculator', 'am i eligible', 'crs calculator', 'points assessment'],
      summary: 'Automated evaluation calculating qualification scores across Canada, UK, Germany, and Australia.',
      content: `Our **[Eligibility Assessment](${platformRoutes.eligibility.path})** evaluates your profile across core immigration criteria:

- **Age**: Optimal scores awarded to applicants aged 20–29. Points gradually scale down past age 30.
- **Education**: Evaluates highest level of completed education (High School, Bachelor's, Master's, PhD).
- **Language Proficiency**: Evaluates official IELTS, CELPIP, PTE, TOEFL, or TEF/TCF scores. High proficiency (CLB 9 / IELTS 8777) significantly increases point outcomes.
- **Work Experience**: Evaluates years of full-time skilled work experience (foreign vs local).
- **Adaptability**: Spouse's education/language, previous study or work in the target country, or close relatives residing as PR/citizens.

**Next Action**: Run your instant evaluation at **[Eligibility Assessment](${platformRoutes.eligibility.path})**.`,
      primaryRoute: platformRoutes.eligibility.path,
      relatedRoutes: [
        { label: 'Launch Eligibility Calculator', path: platformRoutes.eligibility.path },
        { label: 'Book 1-on-1 Consultation', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: [
        'How do I calculate my Canada CRS points?',
        'What is the maximum age for skilled immigration?',
        'Does having a Master’s degree give more points?',
      ],
    },
  ],
};

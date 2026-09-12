import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const studentVisasCategory: KnowledgeCategory = {
  code: 'STUDENT_VISAS',
  name: 'Student Visas & Post-Study Work Pathways',
  description: 'Study permits, proof of funds, university admission, and post-graduation work rights (PGWP / OPT)',
  topics: [
    {
      id: 'student-permits-overview',
      category: 'STUDENT_VISAS',
      title: 'International Student Permits & Admission Rules',
      keywords: ['student visa', 'study permit', 'proof of funds for study', 'university admission', 'cas letter', 'i-20'],
      summary: 'Essential guidelines for international study admissions and embassy visa approval.',
      content: `Securing a study permit requires three core foundations:

1. **Unconditional Letter of Acceptance (LOA / I-20 / CAS / COE)**:
   - Must be issued by a Designated Learning Institution (DLI) or accredited government-approved university.
2. **Proof of Financial Support & Tuition Settlement**:
   - Living expenses + full first-year tuition fee proof.
   - For Canada: Official Guaranteed Investment Certificate (GIC) CAD $20,635+ for living expenses + first-year paid tuition receipt.
   - For Germany: Blocked account (Sperrkonto) with ~€11,208/year.
   - For UK: Living funds of £1,023/month (outside London) or £1,334/month (inside London) for up to 9 months.
3. **Academic Integrity & Ties to Home Country**:
   - Statement of Purpose (SOP) demonstrating genuine academic progression.`,
      primaryRoute: platformRoutes.packages.path,
      relatedRoutes: [
        { label: 'Browse Global Scholarships', path: platformRoutes.scholarships.path },
        { label: 'Student Success Package', path: platformRoutes.packages.path },
        { label: 'Book Education Advisor', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: [
        'How much proof of funds is needed for a Canadian study permit?',
        'What is a German blocked account?',
        'Can international students work while studying?',
      ],
    },
    {
      id: 'post-graduation-work-permits',
      category: 'STUDENT_VISAS',
      title: 'Post-Study Work Rights (PGWP & OPT)',
      keywords: ['pgwp', 'opt', 'stem opt', 'graduate visa uk', 'work after graduation', 'study to pr'],
      summary: 'Work authorizations granted to international graduates facilitating transition to PR.',
      content: `International graduates can access open work permits after completing qualifying degree programs:

- **Canada Post-Graduation Work Permit (PGWP)**: Up to 3 years open work permit depending on program length. Direct stepping stone to permanent residency via Canadian Experience Class (CEC).
- **United States OPT & STEM Extension**: 12 months standard Optional Practical Training (OPT) + 24 months additional extension for STEM degree graduates (3 years total US work authorization).
- **United Kingdom Graduate Route**: 2-year unsponsored work visa for bachelor's and master's graduates (3 years for PhD).
- **Australia Temporary Graduate Visa (Subclass 485)**: 2 to 4 years post-study work rights with regional stay extensions.`,
      primaryRoute: platformRoutes.programs.path,
      relatedRoutes: [
        { label: 'Explore PR Pathways', path: platformRoutes.programs.path },
        { label: 'Calculate Eligibility', path: platformRoutes.eligibility.path },
      ],
      suggestedPrompts: ['How do I transition from student visa to permanent residence?', 'How long is the UK Graduate visa?'],
    },
  ],
};

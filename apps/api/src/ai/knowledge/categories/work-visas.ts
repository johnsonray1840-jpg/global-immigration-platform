import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const workVisasCategory: KnowledgeCategory = {
  code: 'WORK_VISAS',
  name: 'Work Visas & Remote Professional Permits',
  description: 'Employer-sponsored work permits, EU Blue Card, Germany Chancenkarte, and Digital Nomad Visas',
  topics: [
    {
      id: 'germany-chancenkarte',
      category: 'WORK_VISAS',
      title: 'Germany Opportunity Card (Chancenkarte)',
      keywords: ['chancenkarte', 'germany opportunity card', 'germany job seeker', 'germany work visa', 'points for chancenkarte'],
      summary: 'Points-based visa allowing qualified non-EU candidates to enter Germany to look for work.',
      content: `The Opportunity Card (Chancenkarte) enables foreign professionals to enter Germany for up to 1 year to find qualified employment:

- **Eligibility Criteria**:
  - Requires a recognized vocational qualification or university degree.
  - Basic German language skills (A1) or English proficiency (B2).
  - Score at least 6 points on the points grid (evaluating age, qualification recognition, work experience, language skills, and previous stay in Germany).
- **Work Rights**: Allows part-time work (up to 20 hours/week) and trial work for up to two weeks while looking for full-time qualified jobs.
- **Conversion**: Once a qualifying contract is secured, converts directly into an EU Blue Card or skilled residence permit.`,
      primaryRoute: platformRoutes.countryDetail('DE').path,
      relatedRoutes: [
        { label: 'Check Points & Eligibility', path: platformRoutes.eligibility.path },
        { label: 'Explore Germany Guide', path: platformRoutes.countryDetail('DE').path },
      ],
      suggestedPrompts: ['How do I qualify for the Germany Opportunity Card?', 'What language level is needed for Chancenkarte?'],
    },
    {
      id: 'uk-skilled-worker',
      category: 'WORK_VISAS',
      title: 'UK Skilled Worker Visa & Points Threshold',
      keywords: ['uk skilled worker', 'uk work permit', 'certificate of sponsorship', 'cos', 'uk 70 points'],
      summary: 'UK employer-sponsored route requiring 70 points, an approved sponsor, and minimum salary.',
      content: `The UK Skilled Worker Visa allows individuals to work in the UK with an approved Home Office licensed employer:

- **Mandatory 50 Points**:
  - Valid Job Offer from an approved sponsor with a Certificate of Sponsorship (CoS) (20 points).
  - Job at an appropriate skill level (RQF level 3 or higher) (20 points).
  - English language proficiency at level B1 on CEFR scale (10 points).
- **Tradeable 20 Points**:
  - Salary meeting general minimum threshold and going rate for the occupation code, holding a relevant PhD, or STEM qualification.
- **Settlement**: Leads to Indefinite Leave to Remain (ILR) after 5 continuous years of lawful employment.`,
      primaryRoute: platformRoutes.countryDetail('GB').path,
      relatedRoutes: [
        { label: 'UK Visa Programs', path: platformRoutes.programs.path },
        { label: 'Book Legal Specialist', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['What is the minimum salary for a UK Skilled Worker Visa?', 'How many points do I need for a UK visa?'],
    },
    {
      id: 'digital-nomad-visas',
      category: 'WORK_VISAS',
      title: 'Global Digital Nomad & Remote Work Visas',
      keywords: ['digital nomad visa', 'portugal d8', 'spain nomad visa', 'remote work abroad', 'dubai green visa'],
      summary: 'Legal temporary residence for remote workers, freelancers, and online business owners.',
      content: `Digital Nomad Visas permit remote employees and entrepreneurs to reside abroad while earning foreign income:

- **Portugal D8 Digital Nomad Visa**: Requires proof of monthly remote income of at least 4x Portuguese minimum wage (~€3,280/month) + 1-year accommodation. Leads to PR/citizenship after 5 years.
- **Spain Digital Nomad Visa**: Requires monthly income of at least 200% of Spanish minimum wage (~€2,600/month) and work for non-Spanish clients/employers. 24% Beckham Law flat tax option.
- **Dubai Remote Work Visa**: 1-year renewable visa with minimum $3,500/month salary proof with 0% personal income tax.`,
      primaryRoute: platformRoutes.programs.path,
      relatedRoutes: [
        { label: 'Compare Nomad Countries', path: platformRoutes.compare.path },
        { label: 'Book Consultation', path: platformRoutes.consultation.path },
      ],
      suggestedPrompts: ['What are the requirements for Portugal D8 visa?', 'Which country has the best digital nomad visa?'],
    },
  ],
};

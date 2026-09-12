import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const consultationsCategory: KnowledgeCategory = {
  code: 'CONSULTATIONS',
  name: 'Consultations & Legal Advisory',
  description: '1-on-1 strategy sessions, RCIC consultants, immigration attorneys, and document audits',
  topics: [
    {
      id: 'consultation-booking',
      category: 'CONSULTATIONS',
      title: '1-on-1 Private Consultation with Licensed Immigration Specialists',
      keywords: ['book consultation', 'speak with lawyer', 'talk to advisor', 'rcic consultation', 'strategy session', 'legal advice'],
      summary: 'Private 45-minute video or phone sessions with certified immigration professionals.',
      content: `Our 1-on-1 strategy sessions provide personalized legal clarity before submitting an application:

- **Formats**: Encrypted HD Video Call (Zoom / Google Meet / In-Portal) or Direct Phone Consultation.
- **Duration**: 45 Minutes of focused legal consultation.
- **Inclusions**:
  1. Detailed profile evaluation & points optimization.
  2. Document pre-screening and potential risk identification.
  3. Tailored application timeline and cost breakdown.
  4. Written follow-up summary from your assigned RCIC consultant or immigration attorney.

**How to Book**: Visit **[Book a Consultation](${platformRoutes.consultation.path})**, choose your target country and preferred date/time slot, and confirm your appointment.`,
      primaryRoute: platformRoutes.consultation.path,
      relatedRoutes: [
        { label: 'Book Consultation Now', path: platformRoutes.consultation.path },
        { label: 'Manage Appointments', path: platformRoutes.appointments.path },
      ],
      suggestedPrompts: [
        'How do I book a consultation with an RCIC consultant?',
        'What should I prepare for my immigration consultation?',
        'Can I reschedule my appointment?',
      ],
    },
  ],
};

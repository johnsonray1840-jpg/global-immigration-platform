import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const applicationProcessCategory: KnowledgeCategory = {
  code: 'APPLICATION_PROCESS',
  name: 'Application Workflow & Case Lifecycle',
  description: 'Step-by-step case stages from onboarding to document audit, submission, biometrics, and decision',
  topics: [
    {
      id: 'case-lifecycle-stages',
      category: 'APPLICATION_PROCESS',
      title: 'End-to-End Application Lifecycle & Case Milestones',
      keywords: ['application process', 'how application works', 'case stages', 'track status', 'biometrics', 'processing timeline'],
      summary: '6-stage structured pathway from initial profile creation to government approval.',
      content: `Applications submitted through Global Citizens Solution follow a transparent 6-stage lifecycle:

1. **Stage 1: PROFILE_CREATED** - Initial account registration and intake questionnaire.
2. **Stage 2: DOCUMENTS_PENDING** - Uploading mandatory identity, academic, and financial documents to the Document Vault.
3. **Stage 3: DOCUMENTS_VERIFIED** - Automated AI OCR clarity check + formal review by our document specialists within 24–48h.
4. **Stage 4: UNDER_INTERNAL_REVIEW** - Senior legal counsel audits the entire dossier for statutory compliance.
5. **Stage 5: SUBMITTED_TO_GOVERNMENT** - Formal submission to immigration authorities (IRCC, UKVI, USCIS, etc.) and issuance of application tracking number.
6. **Stage 6: BIOMETRICS / DECISION & VISA_ISSUED** - Biometrics appointment booking, medicals verification, and final passport visa stamping.

Active clients can track milestones in real-time at **[Client Case Tracking](${platformRoutes.cases.path})**.`,
      primaryRoute: platformRoutes.cases.path,
      relatedRoutes: [
        { label: 'Client Case Tracking', path: platformRoutes.cases.path },
        { label: 'Document Center', path: platformRoutes.documents.path },
        { label: 'Client Workspace', path: platformRoutes.workspace.path },
      ],
      suggestedPrompts: [
        'How can I track my case status?',
        'What happens after my documents are verified?',
        'How long does government processing take?',
      ],
    },
  ],
};

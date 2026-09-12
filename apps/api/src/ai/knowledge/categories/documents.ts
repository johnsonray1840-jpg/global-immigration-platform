import { KnowledgeCategory } from '../types';
import { platformRoutes } from '../website-knowledge';

export const documentsCategory: KnowledgeCategory = {
  code: 'DOCUMENTS',
  name: 'Document Center & AI OCR Verification',
  description: 'Document requirements, certified translations, police clearances, proof of funds, and OCR checks',
  topics: [
    {
      id: 'document-vault-rules',
      category: 'DOCUMENTS',
      title: 'Document Center & AI OCR Scanning Specifications',
      keywords: ['upload documents', 'document requirements', 'ocr verification', 'file format', 'max file size', 'police clearance', 'proof of funds'],
      summary: 'Guidelines for uploading and verifying official immigration documents.',
      content: `Our platform features an encrypted Document Vault integrated with automated AI OCR scanning:

1. **Upload Specifications**:
   - **Supported Formats**: PDF, JPG, PNG, WebP.
   - **Maximum File Size**: Up to 25 MB per document.
   - **Scan Quality**: Color scans at minimum 300 DPI, with all 4 corners visible and no glare or shadows.
2. **Standard Document Categories**:
   - **Identity**: Passport biometric page (with at least 6 months remaining validity), National ID card, birth certificates.
   - **Financial Proofs**: 6-month official bank statements stamped by the bank, investment portfolio certificates, source of funds declarations.
   - **Police Clearance Certificates (PCC)**: Original certificates from every country lived in for 6+ months since turning 18.
   - **Academic Credentials**: Official transcripts, degree certificates, and Educational Credential Assessment (ECA) reports (WES, ICAS, etc.).
   - **Employment References**: Detailed signed letters on corporate letterhead stating job title, duties, dates, salary, and hours per week.
   - **Medical Examination (IME)**: Upfront medical exam performed by an IRCC/Panel Physician.
3. **Non-English/French Documents**:
   - Must be accompanied by a certified, notarized English or French translation with the translator's affidavit.`,
      primaryRoute: platformRoutes.documents.path,
      relatedRoutes: [
        { label: 'Go to Document Center', path: platformRoutes.documents.path },
        { label: 'Client Case Tracking', path: platformRoutes.cases.path },
      ],
      suggestedPrompts: [
        'How do I upload documents to my account?',
        'What should be included in an employment reference letter?',
        'How long is a police clearance certificate valid?',
      ],
    },
  ],
};

import { platformRoutes } from './website-knowledge';

export interface AuthenticatedClientContext {
  userId: string;
  userName: string;
  userEmail?: string;
  hasActiveCase: boolean;
  activeCases: Array<{
    id: string;
    destinationCountry: string;
    programName: string;
    status: string;
    statusLabel: string;
    consultantName?: string;
    verifiedDocs: string[];
    pendingDocs: string[];
    rejectedDocs: Array<{ name: string; reason?: string }>;
    nextMilestone?: string;
    updatedAt: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    type: string;
    scheduledAt: string;
    consultantName?: string;
    meetingLink?: string;
  }>;
  billingSummary?: {
    walletBalance: number;
    pendingInvoicesCount: number;
    totalPendingAmount: number;
  };
}

export const PERSONAL_CASE_QUERY_KEYWORDS = [
  'my application',
  'my case',
  'application status',
  'case status',
  'what is happening with my application',
  "what's happening with my application",
  'status of my visa',
  'my documents',
  'document status',
  'what documents are pending',
  'what documents do i need',
  'have you received my documents',
  'my appointment',
  'my consultation',
  'when is my meeting',
  'who is my consultant',
  'my assigned lawyer',
  'my payment',
  'my invoice',
  'my wallet balance',
  'track my file',
  'my progress',
];

/**
 * Checks if a user inquiry is asking about personal case records
 */
export function isPersonalCaseQuery(query: string): boolean {
  const q = query.toLowerCase();
  return PERSONAL_CASE_QUERY_KEYWORDS.some((kw) => q.includes(kw));
}

/**
 * Generates an unauthenticated sign-in prompt when a guest requests personal data
 */
export function generateGuestPersonalDataPrompt(): string {
  return `### 🔒 Client Authentication Required

To protect your privacy and security, **private application details, document review statuses, and consultation schedules** can only be accessed by authenticated account holders.

#### 👤 How to Access Your Case:
1. **[Sign In](${platformRoutes.login.path})** using your registered client credentials.
2. If you are already a client, open your **[Client Case Tracking](${platformRoutes.cases.path})** or **[Document Center](${platformRoutes.documents.path})**.
3. If you do not have an account yet, you can **[Create a Free Account](${platformRoutes.register.path})** to start a new application and unlock your encrypted document vault.

*Guest users can ask any general questions about immigration pathways, visa criteria, scholarships, or country comparisons.*

**Direct Links:**
- [Sign In to Your Account](${platformRoutes.login.path})
- [Create Free Account](${platformRoutes.register.path})
- [Run Free Eligibility Assessment](${platformRoutes.eligibility.path})`;
}

/**
 * Translates Prisma CaseStatus enum into a human-friendly label
 */
export function formatCaseStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PROFILE_CREATED: 'Profile Created (Intake Stage)',
    DOCUMENTS_PENDING: 'Document Collection & Upload',
    DOCUMENTS_VERIFIED: 'Documents Verified (AI OCR & Internal Check Passed)',
    UNDER_INTERNAL_REVIEW: 'Under Internal Review (Specialist Legal Audit)',
    SUBMITTED_TO_GOVERNMENT: 'Submitted to Government (Official Filing Active)',
    BIOMETRICS_SCHEDULED: 'Biometrics & Medicals Scheduled',
    AWAITING_DECISION: 'Awaiting Official Government Decision',
    APPROVED: 'Approved by Immigration Authorities',
    VISA_ISSUED: 'Visa / PR Documentation Issued',
    REJECTED: 'Decision Notice Issued (Requires Review / Appeal)',
    CLOSED: 'Case File Closed',
  };

  return map[status] || status.replace(/_/g, ' ');
}

/**
 * Formats a comprehensive, authorized personal status markdown card
 */
export function formatAuthenticatedCaseStatus(client: AuthenticatedClientContext, query: string): string {
  const q = query.toLowerCase();

  // If user has no active cases
  if (!client.hasActiveCase || client.activeCases.length === 0) {
    return `### Hello ${client.userName},

You are currently signed in as **${client.userName}** (${client.userEmail || 'Registered Client'}).

We currently do not have an active visa application file open for your account.

#### 🚀 How to Begin:
1. **[Run Eligibility Assessment](${platformRoutes.eligibility.path})**: Determine which country and pathway matches your qualifications.
2. **[Explore Visa Programs](${platformRoutes.programs.path})**: Select your preferred destination (Canada, UK, Australia, Germany, Caribbean CBI, etc.).
3. **[Book 1-on-1 Consultation](${platformRoutes.consultation.path})**: Discuss your roadmap directly with our licensed immigration specialists.

**Direct Links:**
- [Access Client Dashboard](${platformRoutes.dashboard.path})
- [Open Document Center](${platformRoutes.documents.path})
- [View Service Packages](${platformRoutes.packages.path})`;
  }

  // Formatting primary active case
  const primaryCase = client.activeCases[0];

  const receivedDocs =
    primaryCase.verifiedDocs.length > 0
      ? primaryCase.verifiedDocs.map((d) => `✅ **${d}** (Received & Verified)`).join('\n')
      : 'No verified documents on file yet.';

  const pendingDocs =
    primaryCase.pendingDocs.length > 0
      ? primaryCase.pendingDocs.map((d) => `⏳ **${d}** (Pending Upload / Missing)`).join('\n')
      : 'All checklist documents have been submitted.';

  const rejectedDocs =
    primaryCase.rejectedDocs.length > 0
      ? primaryCase.rejectedDocs
          .map((d) => `❌ **${d.name}** (Requires Re-upload${d.reason ? `: ${d.reason}` : ''})`)
          .join('\n')
      : '';

  // Appointment block
  const appointmentBlock =
    client.upcomingAppointments.length > 0
      ? `\n\n#### 📅 Upcoming Consultation:\n- **${client.upcomingAppointments[0].type}** on **${client.upcomingAppointments[0].scheduledAt}**${
          client.upcomingAppointments[0].consultantName ? ` with **${client.upcomingAppointments[0].consultantName}**` : ''
        }${client.upcomingAppointments[0].meetingLink ? ` | [Join Video Meeting](${client.upcomingAppointments[0].meetingLink})` : ''}`
      : '';

  return `### 📋 Case Status for ${client.userName}

**Application Program**: **${primaryCase.destinationCountry} — ${primaryCase.programName}**
- **Case Reference ID**: \`${primaryCase.id}\`
- **Current Status**: 📌 **${primaryCase.statusLabel}**
- **Assigned Case Specialist**: ${primaryCase.consultantName ? `**${primaryCase.consultantName}**` : 'Assigned Senior Review Team'}
- **Last Updated**: ${primaryCase.updatedAt}

---

#### 📁 Document Submission Breakdown:
${receivedDocs}

${pendingDocs}
${rejectedDocs ? `\n\n**Action Required on Rejected Files:**\n${rejectedDocs}` : ''}

${appointmentBlock}

---

### 🛠️ Quick Action Links:
- [Open Full Case Tracking Timeline](${platformRoutes.cases.path})
- [Upload Pending Files to Document Center](${platformRoutes.documents.path})
- [Message Your Assigned Case Officer](${platformRoutes.dashboard.path}/messages)
- [Manage Appointments](${platformRoutes.appointments.path})`;
}


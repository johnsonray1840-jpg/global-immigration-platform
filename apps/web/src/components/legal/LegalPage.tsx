'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { Loader2, ShieldCheck, FileText, Scale, Building2, CheckCircle2, AlertTriangle, HelpCircle, Lock, Globe2 } from 'lucide-react';

export default function LegalPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/${slug}`)
      .then((res) => {
        if (res.data && res.data.content && res.data.content.length > 50) {
          setPage(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B5D66]" />
      </div>
    );
  }

  const defaultContent: Record<string, any> = {
    terms: {
      title: 'Terms of Service',
      content: `
        <div class="space-y-10 text-slate-700 dark:text-slate-200">
          <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-200/70 dark:border-emerald-800/60">
            <p class="text-sm font-semibold uppercase tracking-wider text-[#0B5D66] dark:text-emerald-400 mb-1">Effective Date: January 1, 2026 | Last Updated: September 2026</p>
            <p class="text-base text-slate-800 dark:text-slate-200 font-medium">
              Welcome to <strong>Global Citizens Solution</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client", "User", "you") and Global Citizens Solution ("Company", "we", "us", "our") governing your access to and use of our website, client portal, consultation tools, and immigration services.
            </p>
          </div>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">1.</span> Acceptance and Scope of Agreement
            </h2>
            <p class="leading-relaxed mb-3">
              By accessing our website, creating a user account, submitting documentation, booking a consultation, or purchasing any service package, you explicitly accept and agree to comply with and be bound by these Terms of Service, along with our Privacy Policy, Cookie Policy, and Immigration Disclaimer.
            </p>
            <p class="leading-relaxed">
              If you do not agree with any provision of these Terms, you must immediately discontinue use of our website and services. If you are contracting on behalf of immediate family members or a corporate entity, you represent and warrant that you possess full legal authority to bind all such parties to these Terms.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">2.</span> Comprehensive Description of Services
            </h2>
            <p class="leading-relaxed mb-4">
              Global Citizens Solution operates as a premier international immigration, citizenship, and residency advisory firm. Our services include, without limitation:
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-900 dark:text-white mb-2">Immigration & Residence Solutions</h3>
                <ul class="text-sm space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li>Permanent Residence (Canada Express Entry, PNP, Australia PR, New Zealand SMC)</li>
                  <li>Skilled Worker Visas & Points Optimizations (UK Skilled Worker, Germany Chancenkarte / EU Blue Card)</li>
                  <li>Digital Nomad & Passive Income Visas (Portugal D8/D7, Spain Nomad, Dubai Remote Work)</li>
                  <li>Family Reunification, Spousal & Dependent Sponsorship Filings</li>
                  <li>Student Visa Admissions, University Placement & Global Scholarship Guidance</li>
                </ul>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-900 dark:text-white mb-2">Citizenship & Investment Advisory</h3>
                <ul class="text-sm space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li>Direct Citizenship by Investment (CBI) programs across the Caribbean (St. Kitts & Nevis, Grenada, Dominica, Antigua & Barbuda, Saint Lucia)</li>
                  <li>European Residency by Investment (Golden Visas in Greece, Spain, Malta PR/CBI)</li>
                  <li>EB-5 Immigrant Investor & EB-2 NIW (National Interest Waiver) petitions for the United States</li>
                  <li>Government Due Diligence Dossier compilation, escrow guidance, and document notarization</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">3.</span> Client Onboarding, Verification & Accuracy Obligations
            </h2>
            <p class="leading-relaxed mb-3">
              To utilize our filing and consultation platform, clients must create a verified account and provide accurate personal identification. You agree and warrant that:
            </p>
            <ul class="list-disc pl-6 space-y-2 leading-relaxed">
              <li>All information, financial statements, educational transcripts, employment records, and civil certificates provided by you are 100% authentic, accurate, current, and complete.</li>
              <li>You shall not misrepresent your identity, criminal history, medical status, prior visa refusals, or financial background to Global Citizens Solution or any government entity.</li>
              <li>You acknowledge that submitting fraudulent, forged, or altered documentation constitutes grounds for immediate termination of your service agreement with forfeiture of all fees, and may be reported to relevant regulatory and immigration authorities in accordance with applicable laws.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">4.</span> Professional Service Fees, Government Charges & Payments
            </h2>
            <p class="leading-relaxed mb-3">
              Engagements with Global Citizens Solution are governed by structured milestone schedules:
            </p>
            <ul class="list-disc pl-6 space-y-2 leading-relaxed">
              <li><strong>Professional Advisory Fees:</strong> Fees billed by Global Citizens Solution cover case strategy, eligibility scoring, document auditing, dossier assembly, submission management, and legal representation.</li>
              <li><strong>Statutory Government Fees:</strong> Filing fees, biometric fees, visa voucher fees, health surcharges (e.g. UK IHS), police clearances, and medical examination expenses are strictly the client's direct responsibility and are paid directly to government authorities or authorized collection accounts.</li>
              <li><strong>Payment Methods:</strong> We accept approved Credit/Debit Cards, Wire Transfers to designated corporate escrow accounts, and approved Cryptocurrency payments. All transactions are accompanied by official digital receipts and invoices in the client portal.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">5.</span> Refund and Cancellation Policy
            </h2>
            <p class="leading-relaxed mb-3">
              Because immigration preparation involves immediate intellectual property, legal drafting, and consultant labor allocation upon onboarding:
            </p>
            <ul class="list-disc pl-6 space-y-2 leading-relaxed">
              <li><strong>Initial Consultations:</strong> Consultations may be rescheduled or canceled with a full refund up to 24 hours prior to the scheduled appointment time. Cancellations with less than 24 hours notice or client no-shows are non-refundable.</li>
              <li><strong>Retained Filing Packages:</strong> If cancellation occurs prior to document verification stage, a pro-rata refund may be granted less a standard administrative onboarding fee. Once document verification or government petition compilation has commenced, professional fees are earned and non-refundable.</li>
              <li><strong>Government & Third-Party Fees:</strong> Government fees, translation costs, and apostille disbursements already paid to third parties or state agencies cannot be refunded under any circumstance.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">6.</span> Discretion of Immigration Authorities & No Guarantee Clause
            </h2>
            <div class="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
              <strong>Statutory Disclosure:</strong> Global Citizens Solution commits to providing the highest caliber of legal strategy, diligence, and accuracy in preparing your application. However, the final decision to grant or refuse any visa, permanent residency, work authorization, or citizenship certificate rests entirely and solely within the sovereign discretion of the respective immigration ministry, embassy, or government department. Global Citizens Solution cannot and does not guarantee a positive immigration outcome.
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">7.</span> Intellectual Property & Portal Security
            </h2>
            <p class="leading-relaxed">
              All proprietary algorithms, AI assistant systems, eligibility scoring tools, UI designs, graphics, course materials, checklists, and editorial content on Global Citizens Solution are protected by international copyright, trademark, and intellectual property laws. You may not copy, reverse-engineer, scrape, redistribute, or create derivative works from our platform without express written authorization.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">8.</span> Governing Law and Dispute Resolution
            </h2>
            <p class="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction specified in your individual Retainer Agreement, without regard to its conflict of law principles. Any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall first be submitted to good-faith mediation before pursuing formal arbitration.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">9.</span> Contact & Legal Notice
            </h2>
            <p class="leading-relaxed">
              For any legal notices, inquiries regarding these Terms of Service, or contractual clarifications, please reach our legal and compliance department at <strong>legal@globalcitizenssolution.com</strong>.
            </p>
          </section>
        </div>
      `,
    },
    privacy: {
      title: 'Privacy Policy',
      content: `
        <div class="space-y-10 text-slate-700 dark:text-slate-200">
          <div class="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200/70 dark:border-blue-800/60">
            <p class="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">GDPR, CCPA & Global Data Privacy Compliance</p>
            <p class="text-base text-slate-800 dark:text-slate-200 font-medium">
              At <strong>Global Citizens Solution</strong>, we maintain the highest standards of data protection, privacy, and confidentiality. This Privacy Policy details the categories of information we collect, how your data is encrypted and processed, and your statutory rights under international data protection regulations.
            </p>
          </div>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">1.</span> Information We Collect
            </h2>
            <p class="leading-relaxed mb-4">
              To deliver professional immigration, citizenship by investment, and visa services, we collect and process specific categories of data:
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-900 dark:text-white mb-2">Identification & Immigration Data</h3>
                <ul class="text-sm space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li>Full legal name, alias, date of birth, gender, and nationality</li>
                  <li>Passports, national ID cards, birth certificates, and marriage certificates</li>
                  <li>Educational degrees, credentials, and ECA assessment evaluations</li>
                  <li>Comprehensive employment history, CVs, and professional reference letters</li>
                  <li>Language test score reports (IELTS, CELPIP, PTE, TOEFL, TEF)</li>
                  <li>Police clearance certificates and international travel logs</li>
                </ul>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-900 dark:text-white mb-2">Financial & Technical Data</h3>
                <ul class="text-sm space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li>Proof of settlement funds, bank balance letters, and asset valuations</li>
                  <li>Source of wealth statements for CBI & Golden Visa compliance</li>
                  <li>Billing details, transaction logs, and payment receipts</li>
                  <li>IP address, browser user-agent, session logs, and device metadata</li>
                  <li>AI Assistant conversation transcripts and support inquiries</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">2.</span> Lawful Bases and Purposes of Data Processing
            </h2>
            <p class="leading-relaxed mb-3">
              We process your personal data under the following lawful bases pursuant to GDPR Article 6 and international privacy laws:
            </p>
            <ul class="list-disc pl-6 space-y-2 leading-relaxed">
              <li><strong>Performance of Contract:</strong> To assess your visa eligibility, compile official government petition dossiers, submit immigration filings, and communicate application status updates.</li>
              <li><strong>Legal & Regulatory Compliance:</strong> To satisfy statutory Anti-Money Laundering (AML), Know Your Customer (KYC), and international sanctions screening mandates.</li>
              <li><strong>Legitimate Interests:</strong> To protect platform integrity, prevent cyber threats, enhance AI response accuracy, and optimize user experience.</li>
              <li><strong>Explicit Consent:</strong> Where you provide consent for marketing updates, newsletters, or third-party scholarship notifications (which you may withdraw at any time).</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">3.</span> Enterprise Security & Encryption Architecture
            </h2>
            <div class="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 border border-blue-200 dark:border-blue-800">
              <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <Lock class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Data Protection Safeguards
              </h3>
              <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• <strong>AES-256 Encryption:</strong> All client passports, financial docs, and case files are encrypted at rest using industry-standard AES-256 algorithms.</li>
                <li>• <strong>TLS 1.3 Transport Security:</strong> All data transmitted between your browser and our servers utilizes end-to-end TLS 1.3 encryption.</li>
                <li>• <strong>Role-Based Access Control (RBAC):</strong> Access to client data is strictly restricted to assigned legal case officers, licensed RCIC advisors, and compliance managers.</li>
                <li>• <strong>Immutable Audit Trails:</strong> Every file view, download, status change, and approval action is logged with timestamp, user ID, and IP address.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">4.</span> Third-Party Data Disclosures
            </h2>
            <p class="leading-relaxed mb-3">
              We never sell, rent, or trade your personal data to third parties. Disclosures are made exclusively to:
            </p>
            <ul class="list-disc pl-6 space-y-2 leading-relaxed">
              <li><strong>Government Immigration Authorities:</strong> IRCC (Canada), USCIS / Department of State (USA), UK Visas and Immigration (UK), BAMF (Germany), Caribbean CBI Units, and designated diplomatic missions as necessary to execute your application.</li>
              <li><strong>Licensed Legal Partners:</strong> Retained immigration attorneys, translators, and credential evaluation bodies (e.g. WES, ICAS, IQAS) bound by non-disclosure agreements.</li>
              <li><strong>Authorized Financial Processors:</strong> PCI-DSS compliant payment gateways and banking partners for transaction settlement.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">5.</span> Data Retention and Statutory Limits
            </h2>
            <p class="leading-relaxed">
              We retain active case files for the duration of the client engagement. Following case completion or termination, files are archived securely for a statutory period of <strong>7 years</strong> to comply with international immigration regulatory, audit, and tax requirements, after which records are permanently purged using secure cryptographic deletion.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">6.</span> Your Data Subject Rights
            </h2>
            <p class="leading-relaxed mb-3">
              Regardless of your citizenship or location, Global Citizens Solution extends the following rights:
            </p>
            <ul class="list-disc pl-6 space-y-1.5 leading-relaxed text-sm">
              <li><strong>Right to Access:</strong> Request a comprehensive copy of all personal records we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request prompt correction of inaccurate or incomplete information.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your data, subject to mandatory statutory retention rules.</li>
              <li><strong>Right to Data Portability:</strong> Obtain your digital case data in a structured, machine-readable format.</li>
              <li><strong>Right to Object & Restrict:</strong> Restrict or object to non-essential processing activities.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-blue-600 dark:text-blue-400">7.</span> Data Protection Officer (DPO) Contact
            </h2>
            <p class="leading-relaxed">
              To exercise your privacy rights or submit inquiries regarding our data handling protocols, contact our Data Protection Officer directly at <strong>privacy@globalcitizenssolution.com</strong>.
            </p>
          </section>
        </div>
      `,
    },
    disclaimer: {
      title: 'Immigration Disclaimer',
      content: `
        <div class="space-y-10 text-slate-700 dark:text-slate-200">
          <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-slate-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 border border-amber-200/70 dark:border-amber-800/60">
            <p class="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">Legal Notice & Statutory Regulatory Disclosures</p>
            <p class="text-base text-slate-800 dark:text-slate-200 font-medium">
              Please read this Immigration Disclaimer carefully. The information, eligibility tools, and AI navigation provided by <strong>Global Citizens Solution</strong> are intended for informational, strategic, and advisory purposes.
            </p>
          </div>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-amber-600 dark:text-amber-400">1.</span> Independent Advisory Entity & Non-Governmental Status
            </h2>
            <p class="leading-relaxed mb-3">
              <strong>Global Citizens Solution is a private immigration consultancy and global citizenship advisory firm.</strong> We are not a government agency, embassy, consulate, or official visa issuing authority. We do not represent ourselves as affiliated with Immigration, Refugees and Citizenship Canada (IRCC), the United States Department of Homeland Security (DHS/USCIS), the United Kingdom Home Office, or any other sovereign government department.
            </p>
            <p class="leading-relaxed">
              Our role is strictly that of an authorized representative, consultant, and advisory intermediary assisting clients in navigating complex immigration laws and assembling compliant documentation.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-amber-600 dark:text-amber-400">2.</span> Sovereign Discretion & No Outcome Guarantee
            </h2>
            <div class="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-sm leading-relaxed space-y-2">
              <p><strong>CRITICAL STATUTORY NOTICE:</strong> Under international immigration laws, the authority to approve, refuse, delay, or revoke any visa, permanent residence permit, work authorization, study permit, or citizenship certificate resides <strong>exclusively with the designated government immigration officer, embassy visa consul, or statutory citizenship unit</strong>.</p>
              <p>While Global Citizens Solution maintains rigorous standards of quality control and legal precision to maximize your chances of approval, <strong>no immigration consultant, attorney, or advisor can guarantee a visa or citizenship approval</strong>. Any representations of "guaranteed visas" are strictly disclaimed and prohibited by our ethical codes.</p>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-amber-600 dark:text-amber-400">3.</span> Advisory Nature of AI Calculations & Scoring Tools
            </h2>
            <p class="leading-relaxed">
              The automated points assessments (such as Canada CRS estimators, Germany Chancenkarte calculators, and UK Points tests) and AI assistant replies provided on this website are algorithmic estimates based on data inputted by the user. They do not constitute a formal legal opinion or binding determination of eligibility. Official points calculation is performed exclusively by visa officers during file examination.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-amber-600 dark:text-amber-400">4.</span> Policy Changes, Backlogs & Dynamic Timelines
            </h2>
            <p class="leading-relaxed">
              Immigration laws, qualifying occupation lists, financial proof thresholds, and quota caps are subject to sudden change by national governments without prior notice. Processing times displayed on our website are estimated averages derived from public government metrics. Global Citizens Solution assumes no liability for delays resulting from government strikes, consular backlogs, geopolitical events, policy shifts, or unexpected administrative reviews.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-amber-600 dark:text-amber-400">5.</span> Client Liability for Document Authenticity
            </h2>
            <p class="leading-relaxed">
              Clients are exclusively responsible for the validity, truthfulness, and authenticity of all supporting materials submitted. Submitting fraudulent credentials, fake work certificates, or fabricated bank statements to immigration authorities constitutes a serious criminal offense in most jurisdictions, resulting in bans of 5 to 10 years. Global Citizens Solution strictly disclaims all liability for consequences arising from falsified client submissions.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-amber-600 dark:text-amber-400">6.</span> Inquiries Regarding Disclaimers
            </h2>
            <p class="leading-relaxed">
              For questions regarding regulatory compliance or this Immigration Disclaimer, please contact our legal counsel at <strong>legal@globalcitizenssolution.com</strong>.
            </p>
          </section>
        </div>
      `,
    },
    cookies: {
      title: 'Cookie Policy',
      content: `
        <div class="space-y-10 text-slate-700 dark:text-slate-200">
          <div class="p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50 to-slate-50 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-slate-900 border border-teal-200/70 dark:border-teal-800/60">
            <p class="text-sm font-semibold uppercase tracking-wider text-[#0B5D66] dark:text-teal-400 mb-1">Transparency in Tracking & Cookies</p>
            <p class="text-base text-slate-800 dark:text-slate-200 font-medium">
              This Cookie Policy explains how <strong>Global Citizens Solution</strong> uses cookies, web beacons, and similar tracking technologies to ensure seamless navigation, preserve session security, and analyze platform performance.
            </p>
          </div>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">1.</span> What Are Cookies and Why Do We Use Them?
            </h2>
            <p class="leading-relaxed mb-3">
              Cookies are compact text files stored on your computer, tablet, or smartphone when you visit web applications. They allow our systems to recognize your browser, remember your preferences (such as selected language, currency, and dark mode theme), keep you securely logged into your client portal, and ensure responsive page loads.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">2.</span> Classification of Cookies We Deploy
            </h2>
            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white">1. Strictly Necessary Cookies (Essential)</h3>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">Always Active</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Essential for authenticating users, maintaining encrypted sessions, CSRF token security, and safeguarding confidential document uploads. The website cannot function safely without these cookies.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white">2. Functional & Preference Cookies</h3>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-medium">Configurable</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Remember your selected interface language, font scaling, dark/light theme, and AI chat state across visits to provide a cohesive experience.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white">3. Analytics & Performance Cookies</h3>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-medium">Configurable</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Collect anonymous, aggregated metrics on page response times, navigation flows, and server latency to help us identify and resolve platform bottlenecks.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white">4. Marketing & Communication Cookies</h3>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">Optional</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Help measure the efficacy of educational campaigns and scholarship announcements. Deployed only upon receiving explicit visitor consent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">3.</span> Managing & Disabling Cookies in Your Browser
            </h2>
            <p class="leading-relaxed mb-3">
              You can control, block, or delete cookies at any time through your browser settings. Follow the official guides for your respective browser:
            </p>
            <ul class="list-disc pl-6 space-y-1.5 leading-relaxed text-sm">
              <li><strong>Google Chrome:</strong> Settings → Privacy & Security → Cookies and other site data.</li>
              <li><strong>Apple Safari:</strong> Preferences → Privacy → Manage Website Data.</li>
              <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Enhanced Tracking Protection.</li>
              <li><strong>Microsoft Edge:</strong> Settings → Site Permissions → Cookies and site data.</li>
            </ul>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
              *Note: Disabling Strictly Necessary cookies will prevent logging in to the client dashboard and uploading case documents.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-[#0B5D66] dark:text-[#C9A96E]">4.</span> Contact Regarding Cookie Practices
            </h2>
            <p class="leading-relaxed">
              If you have any questions about our use of cookies and tracking technologies, please contact our compliance team at <strong>privacy@globalcitizenssolution.com</strong>.
            </p>
          </section>
        </div>
      `,
    },
  };

  const displayPage = page || defaultContent[slug] || { title: slug.replace(/-/g, ' ').toUpperCase(), content: '<p>Content currently undergoing scheduled review.</p>' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {slug === 'terms' && <FileText className="h-8 w-8 text-[#0B5D66] dark:text-[#C9A96E]" />}
          {slug === 'privacy' && <ShieldCheck className="h-8 w-8 text-[#0B5D66] dark:text-[#C9A96E]" />}
          {slug === 'disclaimer' && <Scale className="h-8 w-8 text-[#0B5D66] dark:text-[#C9A96E]" />}
          {slug === 'cookies' && <Building2 className="h-8 w-8 text-[#0B5D66] dark:text-[#C9A96E]" />}
          <SectionHeading title={displayPage.title} />
        </div>
      </div>
      
      <div 
        className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: displayPage.content }}
      />
    </div>
  );
}

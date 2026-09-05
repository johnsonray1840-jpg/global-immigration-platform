'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { Loader2, ShieldCheck, FileText, Scale, Building2, CheckCircle2 } from 'lucide-react';

export default function LegalPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/${slug}`)
      .then((res) => {
        setPage(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-ash-dark" />
      </div>
    );
  }

  // Default content for legal pages if not found in database
  const defaultContent: Record<string, any> = {
    terms: {
      title: 'Terms of Service',
      content: `
        <div class="space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              By accessing and using Global Immigration Services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Global Immigration Services provides comprehensive immigration consultancy services including but not limited to:
            </p>
            <ul class="list-disc pl-6 mt-3 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Visa application assistance and guidance</li>
              <li>Permanent residence application support</li>
              <li>Citizenship by investment programs</li>
              <li>Family sponsorship applications</li>
              <li>Work permit and skilled worker visa processing</li>
              <li>Student visa consultations</li>
              <li>Business and investor immigration services</li>
              <li>Document verification and authentication</li>
              <li>Legal representation and consultation</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">3. How We Operate</h2>
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <h3 class="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-3">Our Process</h3>
              <ol class="space-y-4 text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Initial Consultation:</strong> We assess your eligibility and recommend the best immigration pathway based on your profile, goals, and circumstances.</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Document Collection:</strong> Our team guides you through gathering all required documents, ensuring completeness and accuracy.</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Document Verification:</strong> All submitted documents undergo rigorous verification by our compliance team before submission to authorities.</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Application Submission:</strong> We prepare and submit your application to the relevant government authorities with precision and care.</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Ongoing Support:</strong> Throughout the process, we provide regular updates and address any queries or additional requirements.</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Final Decision:</strong> Upon approval, we assist with visa issuance, travel arrangements, and settlement services.</span>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Users are responsible for providing accurate, complete, and truthful information. Any false or misleading 
              information may result in application rejection and termination of services without refund.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">5. Fees and Payment</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              All fees are clearly disclosed before engagement. Service fees cover our professional consultation, 
              document preparation, and case management. Government fees, medical examinations, and third-party 
              costs are separate and payable by the client.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">6. Refund Policy</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Refunds are considered on a case-by-case basis according to the stage of processing and services rendered. 
              Government fees are non-refundable once submitted. Please refer to our specific service agreement for detailed refund terms.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              While we strive for 100% success, immigration decisions are ultimately at the discretion of government 
              authorities. We cannot guarantee approval but commit to providing the highest quality service and 
              representation throughout your immigration journey.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              For questions regarding these Terms of Service, please contact us at legal@globalimmigrationservices.com 
              or visit our offices listed on the website.
            </p>
          </section>
        </div>
      `,
    },
    privacy: {
      title: 'Privacy Policy',
      content: `
        <div class="space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Global Immigration Services is committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our services.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div class="grid md:grid-cols-2 gap-4 mt-4">
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Personal Information</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Full name and date of birth</li>
                  <li>• Passport and identity documents</li>
                  <li>• Contact information (email, phone)</li>
                  <li>• Address and nationality</li>
                  <li>• Employment and education history</li>
                  <li>• Financial information</li>
                  <li>• Family information</li>
                  <li>• Travel history</li>
                </ul>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Technical Information</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Login credentials (encrypted)</li>
                  <li>• Communication preferences</li>
                  <li>• Transaction history</li>
                  <li>• Cookies and usage data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>To process and manage your immigration applications</li>
              <li>To verify your identity and conduct background checks</li>
              <li>To communicate with you about your case progress</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>To improve our services and user experience</li>
              <li>To send important updates and notifications</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Government Authorities:</strong> As required for visa and immigration applications</li>
              <li><strong>Service Providers:</strong> Trusted partners who assist in delivering our services (under strict confidentiality)</li>
              <li><strong>Legal Advisors:</strong> When necessary for legal representation</li>
              <li><strong>Law Enforcement:</strong> When required by law or to protect safety</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">5. Data Security</h2>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <ShieldCheck class="h-5 w-5" />
                Security Measures
              </h3>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• End-to-end encryption for all sensitive data</li>
                <li>• Secure servers with regular security audits</li>
                <li>• Two-factor authentication for account access</li>
                <li>• Restricted employee access to personal information</li>
                <li>• Regular security training for staff</li>
                <li>• Compliance with GDPR and international data protection standards</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Access your personal information held by us</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Object to processing of your personal information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              As an international immigration service, your data may be transferred to and processed in countries 
              other than your own. We ensure appropriate safeguards are in place, including standard contractual 
              clauses and adherence to international data protection frameworks.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined 
              in this policy, or as required by law. Typically, this means retaining data for 7 years after case 
              completion for compliance purposes.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our services are not directed to children under 18. We do not knowingly collect personal information 
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy periodically. Any changes will be posted on this page with an 
              updated effective date. Continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              For privacy-related questions or requests, contact our Data Protection Officer at 
              privacy@globalimmigrationservices.com or write to us at our registered office address.
            </p>
          </section>
        </div>
      `,
    },
    disclaimer: {
      title: 'Disclaimer',
      content: `
        <div class="space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4">1. General Disclaimer</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              The information provided by Global Immigration Services ("we," "us," or "our") on this website and 
              through our services is for general informational and educational purposes only. All information is 
              provided in good faith, however, we make no representation or warranty of any kind, express or implied, 
              regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">2. No Guarantee of Approval</h2>
            <div class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <p class="text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Important Notice:</strong> Global Immigration Services cannot and does not guarantee approval 
                of any visa, permanent residence, citizenship, or immigration application. All immigration decisions 
                are made solely by the relevant government authorities. Past success rates do not guarantee future 
                outcomes. Each case is evaluated individually by government officials based on their specific criteria 
                and discretion.
              </p>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">3. Professional Advice Disclaimer</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              The content provided through our services does not constitute legal, financial, or tax advice. You 
              should consult with qualified professionals in your jurisdiction before making any decisions based on 
              the information provided. Immigration laws and regulations change frequently and may vary by jurisdiction.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">4. Third-Party Links</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our website may contain links to third-party websites or services that are not owned or controlled by 
              Global Immigration Services. We have no control over, and assume no responsibility for, the content, 
              privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">5. Currency and Fee Accuracy</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              All fees, government charges, and currency conversions displayed on our website are estimates and may 
              change without notice. Actual costs may vary based on exchange rates, government fee updates, and 
              individual case circumstances. Final fees will be confirmed in your service agreement.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">6. Processing Times</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Any processing times mentioned are estimates based on current government published timelines and historical 
              data. Actual processing times may vary significantly due to factors beyond our control, including but not 
              limited to government backlogs, policy changes, incomplete applications, and individual case complexity.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">7. Eligibility Assessments</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our eligibility assessments and predictions are based on the information you provide and our understanding 
              of current immigration rules. They do not constitute a guarantee of eligibility or approval. Final 
              eligibility determinations are made exclusively by government authorities.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">8. Document Authenticity</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Clients are solely responsible for the authenticity and accuracy of documents submitted. Global Immigration 
              Services conducts verification checks but does not assume liability for fraudulent or inaccurate documents 
              provided by clients or third parties.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">9. Force Majeure</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              We shall not be liable for any delays or failures in performance resulting from acts beyond our reasonable 
              control, including but not limited to: natural disasters, pandemics, war, terrorism, civil unrest, 
              government actions, strikes, or technical failures.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">10. Contact for Disclaimers</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have any questions about this Disclaimer, please contact us at legal@globalimmigrationservices.com.
            </p>
          </section>
        </div>
      `,
    },
    cookies: {
      title: 'Cookie Policy',
      content: `
        <div class="space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you 
              visit our website. They help us provide you with a better experience by remembering your preferences 
              and understanding how you use our site.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            <div class="grid md:grid-cols-2 gap-4 mt-4">
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Essential Cookies</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Required for basic website functionality, such as secure login, session management, and form submissions.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Performance Cookies</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Help us understand how visitors interact with our website by collecting anonymous usage statistics.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Functionality Cookies</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Remember your preferences and settings, such as language selection and theme preferences.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Marketing Cookies</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Used to deliver relevant advertisements and track campaign effectiveness (with your consent).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">3. How We Use Cookies</h2>
            <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>To maintain your session while logged in</li>
              <li>To remember your language and accessibility preferences</li>
              <li>To analyze website traffic and improve user experience</li>
              <li>To personalize content and recommendations</li>
              <li>To enable secure payment processing</li>
              <li>To prevent fraud and enhance security</li>
              <li>To measure advertising effectiveness</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may use trusted third-party services that set cookies on your device, including:
            </p>
            <ul class="list-disc pl-6 mt-3 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Payment processors (e.g., Stripe, PayPal)</li>
              <li>Customer support chat services</li>
              <li>Social media platforms (for sharing functionality)</li>
              <li>Advertising partners</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">5. Managing Your Cookie Preferences</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies, or delete cookies already stored on your device</li>
              <li><strong>Cookie Consent Tool:</strong> Use our cookie preference center to customize your choices</li>
              <li><strong>Incognito/Private Mode:</strong> Browse without storing cookies (though some features may not work)</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">6. Impact of Disabling Cookies</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Please note that disabling certain cookies may affect the functionality of our website and limit your 
              ability to use certain features, such as logging in, saving preferences, or completing transactions.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or 
              our business operations. Any updates will be posted on this page.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              For questions about our use of cookies, please contact us at privacy@globalimmigrationservices.com.
            </p>
          </section>
        </div>
      `,
    },
  };

  // Use default content if page not found
  const displayPage = page || defaultContent[slug] || { title: slug.replace(/-/g, ' ').toUpperCase(), content: 'Content not available.' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {slug === 'terms' && <FileText className="h-8 w-8 text-[#0B5D66]" />}
          {slug === 'privacy' && <ShieldCheck className="h-8 w-8 text-[#0B5D66]" />}
          {slug === 'disclaimer' && <Scale className="h-8 w-8 text-[#0B5D66]" />}
          {slug === 'cookies' && <Building2 className="h-8 w-8 text-[#0B5D66]" />}
          <SectionHeading title={displayPage.title} />
        </div>
      </div>
      
      <div 
        className="prose prose-lg max-w-none text-charcoal dark:text-white"
        dangerouslySetInnerHTML={{ __html: displayPage.content }}
      />
    </div>
  );
}

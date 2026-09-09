'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  GraduationCap,
  Banknote,
  CalendarDays,
  Globe2,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ExternalLink,
  Award,
  Building2,
  BookOpen,
  Send,
  HelpCircle,
} from 'lucide-react';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/scholarships/${id}`)
        .then((res) => {
          setScholarship(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load scholarship');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 bg-[#F8FAFA] min-h-screen">
        <div className="container-premium max-w-4xl space-y-6">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="py-24 text-center bg-[#F8FAFA] min-h-screen flex flex-col items-center justify-center">
        <GraduationCap className="h-16 w-16 text-gray-300 mx-auto" />
        <p className="mt-4 text-xl font-display font-semibold text-gray-700">Scholarship not found</p>
        <p className="mt-1 text-sm text-gray-500">The scholarship you are looking for may have expired or been updated.</p>
        <Link href="/scholarships" className="mt-6">
          <Button variant="outline" className="border-[#0B5D66] text-[#0B5D66]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse All Scholarships
          </Button>
        </Link>
      </div>
    );
  }

  const eligibility = scholarship.eligibilityJson || {};

  return (
    <div className="bg-[#F8FAFA] min-h-screen pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.25),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <GraduationCap className="h-4 w-4 text-[#C9A96E]" />
            {eligibility.coverageType || 'Global Fellowship'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            {scholarship.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            {scholarship.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {scholarship.country && (
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white font-medium">
                <Globe2 className="mr-1 h-3.5 w-3.5 text-[#C9A96E]" /> {scholarship.country.name}
              </Badge>
            )}
            {scholarship.university && (
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white font-medium">
                <Building2 className="mr-1 h-3.5 w-3.5 text-[#C9A96E]" /> {scholarship.university.name}
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-premium max-w-5xl -mt-8 relative z-20">
        <Link href="/scholarships">
          <Button variant="ghost" className="mb-4 text-gray-600 hover:text-[#0B5D66]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scholarships
          </Button>
        </Link>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D66]/10 mx-auto">
              <Banknote className="h-6 w-6 text-[#0B5D66]" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Estimated Value</p>
            <p className="mt-1 font-display text-3xl font-bold text-[#111827]">
              ${scholarship.fundingAmount ? scholarship.fundingAmount.toLocaleString() : 'Full Value'}
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-medium">{eligibility.coverageType || 'Fully Funded'}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96E]/20 mx-auto">
              <CalendarDays className="h-6 w-6 text-[#C9A96E]" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Application Deadline</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#111827]">
              {scholarship.deadline
                ? new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Open Rolling'}
            </p>
            <p className="mt-1 text-xs text-gray-500 font-medium">Ongoing Academic Intake</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D66]/10 mx-auto">
              <Award className="h-6 w-6 text-[#0B5D66]" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Degree Levels</p>
            <p className="mt-1 font-display text-lg font-bold text-[#111827]">
              {eligibility.degreeLevel ? eligibility.degreeLevel.join(', ') : "Master's & PhD"}
            </p>
            <p className="mt-1 text-xs text-gray-500 font-medium">{eligibility.fieldsOfStudy || 'All Academic Fields'}</p>
          </div>
        </div>

        {/* Breakdown Sections */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2 Cols: Details, Benefits, Requirements */}
          <div className="space-y-8 lg:col-span-2">
            {/* Covered Benefits */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-[#111827] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0B5D66]" />
                Scholarship Benefits & Coverage
              </h3>
              <div className="mt-6 space-y-3">
                {(eligibility.benefits || [
                  '100% Full Tuition Fee Exemption',
                  'Monthly Living Stipend and Housing Allowance',
                  'Round-trip International Economy Flight Tickets',
                  'Comprehensive Medical and Accident Insurance',
                  'Orientation, Visa Support, and Research Grant',
                ]).map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm font-medium text-gray-700 leading-snug">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility & Qualifications */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-[#111827] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0B5D66]" />
                Eligibility Criteria
              </h3>
              <div className="mt-6 space-y-4">
                {eligibility.academicRequirement && (
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Academic Background</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">{eligibility.academicRequirement}</p>
                  </div>
                )}
                {eligibility.languageTest && (
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Language Requirement</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">{eligibility.languageTest}</p>
                  </div>
                )}
                {eligibility.workExperience && (
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Work Experience</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">{eligibility.workExperience}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Eligible Fields</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">{eligibility.fieldsOfStudy || 'All Accredited Academic Fields'}</p>
                </div>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-[#111827] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0B5D66]" />
                Required Application Documents
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(eligibility.requiredDocuments || [
                  'Valid International Passport',
                  'Academic Transcripts & Certificates',
                  'Statement of Purpose / Essay',
                  '2-3 Letters of Recommendation',
                  'Updated Curriculum Vitae (CV)',
                  'Language Test Score Report',
                ]).map((doc: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-xs">
                    <FileText className="h-4 w-4 text-[#0B5D66] shrink-0" />
                    <span className="text-xs font-medium text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Host University & Action Sidebar */}
          <div className="space-y-6">
            {/* University Profile Card */}
            {scholarship.university && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-lg font-bold text-[#111827] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#0B5D66]" />
                  Host Institution
                </h4>
                <p className="mt-3 font-semibold text-gray-800">{scholarship.university.name}</p>
                {scholarship.country && (
                  <p className="text-xs text-gray-500 mt-0.5">Location: {scholarship.country.name}</p>
                )}
                {scholarship.university.ranking && (
                  <p className="mt-2 text-xs font-medium text-[#0B5D66]">
                    Global Rank: Top #{scholarship.university.ranking}
                  </p>
                )}
                {scholarship.university.tuitionRange && (
                  <p className="mt-1 text-xs text-gray-600">
                    Tuition: {scholarship.university.tuitionRange}
                  </p>
                )}
                {scholarship.university.website && (
                  <a
                    href={scholarship.university.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center text-xs font-medium text-[#0B5D66] hover:underline"
                  >
                    Visit University Portal <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Application CTAs */}
            <div className="rounded-2xl bg-gradient-to-b from-[#0B5D66] to-[#0A4E56] p-6 text-white shadow-lg space-y-4">
              <h4 className="font-display text-xl font-bold">Ready to Apply?</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Apply directly through the official scholarship portal or get professional support with admissions and student visas.
              </p>

              {scholarship.link && (
                <a href={scholarship.link} target="_blank" rel="noreferrer" className="block">
                  <Button className="w-full bg-[#C9A96E] hover:bg-[#B8985D] text-white font-semibold shadow-md">
                    <ExternalLink className="mr-2 h-4 w-4" /> Official Application
                  </Button>
                </a>
              )}

              <Link href="/consultation" className="block">
                <Button variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                  <Send className="mr-2 h-4 w-4" /> Get Advisor Assistance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
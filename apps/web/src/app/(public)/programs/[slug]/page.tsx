import { notFound } from 'next/navigation';
import { programs as staticPrograms } from '@/data/programs';
import { SectionHeading } from '@/components/shared/section-heading';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2, XCircle, FileText, BadgeDollarSign, AlertTriangle,
  PercentCircle, ArrowRight, Clock, ShieldCheck, ChevronDown,
} from 'lucide-react';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const revalidate = 3600;

async function getProgram(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/programs/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      slug: data.slug,
      title: data.title,
      category: data.category,
      description: data.description,
      eligibility: Array.isArray(data.eligibility) ? data.eligibility : JSON.parse(data.eligibility || '[]'),
      requirements: Array.isArray(data.requirements) ? data.requirements : JSON.parse(data.requirements || '[]'),
      documents: Array.isArray(data.documents) ? data.documents : JSON.parse(data.documents || '[]'),
      governmentFees: data.governmentFees,
      serviceFees: data.serviceFees,
      processingTime: data.processingTime,
      validity: data.validity,
      renewal: data.renewal,
      commonMistakes: Array.isArray(data.commonMistakes) ? data.commonMistakes : JSON.parse(data.commonMistakes || '[]'),
      approvalRate: data.approvalRate,
      faqs: Array.isArray(data.faqs) ? data.faqs : JSON.parse(data.faqs || '[]'),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = staticPrograms.find((p) => p.slug === slug);
  return {
    title: program ? program.title : 'Program',
    description: program ? program.description : 'Immigration program details',
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let program = await getProgram(slug);
  if (!program) {
    program = staticPrograms.find((p) => p.slug === slug) || null;
  }
  if (!program) notFound();

  return (
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <BadgeDollarSign className="h-4 w-4 text-[#C9A96E]" />
            {program.category}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {program.title}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/80">{program.description}</p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Who Qualifies */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
              <CheckCircle2 className="h-6 w-6 text-[#0B5D66]" /> Who Qualifies
            </h2>
            <ul className="mt-4 space-y-2">
              {program.eligibility.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0B5D66]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
              <FileText className="h-6 w-6 text-[#0B5D66]" /> Requirements
            </h2>
            <ul className="mt-4 space-y-2">
              {program.requirements.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A96E]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-[#111827]">Required Documents</h2>
            <ul className="mt-4 space-y-2">
              {program.documents.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0B5D66]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Fees & Processing */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-[#111827]">Fees & Processing</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-[#111827]">Government Fees:</span> {program.governmentFees}</p>
              <p><span className="font-medium text-[#111827]">Service Fees:</span> {program.serviceFees}</p>
              <p><span className="font-medium text-[#111827]">Processing Time:</span> {program.processingTime}</p>
              <p><span className="font-medium text-[#111827]">Validity:</span> {program.validity}</p>
              <p><span className="font-medium text-[#111827]">Renewal:</span> {program.renewal}</p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
              <AlertTriangle className="h-6 w-6 text-[#C9A96E]" /> Common Mistakes
            </h2>
            <ul className="mt-4 space-y-2">
              {program.commonMistakes.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Approval Rate */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
              <PercentCircle className="h-6 w-6 text-[#0B5D66]" /> Approval Rate
            </h2>
            <p className="mt-4 text-3xl font-semibold text-[#111827]">{program.approvalRate}</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-center font-display text-3xl font-semibold text-[#111827]">Frequently Asked Questions</h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {program.faqs.map((faq: any, i: number) => (
                <AccordionItem key={i} value={`faq-${i}`} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md data-[state=open]:border-[#C9A96E]/50">
                  <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-data-[state=open]:bg-[#C9A96E]" />
                  <div className="pl-1">
                    <AccordionTrigger className="flex items-center justify-between py-4 pr-4 text-left">
                      <div className="flex items-start gap-3">
                        <span className="font-display text-base font-semibold text-[#111827]">{faq.q}</span>
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="pl-12 pr-4 pb-5">
                    <div className="rounded-lg bg-[#F8FAFA] p-4 text-sm text-gray-600">{faq.a}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/eligibility">
            <Button className="bg-[#0B5D66] px-8 py-3 text-white hover:bg-[#0A4E56]">
              Check Your Eligibility <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
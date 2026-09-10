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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            <BadgeDollarSign className="h-4 w-4 text-accent" />
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
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <CheckCircle2 className="h-6 w-6 text-primary" /> Who Qualifies
            </h2>
            <ul className="mt-4 space-y-2.5">
              {program.eligibility.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <FileText className="h-6 w-6 text-primary" /> Requirements
            </h2>
            <ul className="mt-4 space-y-2.5">
              {program.requirements.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <ShieldCheck className="h-6 w-6 text-primary" /> Required Documents
            </h2>
            <ul className="mt-4 space-y-2.5">
              {program.documents.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fees & Processing */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <Clock className="h-6 w-6 text-primary" /> Fees & Processing
            </h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Government Fees:</span> {program.governmentFees}</p>
              <p><span className="font-semibold text-foreground">Service Fees:</span> {program.serviceFees}</p>
              <p><span className="font-semibold text-foreground">Processing Time:</span> {program.processingTime}</p>
              <p><span className="font-semibold text-foreground">Validity:</span> {program.validity}</p>
              <p><span className="font-semibold text-foreground">Renewal:</span> {program.renewal}</p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <AlertTriangle className="h-6 w-6 text-accent" /> Common Mistakes
            </h2>
            <ul className="mt-4 space-y-2.5">
              {program.commonMistakes.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Approval Rate */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <PercentCircle className="h-6 w-6 text-primary" /> Approval Rate
            </h2>
            <p className="mt-4 text-4xl font-semibold text-primary">{program.approvalRate}</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-center font-display text-3xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {program.faqs.map((faq: any, i: number) => (
                <AccordionItem key={i} value={`faq-${i}`} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md data-[state=open]:border-accent/50 transition-all">
                  <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-data-[state=open]:bg-accent transition-colors" />
                  <div className="pl-1">
                    <AccordionTrigger className="flex items-center justify-between py-4 pr-4 pl-4 text-left hover:no-underline">
                      <div className="flex items-start gap-3">
                        <span className="font-display text-base font-semibold text-foreground">{faq.q}</span>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-5 pb-5">
                    <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/eligibility">
            <Button className="btn-gold px-8 py-3.5 text-base shadow-md">
              Check Your Eligibility <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Globe2,
  Briefcase,
  GraduationCap,
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fallbackPackages: Record<string, {
  id: string;
  name: string;
  category: string;
  description: string;
  includes: string[];
  serviceFee: number;
  currency?: string;
  processingTime?: string;
  eligibleCountries?: string;
}> = {
  'family-relocation': {
    id: 'family-relocation',
    name: 'Family Relocation',
    category: 'Family',
    description: 'Comprehensive family immigration support to ensure smooth relocation, dependent visas, and seamless resettlement for your entire family.',
    includes: [
      'Comprehensive Eligibility Assessment for all family members',
      'Spousal & Dependent Visa Application Processing',
      'Certified Document Translation & Legal Preparation',
      'Housing, Healthcare & Settlement Assistance',
      'School & University Enrollment Support for Children',
    ],
    serviceFee: 2500,
    currency: 'USD',
    processingTime: '3-6 months',
    eligibleCountries: 'Canada, Australia, UK, New Zealand, Germany, USA',
  },
  'student-success': {
    id: 'student-success',
    name: 'Student Success',
    category: 'Education',
    description: 'End-to-end guidance for international students from university matching and admissions to visa approval and pre-departure preparation.',
    includes: [
      'Personalized University & Degree Program Matching',
      'Scholarship & Financial Aid Guidance',
      'Admission Application & SOP Review',
      'Student Visa Filing & Embassy Interview Coaching',
      'Accommodation Search & Pre-Departure Briefing',
    ],
    serviceFee: 1200,
    currency: 'USD',
    processingTime: '1-3 months',
    eligibleCountries: 'USA, UK, Canada, Australia, Germany, Ireland, France',
  },
  'skilled-worker': {
    id: 'skilled-worker',
    name: 'Skilled Worker',
    category: 'Work',
    description: 'Dedicated pathway assistance for skilled professionals aiming for work permits, points-based entry, and fast-tracked permanent residency.',
    includes: [
      'Job Matching & Employer Sponsorship Support',
      'Work Permit & Express Entry Visa Application',
      'Credential Evaluation & Educational Assessment (ECA)',
      'Points Assessment & Optimization Strategy',
      'Resume Localization & Interview Preparation',
    ],
    serviceFee: 3000,
    currency: 'USD',
    processingTime: '4-8 months',
    eligibleCountries: 'Canada, Australia, Germany, UK, New Zealand, UAE',
  },
};

async function getPackage(id: string) {
  const normalizedId = id.toLowerCase().trim();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/packages/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        try {
          const data = JSON.parse(text);
          if (data && data.name) return data;
        } catch {
          // continue to fallback
        }
      }
    }
  } catch {
    // network or connection error, continue to fallback
  }

  if (fallbackPackages[normalizedId]) {
    return fallbackPackages[normalizedId];
  }

  const foundBySlug = Object.values(fallbackPackages).find(
    (p) => p.name.toLowerCase().replace(/\s+/g, '-') === normalizedId || p.id === normalizedId
  );
  if (foundBySlug) return foundBySlug;

  return null;
}

// Temporary job lists for popular work-related packages
const jobLists: Record<string, string[]> = {
  'skilled-worker': [
    'Software Developer',
    'Registered Nurse',
    'Civil Engineer',
    'Data Scientist',
    'Electrician',
    'Plumber',
    'Teacher',
    'Accountant',
    'Project Manager',
    'Graphic Designer',
  ],
  'work-permit': [
    'IT Support Specialist',
    'Chef',
    'Construction Manager',
    'Marketing Specialist',
    'Financial Analyst',
    'HR Coordinator',
    'Dentist',
    'Pharmacist',
    'Mechanical Engineer',
    'Logistics Coordinator',
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await getPackage(id);
  return {
    title: pkg ? pkg.name : 'Package',
    description: pkg?.description || 'Immigration service package details',
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await getPackage(id);
  if (!pkg) notFound();

  const jobs = jobLists[id] || jobLists['skilled-worker'] || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Premium Service Package
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-white">{pkg.name}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/80">{pkg.description}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className="font-display text-3xl font-bold text-accent">${pkg.serviceFee?.toLocaleString()}</span>
            <Link href="/eligibility">
              <Button className="btn-gold px-6 py-3 shadow-md">
                Check Eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-premium py-12 md:py-16">
        {/* What's Included */}
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <CheckCircle2 className="h-6 w-6 text-primary" /> What's Included
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {pkg.includes?.map((item: string) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* If work-related, show jobs */}
        {jobs.length > 0 && (
          <div className="mt-8 rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
              <Briefcase className="h-6 w-6 text-primary" /> In-Demand Jobs for This Visa
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These occupations often qualify for this immigration pathway. Your chances improve if your profession is listed.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {jobs.map((job) => (
                <div key={job} className="rounded-lg bg-muted border border-border p-4 text-center">
                  <p className="text-sm font-medium text-foreground">{job}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-display text-lg font-semibold text-foreground">Processing Time</h3>
            <p className="text-sm text-muted-foreground">{pkg.processingTime || 'Typically 3-6 months depending on destination and case complexity.'}</p>
          </div>
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
            <Globe2 className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-display text-lg font-semibold text-foreground">Eligible Countries</h3>
            <p className="text-sm text-muted-foreground">{pkg.eligibleCountries || 'Most major destinations: Canada, UK, Australia, Germany, USA, etc.'}</p>
          </div>
          <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
            <Banknote className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-display text-lg font-semibold text-foreground">Service Fee</h3>
            <p className="text-sm text-muted-foreground">${pkg.serviceFee?.toLocaleString()} {pkg.currency || 'USD'} (government fees separate)</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/eligibility">
            <Button className="btn-gold px-8 py-3.5 text-base shadow-md">
              Start Your Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
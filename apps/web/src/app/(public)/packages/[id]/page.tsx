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

export const revalidate = 3600;

async function getPackage(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/packages/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
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
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <ShieldCheck className="h-4 w-4 text-[#C9A96E]" />
            Premium Service Package
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-white">{pkg.name}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/80">{pkg.description}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="font-display text-3xl font-bold text-[#C9A96E]">${pkg.serviceFee?.toLocaleString()}</span>
            <Link href="/eligibility">
              <Button className="bg-[#C9A96E] text-[#111827] hover:bg-[#b8955c]">
                Check Eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-premium py-12 md:py-16">
        {/* What's Included */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
            <CheckCircle2 className="h-6 w-6 text-[#0B5D66]" /> What's Included
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {pkg.includes?.map((item: string) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* If work-related, show jobs */}
        {jobs.length > 0 && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
              <Briefcase className="h-6 w-6 text-[#0B5D66]" /> In-Demand Jobs for This Visa
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              These occupations often qualify for this immigration pathway. Your chances improve if your profession is listed.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {jobs.map((job) => (
                <div key={job} className="rounded-lg bg-[#F8FAFA] p-4 text-center">
                  <p className="text-sm font-medium text-[#111827]">{job}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <Clock className="h-6 w-6 text-[#0B5D66]" />
            <h3 className="mt-2 font-display text-lg font-semibold text-[#111827]">Processing Time</h3>
            <p className="text-sm text-gray-600">Typically 3-6 months depending on destination and case complexity.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <Globe2 className="h-6 w-6 text-[#0B5D66]" />
            <h3 className="mt-2 font-display text-lg font-semibold text-[#111827]">Eligible Countries</h3>
            <p className="text-sm text-gray-600">Most major destinations: Canada, UK, Australia, Germany, etc.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <Banknote className="h-6 w-6 text-[#0B5D66]" />
            <h3 className="mt-2 font-display text-lg font-semibold text-[#111827]">Service Fee</h3>
            <p className="text-sm text-gray-600">${pkg.serviceFee?.toLocaleString()} (government fees separate)</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/eligibility">
            <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56] px-8 py-3">
              Start Your Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
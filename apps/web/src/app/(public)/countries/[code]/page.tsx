import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase, GraduationCap, Banknote, ShieldCheck, HeartPulse, Clock, FileText, Globe2, CheckCircle2, ArrowRight,
} from 'lucide-react';

export const revalidate = 3600;

function getFlagEmoji(code: string) {
  return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

async function getCountry(code: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/countries/${code}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = await getCountry(code);
  return {
    title: country ? `Immigration to ${country.name}` : 'Country',
    description: country ? `Explore immigration pathways, costs, and requirements for ${country.name}.` : 'Country details',
  };
}

export default async function CountryDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = await getCountry(code);
  if (!country) notFound();

  const occupations = country.inDemandOccupations || ['Software Developer', 'Nurse', 'Engineer', 'Data Analyst', 'Teacher'];

  return (
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-5xl md:text-6xl">{getFlagEmoji(country.code)}</span>
              <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
                {country.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-1"><Globe2 className="h-4 w-4" /> {country.continent}</span>
                <span className="flex items-center gap-1"><Banknote className="h-4 w-4" /> {country.currency}</span>
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Passport Rank #{country.passportRank}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/eligibility?to=${country.code}`} className="inline-flex items-center rounded-lg bg-[#C9A96E] px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-[#b8955c]">
                Check Eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/compare" className="inline-flex items-center rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/10">
                Compare
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Indices */}
      <div className="container-premium py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: 'Safety Index', value: country.safetyIndex },
            { icon: Banknote, label: 'Living Cost', value: country.livingCostIndex },
            { icon: HeartPulse, label: 'Healthcare', value: country.healthcareIndex },
            { icon: GraduationCap, label: 'Education', value: country.educationIndex },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                <item.icon className="h-5 w-5 text-[#0B5D66]" />
              </div>
              <p className="mt-3 text-sm text-gray-500">{item.label}</p>
              <p className="font-display text-2xl font-semibold text-[#111827]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* In-Demand Occupations */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
            <Briefcase className="h-6 w-6 text-[#0B5D66]" /> In-Demand Occupations
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {occupations.map((occ: string) => (
              <Badge key={occ} variant="secondary" className="px-4 py-2 text-sm text-[#0B5D66] bg-[#E8EEEE]">
                {occ}
              </Badge>
            ))}
          </div>
        </div>

        {/* Visa Rules */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
            <FileText className="h-6 w-6 text-[#0B5D66]" /> Available Visa Programs
          </h2>
          {country.visaRules.length === 0 ? (
            <p className="mt-4 text-gray-500">No visa rules configured yet.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {country.visaRules.map((rule: any) => (
                <div key={rule.id} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-display text-xl font-semibold text-[#111827]">
                    {rule.visaType?.name || rule.visaTypeId}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><Banknote className="h-4 w-4 text-[#C9A96E]" /> Fee: {rule.governmentFee} {rule.feeCurrency}</p>
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#C9A96E]" /> Processing: {rule.processingTimeMin}-{rule.processingTimeMax} days</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C9A96E]" /> Validity: {rule.validityPeriod} months</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Universities & Scholarships */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#111827]">
            <GraduationCap className="h-6 w-6 text-[#0B5D66]" /> Universities & Scholarships
          </h2>
          {country.universities?.length === 0 && country.scholarships?.length === 0 ? (
            <p className="mt-4 text-gray-500">No data available yet.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {country.universities?.map((uni: any) => (
                <div key={uni.id} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-display text-xl font-semibold text-[#111827]">{uni.name}</h3>
                  <p className="text-sm text-gray-500">Ranking: #{uni.ranking}</p>
                </div>
              ))}
              {country.scholarships?.map((sch: any) => (
                <div key={sch.id} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-display text-xl font-semibold text-[#111827]">{sch.name}</h3>
                  <p className="text-sm text-gray-500">{sch.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Last updated */}
        <div className="mt-12 text-right">
          <p className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" /> Last updated: {new Date(country.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
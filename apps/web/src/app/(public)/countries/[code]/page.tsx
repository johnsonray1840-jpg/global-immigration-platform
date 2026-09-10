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
    const text = await res.text();
    if (!text || text.trim().length === 0) return null;
    return JSON.parse(text);
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-5xl md:text-6xl">{getFlagEmoji(country.code)}</span>
              <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
                {country.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><Globe2 className="h-4 w-4 text-accent" /> {country.continent}</span>
                <span className="flex items-center gap-1.5"><Banknote className="h-4 w-4 text-accent" /> {country.currency}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Passport Rank #{country.passportRank}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/eligibility?to=${country.code}`} className="inline-flex items-center rounded-lg btn-gold px-5 py-3 text-sm font-semibold shadow-md">
                Check Eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/compare" className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20 backdrop-blur-sm transition-colors">
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
            <div key={item.label} className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
              <p className="font-display text-2xl font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* In-Demand Occupations */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <Briefcase className="h-6 w-6 text-primary" /> In-Demand Occupations
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {occupations.map((occ: string) => (
              <Badge key={occ} variant="secondary" className="px-4 py-2 text-sm font-medium text-foreground bg-muted border border-border">
                {occ}
              </Badge>
            ))}
          </div>
        </div>

        {/* Visa Rules */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <FileText className="h-6 w-6 text-primary" /> Available Visa Programs
          </h2>
          {country.visaRules.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No visa rules configured yet.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {country.visaRules.map((rule: any) => (
                <div key={rule.id} className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {rule.visaType?.name || rule.visaTypeId}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Banknote className="h-4 w-4 text-accent shrink-0" /> Fee: <span className="font-medium text-foreground">{rule.governmentFee} {rule.feeCurrency}</span></p>
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent shrink-0" /> Processing: <span className="font-medium text-foreground">{rule.processingTimeMin}-{rule.processingTimeMax} days</span></p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0" /> Validity: <span className="font-medium text-foreground">{rule.validityPeriod} months</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Universities & Scholarships */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" /> Universities & Scholarships
          </h2>
          {country.universities?.length === 0 && country.scholarships?.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No data available yet.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {country.universities?.map((uni: any) => (
                <div key={uni.id} className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
                  <h3 className="font-display text-xl font-semibold text-foreground">{uni.name}</h3>
                  <p className="text-sm text-muted-foreground">Ranking: #{uni.ranking}</p>
                </div>
              ))}
              {country.scholarships?.map((sch: any) => (
                <div key={sch.id} className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
                  <h3 className="font-display text-xl font-semibold text-foreground">{sch.name}</h3>
                  <p className="text-sm text-muted-foreground">{sch.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Last updated */}
        <div className="mt-12 text-right">
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> Last updated: {new Date(country.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
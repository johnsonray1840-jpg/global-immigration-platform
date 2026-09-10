import Link from 'next/link';
import { SectionHeading } from '@/components/shared/section-heading';
import { programs } from '@/data/programs';
import { Globe2, ArrowRight } from 'lucide-react';

export const revalidate = 86400;

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-20 text-white">
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            <Globe2 className="h-4 w-4 text-accent" />
            Global Pathways
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-white">Immigration Programs</h1>
          <p className="mt-4 text-lg text-white/80">Explore detailed pathways for every immigration goal.</p>
        </div>
      </section>
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link key={program.slug} href={`/programs/${program.slug}`}>
              <div className="group h-full rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{program.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{program.category}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{program.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Learn More <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
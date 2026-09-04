import Link from 'next/link';
import { SectionHeading } from '@/components/shared/section-heading';
import { programs } from '@/data/programs';
import { Globe2, ArrowRight } from 'lucide-react';

export const revalidate = 86400;

export default function ProgramsPage() {
  return (
    <div className="bg-[#F8FAFA]">
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="container-premium relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Immigration Programs</h1>
          <p className="mt-4 text-lg text-white/80">Explore detailed pathways for every immigration goal.</p>
        </div>
      </section>
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link key={program.slug} href={`/programs/${program.slug}`}>
              <div className="group h-full rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#C9A96E]/50 hover:shadow-lg">
                <h3 className="font-display text-xl font-semibold text-[#111827]">{program.title}</h3>
                <p className="mt-1 text-sm font-medium text-[#0B5D66]">{program.category}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{program.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[#0B5D66]">
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
'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import {
  Globe2,
  ShieldCheck,
  Users,
  Clock,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const programs = [
  { icon: Globe2, title: 'Permanent Residence', description: 'Live and work indefinitely with a clear pathway to citizenship.', badge: 'Most Popular' },
  { icon: ShieldCheck, title: 'Citizenship by Investment', description: 'Obtain citizenship through qualifying investment programs.', badge: 'Fast Track' },
  { icon: Users, title: 'Family Sponsorship', description: 'Reunite with your loved ones through family-based immigration.', badge: 'High Success' },
  { icon: Clock, title: 'Express Entry', description: 'Fast-track skilled migration through points-based systems.', badge: 'Quick Processing' },
  { icon: GraduationCap, title: 'Student Visa', description: 'Study at top universities with scholarship support.', badge: 'Scholarship Available' },
  { icon: Briefcase, title: 'Work Permit', description: 'Secure employment authorization in high-demand occupations.', badge: 'Employer Sponsored' },
];

const programSlugs: Record<string, string> = {
  'Permanent Residence': 'permanent-residence',
  'Citizenship by Investment': 'citizenship-by-investment',
  'Family Sponsorship': 'family-sponsorship',
  'Express Entry': 'skilled-worker',
  'Student Visa': 'student-immigration',
  'Work Permit': 'work-permit',
};

export default function ProgramsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container-premium">
        <SectionHeading
          title="Explore Immigration Programs"
          subtitle="Comprehensive pathways for every goal – from temporary visas to permanent residence and citizenship."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="group relative h-full rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/40 hover:shadow-lg">
                {program.badge && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    {program.badge}
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <program.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    href={`/programs/${programSlugs[program.title] || program.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import Link from 'next/link';
import Image from 'next/image';

const teamMembers = [
  { name: 'John Smith', role: 'Managing Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sarah Johnson', role: 'Head of Immigration Law', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
  { name: 'Michael Chen', role: 'Investment Migration Specialist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
];

const certifications = ['Licensed by Immigration Authorities', 'Member of International Immigration Association', 'ISO 9001 Certified Process', 'GDPR Compliant'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-24 text-white">
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            <ShieldCheck className="h-4 w-4 text-accent" /> Government-Approved & Registered
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-white">
            Trusted Global Immigration <span className="text-accent">Excellence</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            With over 10 years of combined experience, we deliver transparent, ethical, and expert guidance for individuals and families pursuing global mobility.
          </p>
        </div>
      </section>

      <div className="container-premium py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">Who We Are</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Global Citizens Solution is a licensed and government-approved immigration and citizenship consultancy. We combine deep legal expertise with cutting-edge technology to make global migration, residency, and citizenship simple, secure, and successful.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card text-card-foreground p-8 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">To empower people to achieve their global ambitions with trusted, compliant, and premium immigration services.</p>
          </div>

          <div className="rounded-xl border border-border bg-card text-card-foreground p-8 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Our Vision</h3>
            <p className="mt-2 text-muted-foreground">To be the world's most trusted immigration platform, setting the standard for excellence and innovation.</p>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-3xl font-semibold text-foreground">Certifications & Partners</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map(cert => (
              <div key={cert} className="flex items-start gap-3 rounded-xl border border-border bg-muted p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-3xl font-semibold text-foreground">Our Team</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {teamMembers.map(member => (
              <div key={member.name} className="rounded-xl border border-border bg-card text-card-foreground p-6 text-center shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-accent/30"
                />
                <h4 className="mt-4 font-display text-xl font-semibold text-foreground">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/consultation">
            <button className="inline-flex items-center justify-center rounded-lg btn-gold px-8 py-3.5 text-base font-semibold shadow-md transition-all">
              Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
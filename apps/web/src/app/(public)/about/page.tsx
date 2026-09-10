import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import Link from 'next/link';

const teamMembers = [
  { name: 'John Smith', role: 'Managing Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sarah Johnson', role: 'Head of Immigration Law', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
  { name: 'Michael Chen', role: 'Investment Migration Specialist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
];

const certifications = ['Licensed by Immigration Authorities', 'Member of International Immigration Association', 'ISO 9001 Certified Process', 'GDPR Compliant'];

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFA]">
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-24">
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <ShieldCheck className="h-4 w-4 text-[#C9A96E]" /> Government-Approved & Registered
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-white">Trusted Global Immigration <span className="text-[#C9A96E]">Excellence</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">With over 50 years of combined experience, we deliver transparent, ethical, and expert guidance for individuals and families pursuing global mobility.</p>
        </div>
      </section>
      <div className="container-premium py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#111827]">Who We Are</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">Global Citizens Solution is a licensed and government-approved immigration and citizenship consultancy. We combine deep legal expertise with cutting-edge technology to make global migration, residency, and citizenship simple, secure, and successful.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D66]/10"><Target className="h-6 w-6 text-[#0B5D66]" /></div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-[#111827]">Our Mission</h3>
            <p className="mt-2 text-gray-600">To empower people to achieve their global ambitions with trusted, compliant, and premium immigration services.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96E]/10"><Eye className="h-6 w-6 text-[#C9A96E]" /></div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-[#111827]">Our Vision</h3>
            <p className="mt-2 text-gray-600">To be the world's most trusted immigration platform, setting the standard for excellence and innovation.</p>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="font-display text-3xl font-semibold text-[#111827]">Certifications & Partners</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map(cert => (
              <div key={cert} className="flex items-start gap-3 rounded-xl bg-[#E8EEEE] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#0B5D66]" />
                <span className="text-sm font-medium text-[#111827]">{cert}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <h3 className="font-display text-3xl font-semibold text-[#111827]">Our Team</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {teamMembers.map(member => (
              <div key={member.name} className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <img src={member.img} alt={member.name} className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-[#C9A96E]/30" />
                <h4 className="mt-4 font-display text-xl font-semibold text-[#111827]">{member.name}</h4>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 text-center">
          <Link href="/consultation">
            <button className="inline-flex items-center rounded-lg bg-[#0B5D66] px-8 py-3 text-[#111827] font-semibold bg-[#C9A96E] hover:bg-[#b8955c]">
              Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  GraduationCap,
  Banknote,
  CalendarDays,
  Globe2,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/scholarships/${id}`)
        .then((res) => {
          setScholarship(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load scholarship');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20">
        <div className="container-premium max-w-4xl">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="mt-4 h-4 w-48 mx-auto" />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-500">Scholarship not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
          >
            <GraduationCap className="h-4 w-4 text-[#C9A96E]" />
            Scholarship Detail
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-white"
          >
            {scholarship.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-3xl text-lg text-white/80"
          >
            {scholarship.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            {scholarship.country && (
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white">
                <Globe2 className="mr-1 h-3 w-3" /> {scholarship.country.name}
              </Badge>
            )}
            {scholarship.university && (
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white">
                <GraduationCap className="mr-1 h-3 w-3" /> {scholarship.university.name}
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <div className="container-premium max-w-4xl py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-gray-600 hover:text-[#0B5D66]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D66]/10 mx-auto">
              <Banknote className="h-6 w-6 text-[#0B5D66]" />
            </div>
            <p className="mt-3 text-sm text-gray-500">Funding Amount</p>
            <p className="mt-1 text-2xl font-semibold text-[#111827]">
              ${scholarship.fundingAmount?.toLocaleString() || 'Varies'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96E]/20 mx-auto">
              <CalendarDays className="h-6 w-6 text-[#C9A96E]" />
            </div>
            <p className="mt-3 text-sm text-gray-500">Application Deadline</p>
            <p className="mt-1 text-2xl font-semibold text-[#111827]">
              {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Open'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D66]/10 mx-auto">
              <CheckCircle2 className="h-6 w-6 text-[#0B5D66]" />
            </div>
            <p className="mt-3 text-sm text-gray-500">Eligibility</p>
            <p className="mt-1 text-sm text-gray-600">
              {scholarship.eligibilityJson ? 'See requirements' : 'See description'}
            </p>
          </div>
        </div>

        {scholarship.link && (
          <div className="mt-10 text-center">
            <a href={scholarship.link} target="_blank" rel="noreferrer">
              <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
                <ExternalLink className="mr-2 h-4 w-4" /> Apply Now
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import {
  GraduationCap,
  Banknote,
  CalendarDays,
  Globe2,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Building2,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScholarshipItem {
  id: string;
  name: string;
  description: string;
  fundingAmount?: number;
  deadline?: string;
  link?: string;
  eligibilityJson?: {
    degreeLevel?: string[];
    academicRequirement?: string;
    benefits?: string[];
    coverageType?: string;
  };
  university?: {
    id: string;
    name: string;
    ranking?: number;
    tuitionRange?: string;
  };
  country?: {
    id: string;
    code: string;
    name: string;
    currency: string;
  };
}

const filterTabs = [
  { label: 'All Destinations', code: 'ALL' },
  { label: 'United States', code: 'US' },
  { label: 'United Kingdom', code: 'GB' },
  { label: 'Canada', code: 'CA' },
  { label: 'Europe', code: 'EUROPE' },
  { label: 'Asia & Oceania', code: 'ASIA_OCEANIA' },
];

const europeCodes = ['DE', 'FR', 'CH', 'IE', 'NL', 'SE'];
const asiaOceaniaCodes = ['AU', 'JP', 'SG', 'NZ'];

export default function ScholarshipsSection() {
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('ALL');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships');
      setScholarships(res.data);
    } catch (err) {
      console.warn('Failed to fetch scholarships for homepage:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter((item) => {
    const code = item.country?.code || '';
    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'US') return code === 'US';
    if (selectedTab === 'GB') return code === 'GB';
    if (selectedTab === 'CA') return code === 'CA';
    if (selectedTab === 'EUROPE') return europeCodes.includes(code);
    if (selectedTab === 'ASIA_OCEANIA') return asiaOceaniaCodes.includes(code);
    return true;
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAFA] to-white py-24">
      {/* Background Decorative Accents */}
      <div className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-[#0B5D66]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-[#C9A96E]/10 blur-3xl" />

      <div className="container-premium relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#9B7D3B]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C9A96E]" />
            Fully Funded & High-Value Grants
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl"
          >
            Global Scholarship Opportunities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-gray-600 sm:text-lg"
          >
            Explore prestigious government and institutional grants covering tuition, living stipends, and travel to world-leading universities.
          </motion.p>
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md sm:grid-cols-4"
        >
          <div className="text-center border-r border-gray-100 last:border-r-0">
            <p className="font-display text-2xl font-bold text-[#0B5D66] sm:text-3xl">$12M+</p>
            <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Available Funding</p>
          </div>
          <div className="text-center border-r border-gray-100 last:border-r-0">
            <p className="font-display text-2xl font-bold text-[#0B5D66] sm:text-3xl">100%</p>
            <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Tuition Waivers</p>
          </div>
          <div className="text-center border-r border-gray-100 last:border-r-0">
            <p className="font-display text-2xl font-bold text-[#0B5D66] sm:text-3xl">10+ Top</p>
            <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Global Destinations</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[#C9A96E] sm:text-3xl">98%</p>
            <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Visa Success Rate</p>
          </div>
        </motion.div>

        {/* Destination Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.code}
              onClick={() => setSelectedTab(tab.code)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm',
                selectedTab === tab.code
                  ? 'bg-[#0B5D66] text-white shadow-md shadow-[#0B5D66]/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0B5D66]/40 hover:text-[#0B5D66]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scholarships Cards Grid */}
        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-200/70" />
              ))}
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No scholarships found for this destination.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredScholarships.map((sch, i) => (
                  <motion.div
                    key={sch.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A96E] hover:shadow-xl group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        {sch.country && (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#0B5D66]/10 px-2.5 py-1 text-xs font-semibold text-[#0B5D66]">
                            <Globe2 className="h-3.5 w-3.5" />
                            {sch.country.name}
                          </span>
                        )}
                        {sch.eligibilityJson?.coverageType && (
                          <Badge className="bg-[#C9A96E]/15 text-[#9B7D3B] hover:bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[11px] font-semibold">
                            <Award className="mr-1 h-3 w-3 text-[#C9A96E]" />
                            {sch.eligibilityJson.coverageType}
                          </Badge>
                        )}
                      </div>

                      {/* Scholarship Title */}
                      <h3 className="mt-4 font-display text-xl font-bold text-[#111827] group-hover:text-[#0B5D66] transition-colors line-clamp-2">
                        {sch.name}
                      </h3>

                      {/* University */}
                      {sch.university && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span className="truncate">{sch.university.name}</span>
                        </p>
                      )}

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {sch.description}
                      </p>

                      {/* Highlights */}
                      {sch.eligibilityJson?.benefits && sch.eligibilityJson.benefits.length > 0 && (
                        <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
                          {sch.eligibilityJson.benefits.slice(0, 2).map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                              <span className="truncate">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Info & Action */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1 font-semibold text-[#111827] text-sm">
                          <Banknote className="h-4 w-4 text-[#C9A96E]" />
                          ${sch.fundingAmount ? sch.fundingAmount.toLocaleString() : 'Full Value'}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                          {sch.deadline
                            ? `Deadline: ${new Date(sch.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
                            : 'Open Rolling'}
                        </div>
                      </div>

                      <Link href={`/scholarships/${sch.id}`} className="block">
                        <Button
                          variant="outline"
                          className="w-full border-[#0B5D66]/30 text-[#0B5D66] font-medium hover:bg-[#0B5D66] hover:text-white transition-all group-hover:border-[#0B5D66]"
                        >
                          Explore & Apply
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom Call-to-Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#0B5D66] to-[#0A4E56] p-8 text-white shadow-xl sm:flex-row sm:p-10"
        >
          <div className="max-w-xl text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#C9A96E]">
              <BookOpen className="h-3.5 w-3.5" />
              1-on-1 Scholarship Guidance
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Need Help Securing Your Scholarship?
            </h3>
            <p className="mt-2 text-sm text-white/80">
              Our licensed education consultants assist with university admissions, essay reviews, scholarship documentation, and student visa approvals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/scholarships">
              <Button className="bg-[#C9A96E] text-white hover:bg-[#B8985D] font-semibold px-6 shadow-md">
                View All Scholarships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/consultation">
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                Book Consultation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import {
  Search,
  Filter,
  GraduationCap,
  Banknote,
  CalendarDays,
  Globe2,
  Building2,
  CheckCircle2,
  Award,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
    fetchFilters();
  }, []);

  const fetchScholarships = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships', { params });
      setScholarships(res.data);
    } catch (error) {
      console.warn('Failed to load scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [countriesRes, universitiesRes] = await Promise.all([
        api.get('/countries'),
        api.get('/universities'),
      ]);
      setCountries(countriesRes.data || []);
      setUniversities(universitiesRes.data || []);
    } catch (error) {
      console.warn('Failed to load filters:', error);
    }
  };

  const handleSearch = () => {
    const params: any = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCountry) params.country = selectedCountry;
    if (selectedUniversity) params.university = selectedUniversity;
    fetchScholarships(params);
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCountry('');
    setSelectedUniversity('');
    fetchScholarships({});
  };

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.25),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <GraduationCap className="h-4 w-4 text-[#C9A96E]" />
            Global Higher Education & Fellowships
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            Scholarship Directory
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg"
          >
            Discover 100% tuition-funded grants, government fellowships, and university scholarships to finance your study abroad aspirations.
          </motion.p>
        </div>
      </section>

      {/* Filters Strip */}
      <div className="container-premium -mt-8 relative z-20">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search scholarship name, country, field..."
                className="pl-9 h-11 bg-gray-50 border-gray-200"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
            >
              <option value="">All Destination Countries</option>
              {countries.map((c) => (
                <option key={c.id || c.code} value={c.id || c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
            >
              <option value="">All Partner Universities</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id || u.name}>
                  {u.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="flex-1 h-11 bg-[#0B5D66] text-white hover:bg-[#0A4E56] font-medium"
              >
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              {(search || selectedCountry || selectedUniversity) && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-11 border-gray-200 text-gray-500 hover:text-gray-800"
                  title="Reset Filters"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="container-premium py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#111827]">
              Available Scholarships
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {scholarships.length} active opportunities
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-200/80" />
            ))}
          </div>
        ) : scholarships.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
            <GraduationCap className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 font-display text-xl font-semibold text-gray-700">No scholarships found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search criteria or resetting filters.</p>
            <Button onClick={handleReset} variant="outline" className="mt-6 border-[#0B5D66] text-[#0B5D66]">
              Show All Scholarships
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {scholarships.map((sch, i) => (
                <motion.div
                  key={sch.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A96E] hover:shadow-xl group"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {sch.country && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#0B5D66]/10 px-2.5 py-1 text-xs font-semibold text-[#0B5D66]">
                          <Globe2 className="h-3.5 w-3.5" />
                          {sch.country.name}
                        </span>
                      )}
                      {sch.eligibilityJson?.coverageType && (
                        <Badge className="bg-[#C9A96E]/15 text-[#9B7D3B] border border-[#C9A96E]/30 text-[11px] font-semibold">
                          <Award className="mr-1 h-3 w-3 text-[#C9A96E]" />
                          {sch.eligibilityJson.coverageType}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
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

                    {/* Key Benefits */}
                    {sch.eligibilityJson?.benefits && sch.eligibilityJson.benefits.length > 0 && (
                      <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
                        {sch.eligibilityJson.benefits.slice(0, 2).map((benefit: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                            <span className="truncate">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer & CTA */}
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
                          : 'Open'}
                      </div>
                    </div>

                    <Link href={`/scholarships/${sch.id}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-[#0B5D66]/30 text-[#0B5D66] font-medium hover:bg-[#0B5D66] hover:text-white transition-all group-hover:border-[#0B5D66]"
                      >
                        View Full Details
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
    </div>
  );
}
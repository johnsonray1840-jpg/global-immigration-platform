'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { Search, Filter, GraduationCap, Banknote, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [countriesRes, universitiesRes] = await Promise.all([
        api.get('/countries'),
        api.get('/universities'),
      ]);
      setCountries(countriesRes.data);
      setUniversities(universitiesRes.data);
    } catch (error) {}
  };

  const handleSearch = () => {
    const params: any = {};
    if (search) params.search = search;
    if (selectedCountry) params.country = selectedCountry;
    if (selectedUniversity) params.university = selectedUniversity;
    fetchScholarships(params);
  };

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
            Global Education
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white"
          >
            Scholarship Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Find scholarships and universities for studying abroad.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="container-premium py-8">
        <div className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships..."
                className="pl-9"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
            >
              <option value="">All Universities</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0B5D66] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0A4E56]"
            >
              <Filter className="h-4 w-4" /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-premium pb-20">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-56 rounded-2xl"></div>)}
          </div>
        ) : scholarships.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-gray-500">No scholarships found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((sch, i) => (
              <motion.div
                key={sch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/scholarships/${sch.id}`}>
                  <div className="group h-full rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#C9A96E]/50 hover:shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B5D66]/10">
                        <GraduationCap className="h-5 w-5 text-[#0B5D66]" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-[#111827]">
                          {sch.name}
                        </h3>
                        {sch.university && (
                          <p className="text-sm text-gray-500">{sch.university.name}</p>
                        )}
                        {sch.country && (
                          <p className="text-sm text-gray-500">{sch.country.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1 text-sm font-medium text-[#111827]">
                        <Banknote className="h-4 w-4 text-[#C9A96E]" /> ${sch.fundingAmount?.toLocaleString() || 'Varies'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarDays className="h-4 w-4" />
                        {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'Open'}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Globe2, ArrowRight, Shield, GraduationCap, Banknote } from 'lucide-react';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

function getFlagEmoji(code: string) {
  return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/countries')
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const continents = useMemo(() => {
    const set = new Set(countries.map((c) => c.continent).filter(Boolean));
    return Array.from(set).sort();
  }, [countries]);

  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesContinent = continent === 'all' || c.continent === continent;
      return matchesSearch && matchesContinent;
    });
  }, [countries, search, continent]);

  return (
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
          >
            <Globe2 className="h-4 w-4 text-[#C9A96E]" />
            Global Coverage
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white"
          >
            Country Directory
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Explore immigration pathways for over 50 countries.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="container-premium py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Select value={continent} onValueChange={setContinent}>
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <SelectValue placeholder="All Continents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Continents</SelectItem>
              {continents.map((c) => (
                <SelectItem key={c} value={c!}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="container-premium pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton h-56 rounded-2xl"></div>)}
          </div>
        ) : filteredCountries.length === 0 ? (
          <div className="py-20 text-center">
            <Globe2 className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-gray-500">No countries found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <Link href={`/countries/${country.code.toLowerCase()}`}>
                  <div className="group h-full rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-[#C9A96E]/50 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{getFlagEmoji(country.code)}</span>
                      <span className="rounded-full bg-[#0B5D66]/10 px-3 py-1 text-xs font-medium text-[#0B5D66]">
                        Rank #{country.passportRank}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-[#111827]">{country.name}</h3>
                    <p className="text-sm text-gray-500">{country.continent}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                      <div className="flex flex-col items-center">
                        <Shield className="h-4 w-4 text-[#0B5D66]" />
                        <span className="text-xs text-gray-500">Safety</span>
                        <span className="text-sm font-medium text-[#111827]">{country.safetyIndex}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <GraduationCap className="h-4 w-4 text-[#0B5D66]" />
                        <span className="text-xs text-gray-500">Education</span>
                        <span className="text-sm font-medium text-[#111827]">{country.educationIndex}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Banknote className="h-4 w-4 text-[#0B5D66]" />
                        <span className="text-xs text-gray-500">Living</span>
                        <span className="text-sm font-medium text-[#111827]">{country.livingCostIndex}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end text-sm font-medium text-[#0B5D66]">
                      View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Search, Briefcase, FileText, Calendar, Plus, X, Globe, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PROFILE_CREATED: 'bg-slate-500/15 text-slate-300 border-slate-500/25',
  DOCUMENTS_PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  DOCUMENTS_VERIFIED: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  UNDER_INTERNAL_REVIEW: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  SUBMITTED_TO_GOVERNMENT: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  BIOMETRICS_SCHEDULED: 'bg-cyan-500/15 text-cyan-300 border-cyan-200/25',
  AWAITING_DECISION: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  APPROVED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  VISA_ISSUED: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  REJECTED: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
  CLOSED: 'bg-slate-600/15 text-slate-400 border-slate-600/25',
};

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases')
      .then((res) => {
        setCases(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setCases([]);
        setLoading(false);
      });
  }, []);

  const statuses = useMemo(() => {
    const set = new Set(cases.map((c) => c.status));
    return ['ALL', ...Array.from(set)];
  }, [cases]);

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.originCountry?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.destinationCountry?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.visaRule?.visaType?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-sky-950/40" />
        <Skeleton className="h-12 w-full max-w-md bg-sky-950/40" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl bg-sky-950/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Immigration Case Dossiers
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Track your ongoing citizenship, golden visa, and residency filings in real time.
          </p>
        </div>
        <Link href="/eligibility">
          <Button className="btn-sky text-xs font-bold px-4 py-2 shadow-lg shadow-sky-500/20">
            <Plus className="mr-1.5 h-4 w-4" /> Start New Application
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by country, visa type, or status..."
            className="pl-10 bg-[#030D1A]/80 border-sky-500/30 text-white placeholder:text-slate-500 focus:border-sky-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-52 bg-[#030D1A]/80 border-sky-500/30 text-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A1F38] border-sky-500/30 text-white">
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="focus:bg-sky-500/20 focus:text-white">
                {status === 'ALL' ? 'All Statuses' : status.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cases List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-500/20 bg-[#0A1F38]/40 p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-sky-400/40" />
          <p className="mt-4 text-base font-semibold text-white">No immigration applications found</p>
          <p className="mt-1 text-xs text-slate-400">
            Initiate a certified eligibility check to generate your first case dossier.
          </p>
          <Link href="/eligibility">
            <Button className="mt-6 btn-sky text-xs font-bold">
              Check Program Eligibility <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 shadow-xl backdrop-blur-md hover:border-sky-400/40 transition-all">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-white text-base">
                          <Globe className="h-4 w-4 text-sky-400" />
                          <span>{c.originCountry?.name || 'Country of Origin'}</span>
                          <span className="text-sky-400">&rarr;</span>
                          <span className="text-white">{c.destinationCountry?.name || 'Target Jurisdiction'}</span>
                        </div>
                        <Badge className={cn('border text-xs px-2.5 py-0.5 font-semibold', statusColors[c.status] || 'bg-sky-500/10 text-sky-300 border-sky-500/20')}>
                          {c.status?.replace(/_/g, ' ') || 'ACTIVE'}
                        </Badge>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-300">
                        {c.visaRule?.visaType?.name || 'Investment Citizenship Program'} &bull; Case ID: <span className="font-mono text-slate-400">#{c.id?.slice(0, 8)}</span>
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-sky-400" /> {c.documents?.length || 0} Dossier Documents
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#C8A96B]" /> Updated {new Date(c.updatedAt || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <ShieldCheck className="h-3.5 w-3.5" /> Compliance Verified
                        </span>
                      </div>
                    </div>

                    <Link href={`/dashboard/cases/${c.id}`}>
                      <Button variant="outline" className="border-sky-500/30 text-sky-400 hover:text-white hover:bg-sky-500/20 text-xs font-semibold">
                        View Dossier <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search, Briefcase, FileText, Calendar, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PROFILE_CREATED: 'bg-gray-100 text-gray-700 border-gray-200',
  DOCUMENTS_PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  DOCUMENTS_VERIFIED: 'bg-blue-100 text-blue-700 border-blue-200',
  UNDER_INTERNAL_REVIEW: 'bg-purple-100 text-purple-700 border-purple-200',
  SUBMITTED_TO_GOVERNMENT: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  BIOMETRICS_SCHEDULED: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  AWAITING_DECISION: 'bg-orange-100 text-orange-700 border-orange-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  VISA_ISSUED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  CLOSED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases')
      .then(res => { setCases(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statuses = useMemo(() => {
    const set = new Set(cases.map(c => c.status));
    return ['ALL', ...Array.from(set)];
  }, [cases]);

  const filtered = cases.filter(c => {
    const matchesSearch = c.originCountry?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.destinationCountry?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.visaRule?.visaType?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-12 w-full max-w-md"></div>
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-2xl"></div>)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">My Cases</h2>
          <p className="mt-1 text-sm text-gray-500">Track your immigration applications.</p>
        </div>
        <Link href="/eligibility">
          <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"><Plus className="mr-2 h-4 w-4" /> New Case</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 bg-white" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="h-4 w-4" /></button>}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            {statuses.map(status => <SelectItem key={status} value={status}>{status === 'ALL' ? 'All Statuses' : status.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No cases found.</p>
          <Link href="/eligibility"><Button variant="outline" className="mt-6">Start Eligibility Check <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map(c => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#111827]">{c.originCountry?.name || 'Origin'} <span className="text-gray-400">→</span> {c.destinationCountry?.name || 'Destination'}</p>
                        <Badge className={cn('border', statusColors[c.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>{c.status.replace(/_/g, ' ')}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{c.visaRule?.visaType?.name || 'Visa'} • Created {new Date(c.createdAt).toLocaleDateString()}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {c.documents?.length || 0} docs</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Updated {new Date(c.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/cases/${c.id}`}>
                      <Button variant="outline" className="text-[#0B5D66] hover:text-[#0A4E56]">View <ArrowRight className="ml-2 h-4 w-4" /></Button>
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
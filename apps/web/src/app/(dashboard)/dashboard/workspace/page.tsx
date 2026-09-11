'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Search, ArrowRight, CheckCircle2, Clock, FolderOpen, Globe2, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusBadgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  PROFILE_CREATED: { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-700/60' },
  DOCUMENTS_PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  DOCUMENTS_VERIFIED: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  UNDER_INTERNAL_REVIEW: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  SUBMITTED_TO_GOVERNMENT: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  BIOMETRICS_SCHEDULED: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  AWAITING_DECISION: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  APPROVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  VISA_ISSUED: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/50' },
  REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  CLOSED: { bg: 'bg-slate-800/80', text: 'text-slate-400', border: 'border-slate-700' },
};

export default function WorkspaceIndexPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases')
      .then((res) => {
        setCases(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load cases');
        setLoading(false);
      });
  }, []);

  const filtered = cases.filter(
    (c) =>
      c.originCountry?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.destinationCountry?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.visaRule?.visaType?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <Skeleton className="h-12 w-full max-w-md bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Digital Filing Studio
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
          Government Forms Workspace
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Complete, review, and export official visa questionnaires and electronic filings mirroring sovereign immigration systems.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by country or visa type..."
          className="pl-10 bg-[#0A1F38]/80 border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-500/20 bg-sky-500/[0.02] p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-500" />
          <p className="mt-4 text-base font-semibold text-white">No active dossiers ready for digital forms.</p>
          <p className="text-xs text-slate-400 mt-1">Initiate a formal assessment to open a sovereign forms workspace.</p>
          <Link href="/eligibility">
            <Button className="mt-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl text-xs px-5 shadow-lg shadow-sky-500/20">
              Start Eligibility Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((c) => {
            const badgeStyle = statusBadgeStyles[c.status] || {
              bg: 'bg-slate-800/80',
              text: 'text-slate-300',
              border: 'border-slate-700',
            };

            return (
              <Link key={c.id} href={`/dashboard/workspace/${c.id}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-[#071E38] shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white truncate text-base flex items-center gap-1.5">
                          <span>{c.originCountry?.name || 'Origin'}</span>
                          <span className="text-sky-400">→</span>
                          <span className="text-sky-300">{c.destinationCountry?.name || 'Destination'}</span>
                        </p>
                        <Badge className={cn('px-2.5 py-0.5 text-[11px] font-semibold rounded-full border', badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
                          {c.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {c.visaRule?.visaType?.name || 'Visa Application'} • Dossier #{c.id?.slice(-6)}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-sky-500/10 pt-3">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="h-3 w-3 text-slate-500" /> Updated {new Date(c.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                        <span className="flex items-center text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">
                          Open Form Studio <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Search, ArrowRight, CheckCircle2, Clock, FolderOpen } from 'lucide-react';

const statusColors: Record<string, string> = {
  PROFILE_CREATED: 'bg-gray-100 text-gray-700',
  DOCUMENTS_PENDING: 'bg-yellow-100 text-yellow-700',
  DOCUMENTS_VERIFIED: 'bg-blue-100 text-blue-700',
  UNDER_INTERNAL_REVIEW: 'bg-purple-100 text-purple-700',
  SUBMITTED_TO_GOVERNMENT: 'bg-indigo-100 text-indigo-700',
  BIOMETRICS_SCHEDULED: 'bg-cyan-100 text-cyan-700',
  AWAITING_DECISION: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-green-100 text-green-700',
  VISA_ISSUED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CLOSED: 'bg-gray-100 text-gray-500',
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
      c.originCountry?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.destinationCountry?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.visaRule?.visaType?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64"></div>
        <div className="skeleton h-12 w-full max-w-md"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold text-charcoal dark:text-white">
          Government Forms Workspace
        </h2>
        <p className="mt-1 text-sm text-ash-dark">
          Select a case to fill out or review the digital government form questionnaire.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-dark" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by country or visa type..."
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-silver p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-ash-dark" />
          <p className="mt-4 text-ash-dark">No workspace cases found.</p>
          <Link href="/eligibility">
            <Button variant="outline" className="mt-6">
              Start Eligibility Check <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((c) => (
            <Link key={c.id} href={`/dashboard/workspace/${c.id}`}>
              <GlassCard className="group h-full p-6 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-charcoal dark:text-white">
                        {c.originCountry?.name || 'Origin'} <span className="text-ash-dark">→</span> {c.destinationCountry?.name || 'Destination'}
                      </p>
                      <Badge className={statusColors[c.status] || 'bg-gray-100 text-gray-700'}>
                        {c.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-ash-dark">
                      {c.visaRule?.visaType?.name || 'Visa'} • Created {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-ash-dark">
                        <Clock className="h-3 w-3" /> Updated {new Date(c.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open Workspace <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search,
  Briefcase,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle,
} from 'lucide-react';
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

export default function AdminCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    setError(false);
    try {
      // Primary: Admin cases controller with deep relation data
      const res = await api.get('/admin/cases');
      setCases(res.data);
    } catch (err) {
      console.warn('Admin cases fetch failed, trying admin CRUD endpoint...', err);
      try {
        const res = await api.get('/admin/crud/case?take=200');
        setCases(res.data);
      } catch (fallbackErr) {
        console.warn('Admin CRUD case fetch failed, trying /cases endpoint...', fallbackErr);
        try {
          const fallbackRes = await api.get('/cases');
          setCases(fallbackRes.data);
        } catch (finalErr) {
          console.error('All case fetch methods failed', finalErr);
          setError(true);
          toast.error('Failed to load cases');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = cases.filter((c) => {
    const searchLower = search.toLowerCase();
    const applicantName = `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.toLowerCase();
    return (
      applicantName.includes(searchLower) ||
      (c.user?.email || '').toLowerCase().includes(searchLower) ||
      (c.originCountry?.name || '').toLowerCase().includes(searchLower) ||
      (c.destinationCountry?.name || '').toLowerCase().includes(searchLower) ||
      (c.visaRule?.visaType?.name || '').toLowerCase().includes(searchLower) ||
      c.status.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <p className="mt-4 text-gray-500">Failed to load cases. Please check your connection or backend server.</p>
        <Button variant="outline" className="mt-4" onClick={fetchCases}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Case Management</h2>
          <p className="mt-1 text-sm text-gray-500">Review and manage all client immigration cases.</p>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases..."
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Cases List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No cases found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((caseData) => (
            <motion.div
              key={caseData.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#111827]">
                        {caseData.originCountry?.name || 'Origin'} →{' '}
                        {caseData.destinationCountry?.name || 'Destination'}
                      </p>
                      {caseData.visaRule?.visaType?.name && (
                        <span className="text-xs rounded-md bg-stone-100 text-stone-700 px-2 py-0.5 font-medium border border-stone-200">
                          {caseData.visaRule.visaType.name}
                        </span>
                      )}
                      <Badge className={cn('border', statusColors[caseData.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                        {caseData.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Applicant: <span className="font-medium text-gray-800">{caseData.user?.firstName ? `${caseData.user.firstName} ${caseData.user.lastName || ''}` : caseData.user?.email || 'Unknown'}</span>{' '}
                      {caseData.user?.firstName && <span className="text-gray-400">({caseData.user.email})</span>} •{' '}
                      <span className="text-xs text-gray-500">Created {new Date(caseData.createdAt).toLocaleDateString()}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-medium text-[#0B5D66]">
                        <FileText className="h-3.5 w-3.5" />
                        {caseData.documents?.length || 0} documents ({caseData.documents?.filter((d: any) => d.status === 'VERIFIED').length || 0} verified)
                      </span>
                      {caseData.documents?.some((d: any) => d.status === 'PENDING_REVIEW' || d.status === 'UPLOADED') && (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          • {caseData.documents.filter((d: any) => d.status === 'PENDING_REVIEW' || d.status === 'UPLOADED').length} pending review
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Updated {new Date(caseData.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link href={`/admin/cases/${caseData.id}`}>
                    <Button variant="outline" className="text-[#0B5D66] border-[#0B5D66]/30 hover:bg-[#0B5D66]/5 hover:text-[#0A4E56]">
                      Review Case <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import DocumentUploader from '@/components/documents/DocumentUploader';
import {
  ArrowLeft,
  FileText,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Globe2,
  AlertCircle,
  Send,
  Shield,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusFlow = [
  'PROFILE_CREATED',
  'DOCUMENTS_PENDING',
  'DOCUMENTS_VERIFIED',
  'UNDER_INTERNAL_REVIEW',
  'SUBMITTED_TO_GOVERNMENT',
  'BIOMETRICS_SCHEDULED',
  'AWAITING_DECISION',
  'APPROVED',
  'VISA_ISSUED',
];

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

export default function CaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchCaseData = async () => {
    if (!id) return;
    try {
      const [caseRes, docsRes] = await Promise.all([
        api.get(`/cases/${id}`),
        api.get(`/cases/${id}/documents`),
      ]);
      setCaseData(caseRes.data);
      setDocuments(docsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load case details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseData();
  }, [id]);

  const handleSubmitForReview = async () => {
    if (!caseData) return;
    setSubmitting(true);
    try {
      await api.post(`/cases/${caseData.id}/submit-review`);
      toast.success('Case submitted for senior legal review');
      fetchCaseData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSuccess = () => {
    api.get(`/cases/${id}/documents`)
      .then((res) => setDocuments(res.data))
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-800" />
        <Skeleton className="h-44 rounded-2xl bg-slate-800" />
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-24 rounded-xl bg-slate-800" />
          <Skeleton className="h-24 rounded-xl bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-20 text-center rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 backdrop-blur-xl">
        <p className="text-lg text-slate-400">Immigration dossier not found or access restricted.</p>
        <Button
          variant="outline"
          className="mt-4 border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Cases
        </Button>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(caseData.status);
  const canSubmit =
    caseData.status === 'PROFILE_CREATED' ||
    caseData.status === 'DOCUMENTS_PENDING';

  const badgeStyle = statusBadgeStyles[caseData.status] || {
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cases">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
                Dossier #{caseData.id?.slice(-8) || 'VIP'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                Created {new Date(caseData.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mt-0.5">
              {caseData.visaRule?.visaType?.name || 'Immigration Dossier'}
            </h2>
          </div>
        </div>

        <Badge className={cn('px-3.5 py-1 text-xs font-semibold rounded-full border', badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
          {caseData.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Overview Card */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
        
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Origin Jurisdiction</p>
            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-white">
              <Globe2 className="h-4 w-4 text-sky-400" />
              {caseData.originCountry?.name || 'Country of Origin'}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Destination Jurisdiction</p>
            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-sky-400">
              <Globe2 className="h-4 w-4 text-sky-400" />
              {caseData.destinationCountry?.name || 'Target Country'}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Category & Track</p>
            <p className="mt-2 text-base font-semibold text-white truncate">
              {caseData.visaRule?.visaType?.name || 'General Route'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-sky-500/10 pt-5">
          <Link href={`/dashboard/workspace/${caseData.id}`}>
            <Button
              variant="outline"
              className="border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold"
            >
              Open Digital Forms Workspace <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-xs font-medium"
              onClick={() => setShowUpload(!showUpload)}
            >
              <Upload className="mr-2 h-3.5 w-3.5 text-sky-400" />
              {showUpload ? 'Close Vault Uploader' : 'Upload Documentation'}
            </Button>

            {canSubmit && (
              <Button
                onClick={handleSubmitForReview}
                disabled={submitting}
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 shadow-lg shadow-sky-500/25 border border-sky-400/30 text-xs"
              >
                {submitting ? (
                  <>
                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting Dossier...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-3.5 w-3.5" />
                    Submit for Legal Review
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden rounded-2xl border border-sky-500/30 bg-[#0A1F38]/90 p-6 backdrop-blur-xl shadow-2xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-sky-400" />
            <h3 className="font-display text-lg font-semibold text-white">Direct Vault Submission</h3>
          </div>
          <DocumentUploader
            caseId={caseData.id}
            onUploadSuccess={handleUploadSuccess}
          />
        </motion.div>
      )}

      {/* Status Timeline */}
      <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" /> Legal Progress Tracking
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end diplomatic and government filing milestones.
            </p>
          </div>
          <span className="text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            Stage {Math.max(1, currentStatusIndex + 1)} of {statusFlow.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {statusFlow.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <div
                key={status}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-xs font-medium transition-all',
                  isCurrent
                    ? 'border-sky-500/60 bg-sky-500/20 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/40'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/5 bg-white/[0.02] text-slate-500'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-600 shrink-0" />
                )}
                <span className="truncate">{status.replace(/_/g, ' ')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-400" /> Encrypted Dossier Artifacts
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Documents stored in client tier-1 security isolation.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {documents.length} File{documents.length === 1 ? '' : 's'} Verified
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-sky-500/20 bg-sky-500/[0.02] p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-500" />
            <p className="mt-3 text-sm font-medium text-slate-300">No documents uploaded to this dossier yet.</p>
            <p className="text-xs text-slate-500 mt-1">Upload required passport copies, financial declarations, and supporting records.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(true)}
              className="mt-4 border-sky-500/30 text-sky-400 hover:bg-sky-500/10 text-xs"
            >
              <Upload className="mr-2 h-3.5 w-3.5" /> Upload First Document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group relative overflow-hidden rounded-xl border border-sky-500/20 bg-[#030D1A]/70 p-4 transition-all duration-200 hover:border-sky-400/40 hover:bg-[#071E38]/90"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-white text-sm">{doc.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    {doc.reviewNotes && (
                      <p className="mt-2 flex items-start gap-1 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                        <span>{doc.reviewNotes}</span>
                      </p>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      'border px-2.5 py-0.5 text-[11px] font-semibold rounded-full',
                      doc.status === 'VERIFIED'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : doc.status === 'REJECTED'
                        ? 'border-red-500/30 bg-red-500/10 text-red-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    )}
                  >
                    {doc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
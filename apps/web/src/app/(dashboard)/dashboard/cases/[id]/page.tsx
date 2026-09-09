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
      toast.success('Case submitted for review');
      fetchCaseData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh documents after upload
    api.get(`/cases/${id}/documents`)
      .then((res) => setDocuments(res.data))
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500">Case not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(caseData.status);
  const canSubmit =
    caseData.status === 'PROFILE_CREATED' ||
    caseData.status === 'DOCUMENTS_PENDING';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cases">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#0B5D66]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#111827]">Case Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Created {new Date(caseData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={cn('border', statusColors[caseData.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
          {caseData.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Overview Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="mt-1 flex items-center gap-2 font-medium text-[#111827]">
              <Globe2 className="h-4 w-4 text-[#0B5D66]" />
              {caseData.originCountry?.name || 'Origin'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="mt-1 flex items-center gap-2 font-medium text-[#111827]">
              <Globe2 className="h-4 w-4 text-[#0B5D66]" />
              {caseData.destinationCountry?.name || 'Destination'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Visa Type</p>
            <p className="mt-1 font-medium text-[#111827]">
              {caseData.visaRule?.visaType?.name || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
          <Button
            variant="outline"
            className="text-[#0B5D66]"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Upload className="mr-2 h-4 w-4" />
            {showUpload ? 'Close Upload' : 'Upload Document'}
          </Button>
          {canSubmit && (
            <Button
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
            >
              {submitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Review
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <DocumentUploader
            caseId={caseData.id}
            onUploadSuccess={handleUploadSuccess}
          />
        </motion.div>
      )}

      {/* Status Timeline */}
      <div>
        <h3 className="font-display text-2xl font-semibold text-[#111827]">Progress</h3>
        <div className="mt-6 flex flex-wrap gap-2">
          {statusFlow.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <div
                key={status}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
                  isCompleted
                    ? 'border-[#0B5D66]/50 bg-[#0B5D66]/10 text-[#0B5D66]'
                    : isCurrent
                    ? 'border-[#0B5D66] bg-[#0B5D66] text-white'
                    : 'border-gray-200 bg-white text-gray-500'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
                {status.replace(/_/g, ' ')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="font-display text-2xl font-semibold text-[#111827]">Documents</h3>
        {documents.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B5D66]/10">
                    <FileText className="h-5 w-5 text-[#0B5D66]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#111827]">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.type} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    {doc.reviewNotes && (
                      <p className="mt-1 flex items-start gap-1 text-xs text-red-500">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                        {doc.reviewNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      className={cn(
                        'border',
                        doc.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : doc.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      )}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
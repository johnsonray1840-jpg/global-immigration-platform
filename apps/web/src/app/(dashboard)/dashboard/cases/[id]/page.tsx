'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  FileText,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Globe2,
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

  useEffect(() => {
    if (id) {
      Promise.all([
        api.get(`/cases/${id}`),
        api.get(`/cases/${id}/documents`),
      ])
        .then(([caseRes, docsRes]) => {
          setCaseData(caseRes.data);
          setDocuments(docsRes.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">Case not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(caseData.status);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cases">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground">Case Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Created {new Date(caseData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={cn('border', statusColors[caseData.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
          {caseData.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Overview Card */}
      <GlassCard className="p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">From</p>
            <p className="mt-1 flex items-center gap-2 font-medium text-foreground">
              <Globe2 className="h-4 w-4 text-primary" />
              {caseData.originCountry?.name || 'Origin'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">To</p>
            <p className="mt-1 flex items-center gap-2 font-medium text-foreground">
              <Globe2 className="h-4 w-4 text-primary" />
              {caseData.destinationCountry?.name || 'Destination'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Visa Type</p>
            <p className="mt-1 font-medium text-foreground">
              {caseData.visaRule?.visaType?.name || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Cost Estimates */}
        {(caseData.estimatedProcessingDays || caseData.totalCostEstimate) && (
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-4">
            {caseData.estimatedProcessingDays && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Est. Processing</p>
                  <p className="font-medium text-foreground">{caseData.estimatedProcessingDays} days</p>
                </div>
              </div>
            )}
            {caseData.governmentFeeEstimate && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Gov. Fee</p>
                  <p className="font-medium text-foreground">${caseData.governmentFeeEstimate}</p>
                </div>
              </div>
            )}
            {caseData.serviceFeeEstimate && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Service Fee</p>
                  <p className="font-medium text-foreground">${caseData.serviceFeeEstimate}</p>
                </div>
              </div>
            )}
            {caseData.totalCostEstimate && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-medium text-foreground">${caseData.totalCostEstimate}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Status Timeline */}
      <div>
        <h3 className="font-display text-2xl font-semibold text-foreground">Progress</h3>
        <div className="mt-6 flex flex-wrap gap-2">
          {statusFlow.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            const isRejected = caseData.status === 'REJECTED' && idx === statusFlow.length - 1;
            return (
              <div
                key={status}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
                  isCompleted
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : isCurrent
                    ? 'border-primary bg-primary text-white'
                    : isRejected
                    ? 'border-red-200 bg-red-100 text-red-700'
                    : 'border-border bg-card text-muted-foreground'
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

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-foreground">Documents</h3>
          <Button variant="outline" className="text-foreground">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <GlassCard key={doc.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.status}
                    </p>
                  </div>
                </div>
                {doc.status === 'VERIFIED' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
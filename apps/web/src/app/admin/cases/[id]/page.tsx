'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import DocumentReviewPanel from '@/components/documents/DocumentReviewPanel';
import {
  ArrowLeft,
  Globe2,
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ListChecks,
  Tag,
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

const caseStatusOptions = [
  { value: 'DOCUMENTS_PENDING', label: 'Documents Pending' },
  { value: 'DOCUMENTS_VERIFIED', label: 'Documents Verified' },
  { value: 'UNDER_INTERNAL_REVIEW', label: 'Under Internal Review' },
  { value: 'SUBMITTED_TO_GOVERNMENT', label: 'Submitted to Government' },
  { value: 'BIOMETRICS_SCHEDULED', label: 'Biometrics Scheduled' },
  { value: 'AWAITING_DECISION', label: 'Awaiting Decision' },
  { value: 'APPROVED', label: 'Approve Case' },
  { value: 'VISA_ISSUED', label: 'Visa Issued' },
  { value: 'REJECTED', label: 'Reject Case' },
  { value: 'CLOSED', label: 'Close Case' },
];

export default function AdminCaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchCaseDetails = useCallback(async () => {
    if (!id) return;
    try {
      // First try dedicated admin cases endpoint
      const res = await api.get(`/admin/cases/${id}`);
      setCaseData(res.data);
      setSelectedStatus(res.data.status);
    } catch {
      try {
        const crudRes = await api.get(`/admin/crud/case/${id}`);
        setCaseData(crudRes.data);
        setSelectedStatus(crudRes.data.status);
      } catch {
        toast.error('Failed to load case details');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCaseDetails();
  }, [id, fetchCaseDetails]);

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    setUpdatingStatus(true);
    try {
      await api.patch(`/admin/cases/${id}/status`, {
        status: selectedStatus,
        notes: statusNotes.trim() || undefined,
      });
      toast.success(`Case status updated to ${selectedStatus.replace(/_/g, ' ')}`);
      setShowStatusModal(false);
      setStatusNotes('');
      fetchCaseDetails();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openStatusUpdate = (targetStatus: string) => {
    setSelectedStatus(targetStatus);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Case not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  const applicantName = caseData.user?.profile?.firstName || caseData.user?.profile?.lastName
    ? `${caseData.user?.profile?.firstName || ''} ${caseData.user?.profile?.lastName || ''}`.trim()
    : caseData.user?.email || 'Applicant';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/cases">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#0B5D66]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-semibold text-[#111827]">Case Review</h2>
              <span className="text-sm font-mono text-gray-400">#{caseData.id.slice(-8)}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Applicant: <strong>{applicantName}</strong> ({caseData.user?.email}) • Created {new Date(caseData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn('border px-3 py-1 text-sm font-semibold', statusColors[caseData.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
            {caseData.status.replace(/_/g, ' ')}
          </Badge>
          <Button
            className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
            onClick={() => setShowStatusModal(true)}
          >
            Update Workflow Status
          </Button>
        </div>
      </div>

      {/* Case Overview & Workflow Control Bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-display text-xl font-semibold text-[#111827] mb-4">Case Overview</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-b border-gray-100 pb-5">
            <div>
              <p className="text-xs font-medium text-gray-500">Origin Country</p>
              <p className="mt-1 flex items-center gap-2 font-medium text-[#111827]">
                <Globe2 className="h-4 w-4 text-[#0B5D66]" /> {caseData.originCountry?.name || 'Origin'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Destination Country</p>
              <p className="mt-1 flex items-center gap-2 font-medium text-[#111827]">
                <Globe2 className="h-4 w-4 text-[#0B5D66]" /> {caseData.destinationCountry?.name || 'Destination'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Visa Pathway</p>
              <p className="mt-1 font-medium text-[#111827]">
                {caseData.visaRule?.visaType?.name || 'Standard Visa Pathway'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">Processing Time</p>
              <p className="font-medium text-[#111827] mt-0.5">
                {caseData.estimatedProcessingDays ? `${caseData.estimatedProcessingDays} days` : '30-90 days'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Government Fee</p>
              <p className="font-medium text-[#111827] mt-0.5">
                ${caseData.governmentFeeEstimate || caseData.visaRule?.governmentFee || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Service Fee</p>
              <p className="font-medium text-[#111827] mt-0.5">
                ${caseData.serviceFeeEstimate || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Estimate</p>
              <p className="font-medium text-[#111827] mt-0.5">
                ${caseData.totalCostEstimate || (caseData.governmentFeeEstimate || 0) + (caseData.serviceFeeEstimate || 0)}
              </p>
            </div>
          </div>

          {caseData.notes && (
            <div className="mt-5 rounded-lg bg-yellow-50/70 border border-yellow-200 p-3.5 text-xs text-yellow-900">
              <strong>Admin Notes / Instructions:</strong> {caseData.notes}
            </div>
          )}
        </div>

        {/* Quick Workflow Actions Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#111827]">Quick Decision</h3>
            <p className="mt-1 text-xs text-gray-500">Fast-track the case to its next stage.</p>
            
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={() => openStatusUpdate('DOCUMENTS_VERIFIED')}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                1. Mark Documents Verified
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                onClick={() => openStatusUpdate('UNDER_INTERNAL_REVIEW')}
              >
                <FileText className="mr-2 h-4 w-4 text-purple-600" />
                2. Move to Internal Legal Review
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                onClick={() => openStatusUpdate('SUBMITTED_TO_GOVERNMENT')}
              >
                <Send className="mr-2 h-4 w-4 text-indigo-600" />
                3. Submit to Government
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-green-700 border-green-200 hover:bg-green-50 font-medium"
                onClick={() => openStatusUpdate('APPROVED')}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                4. Final Approval
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => openStatusUpdate('REJECTED')}
              >
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Reject Case
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Review Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#111827]">Submitted Case Documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Inspect applicant documents, view OCR extractions, and verify or reject individual files.
            </p>
          </div>
        </div>

        <DocumentReviewPanel
          caseId={caseData.id}
          initialDocuments={caseData.documents}
          onDocumentUpdated={fetchCaseDetails}
        />
      </div>

      {/* Case Timeline / Audit */}
      {caseData.timeline && Array.isArray(caseData.timeline) && caseData.timeline.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl font-semibold text-[#111827] mb-4">Case History & Timeline</h3>
          <div className="space-y-3">
            {caseData.timeline.map((item: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-gray-600 border-l-2 border-[#0B5D66] pl-3 py-1">
                <div>
                  <p className="font-semibold text-[#111827] text-sm">
                    {item.event ? item.event.replace(/_/g, ' ') : 'Status Update'}
                  </p>
                  <p className="text-gray-400">
                    {item.date ? new Date(item.date).toLocaleString() : ''}
                  </p>
                  {item.notes && <p className="mt-1 text-gray-700 bg-gray-50 p-1.5 rounded">{item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              Update Case Status
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Change the progress stage for case #{caseData.id.slice(-8)}. The applicant will receive an automated notification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 py-3">
            <div>
              <label className="text-sm font-medium text-[#111827]">
                New Case Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                required
              >
                {caseStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.value})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#111827]">
                Status Notes / Feedback for Applicant (Optional)
              </label>
              <Textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Provide details or next steps for the applicant..."
                rows={3}
                className="mt-1"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatingStatus}
                className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
              >
                {updatingStatus ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                )}
                Save Status
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
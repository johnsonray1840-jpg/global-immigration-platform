'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  ExternalLink,
  Loader2,
  Calendar,
  AlertTriangle,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CaseDocument {
  id: string;
  caseId: string;
  userId: string;
  name: string;
  type: string;
  fileUrl: string;
  ocrText?: string | null;
  status: 'UPLOADED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | string;
  expiryDate?: string | null;
  reviewNotes?: string | null;
  reviewStatus?: string | null;
  uploadedAt: string;
  updatedAt: string;
  verifier?: {
    id: string;
    user?: { email: string; profile?: { firstName?: string; lastName?: string } };
  } | null;
  reviewer?: {
    id: string;
    user?: { email: string; profile?: { firstName?: string; lastName?: string } };
  } | null;
}

const statusColors: Record<string, string> = {
  UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  VERIFIED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function DocumentReviewPanel({
  caseId,
  initialDocuments,
  onDocumentUpdated,
}: {
  caseId: string;
  initialDocuments?: CaseDocument[];
  onDocumentUpdated?: () => void;
}) {
  const [documents, setDocuments] = useState<CaseDocument[]>(initialDocuments || []);
  const [loading, setLoading] = useState(!initialDocuments);
  const [viewingDoc, setViewingDoc] = useState<CaseDocument | null>(null);
  const [rejectingDoc, setRejectingDoc] = useState<CaseDocument | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!caseId) return;
    try {
      // Try cases document list endpoint first, fallback to admin case documents
      const res = await api.get(`/cases/${caseId}/documents`);
      setDocuments(res.data);
    } catch {
      try {
        const adminRes = await api.get(`/cases/${caseId}/documents/admin`);
        setDocuments(adminRes.data);
      } catch (err) {
        console.error('Failed to load case documents:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (initialDocuments) {
      setDocuments(initialDocuments);
      setLoading(false);
    } else {
      fetchDocuments();
    }
  }, [caseId, initialDocuments, fetchDocuments]);

  const handleApprove = async (docId: string) => {
    setProcessingId(docId);
    try {
      await api.patch(`/documents/${docId}/review`, {
        status: 'VERIFIED',
      });
      toast.success('Document marked as Verified');
      fetchDocuments();
      if (onDocumentUpdated) onDocumentUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve document');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingDoc) return;
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessingId(rejectingDoc.id);
    try {
      await api.patch(`/documents/${rejectingDoc.id}/review`, {
        status: 'REJECTED',
        reason: rejectReason.trim(),
      });
      toast.success('Document rejected with feedback sent to user');
      setRejectingDoc(null);
      setRejectReason('');
      fetchDocuments();
      if (onDocumentUpdated) onDocumentUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject document');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const verifiedCount = documents.filter((d) => d.status === 'VERIFIED').length;
  const pendingCount = documents.filter((d) => d.status === 'PENDING_REVIEW' || d.status === 'UPLOADED').length;
  const rejectedCount = documents.filter((d) => d.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Mini Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-[#111827]">
            <FileText className="h-4 w-4 text-[#0B5D66]" /> Total: {documents.length}
          </span>
          <span className="flex items-center gap-1.5 text-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" /> {verifiedCount} Verified
          </span>
          <span className="flex items-center gap-1.5 text-yellow-700">
            <AlertTriangle className="h-4 w-4 text-yellow-600" /> {pendingCount} Pending Review
          </span>
          {rejectedCount > 0 && (
            <span className="flex items-center gap-1.5 text-red-700">
              <XCircle className="h-4 w-4 text-red-600" /> {rejectedCount} Rejected
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchDocuments}
          className="text-gray-500 hover:text-[#0B5D66]"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h4 className="mt-3 font-medium text-[#111827]">No Documents Submitted Yet</h4>
          <p className="mt-1 text-sm text-gray-500">
            The applicant has not uploaded any required documents for this case yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {documents.map((doc) => {
              const isProcessing = processingId === doc.id;
              const isVerified = doc.status === 'VERIFIED';
              const isRejected = doc.status === 'REJECTED';

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={cn(
                    'rounded-xl border p-5 transition-all shadow-sm bg-white',
                    isVerified && 'border-green-200 bg-green-50/20',
                    isRejected && 'border-red-200 bg-red-50/20',
                    !isVerified && !isRejected && 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Document Meta */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                          isVerified ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-[#0B5D66]/10 text-[#0B5D66]'
                        )}
                      >
                        {isVerified ? (
                          <FileCheck className="h-6 w-6" />
                        ) : (
                          <FileText className="h-6 w-6" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-[#111827] truncate text-base">{doc.name}</h4>
                          <Badge className={cn('border text-xs', statusColors[doc.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                            {doc.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>
                            <strong>Type:</strong> {doc.type.replace(/_/g, ' ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(doc.uploadedAt).toLocaleDateString()} at {new Date(doc.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {doc.expiryDate && (
                            <span>
                              <strong>Expiry:</strong> {new Date(doc.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Reviewer Notes / Feedback */}
                        {doc.reviewNotes && (
                          <div className={cn('mt-2.5 rounded-lg p-2.5 text-xs', isRejected ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-700')}>
                            <strong>Review Feedback:</strong> {doc.reviewNotes}
                          </div>
                        )}

                        {/* OCR Preview indicator */}
                        {doc.ocrText && (
                          <p className="mt-2 text-xs text-gray-500 line-clamp-1 italic">
                            Extracted Text: {doc.ocrText}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingDoc(doc)}
                        className="text-gray-700 hover:text-[#0B5D66]"
                      >
                        <Eye className="mr-1.5 h-4 w-4" /> View / OCR
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 h-4 w-4" /> Open File
                        </a>
                      </Button>

                      {/* Approval / Rejection Controls */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRejectingDoc(doc);
                          setRejectReason(doc.reviewNotes || '');
                        }}
                        disabled={isProcessing}
                        className={cn(
                          'text-red-600 border-red-200 hover:bg-red-50',
                          isRejected && 'bg-red-100 font-medium'
                        )}
                      >
                        <XCircle className="mr-1.5 h-4 w-4 text-red-500" />
                        {isRejected ? 'Edit Rejection' : 'Reject'}
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleApprove(doc.id)}
                        disabled={isProcessing || isVerified}
                        className={cn(
                          'bg-green-600 text-white hover:bg-green-700',
                          isVerified && 'bg-green-700 opacity-90'
                        )}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        )}
                        {isVerified ? 'Verified' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Document View Modal */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="bg-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {viewingDoc?.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Uploaded document details, visual preview, and OCR data.
            </DialogDescription>
          </DialogHeader>

          {viewingDoc && (
            <div className="space-y-4 py-3">
              {/* Document Overview Card */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
                <div>
                  <span className="text-gray-500">Document Type:</span>
                  <p className="font-semibold text-gray-800">{viewingDoc.type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <Badge className={cn('block w-fit mt-0.5', statusColors[viewingDoc.status])}>
                    {viewingDoc.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Uploaded On:</span>
                  <p className="font-medium text-gray-800">{new Date(viewingDoc.uploadedAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Direct Link:</span>
                  <a
                    href={viewingDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#0B5D66] hover:underline font-medium mt-0.5"
                  >
                    Open in New Window <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Preview Window */}
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px] max-h-[500px]">
                {viewingDoc.fileUrl.match(/\.(pdf)$/i) ? (
                  <iframe
                    src={viewingDoc.fileUrl}
                    className="w-full h-[480px] border-0"
                    title={viewingDoc.name}
                  />
                ) : viewingDoc.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                  <img
                    src={viewingDoc.fileUrl}
                    alt={viewingDoc.name}
                    className="max-h-[480px] w-auto object-contain mx-auto"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-3 text-sm font-medium text-gray-700">Preview not available for this format</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <a href={viewingDoc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-1.5 h-4 w-4" /> Download / Open
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* OCR Text Box */}
              {viewingDoc.ocrText && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-medium text-[#111827] text-sm mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#0B5D66]" /> Extracted OCR Text
                  </h4>
                  <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto bg-white p-3 rounded-lg border border-gray-200">
                    {viewingDoc.ocrText}
                  </pre>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <DialogFooter className="gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewingDoc(null)}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setRejectingDoc(viewingDoc);
                      setRejectReason(viewingDoc.reviewNotes || '');
                      setViewingDoc(null);
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" /> Reject...
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handleApprove(viewingDoc.id);
                      setViewingDoc(null);
                    }}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve Document
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Document Modal */}
      <Dialog open={!!rejectingDoc} onOpenChange={() => setRejectingDoc(null)}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              Reject Document
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Provide feedback for {rejectingDoc?.name}. The applicant will see this reason to correct and resubmit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRejectSubmit} className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-[#111827]">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Passport is expired, image is blurry, or missing page 2..."
                rows={4}
                className="mt-1"
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectingDoc(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={processingId === rejectingDoc?.id}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {processingId === rejectingDoc?.id ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-1.5 h-4 w-4" />
                )}
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
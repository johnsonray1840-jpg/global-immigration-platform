'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Filter,
  Calendar,
  User,
  Download,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  caseId: string;
  userId: string;
  name: string;
  type: string;
  fileUrl: string;
  ocrText?: string | null;
  status: string;
  expiryDate?: string | null;
  verifiedById?: string | null;
  reviewStatus?: string | null;
  reviewNotes?: string | null;
  reviewedById?: string | null;
  uploadedAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
    };
  };
  case?: {
    id: string;
    status: string;
    destinationCountry?: {
      name: string;
    };
  };
}

const statusColors: Record<string, string> = {
  UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  VERIFIED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminDocumentReviewsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/admin/documents/pending-review');
      setDocuments(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load documents:', err);
      toast.error('Failed to load documents for review');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.type.toLowerCase().includes(search.toLowerCase()) ||
      doc.user?.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReview = async (
    documentId: string,
    status: 'VERIFIED' | 'REJECTED'
  ) => {
    if (status === 'REJECTED' && !reviewNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessingId(documentId);
    try {
      await api.patch(`/documents/${documentId}/review`, {
        status,
        reason: reviewNotes.trim(),
      });
      toast.success(
        status === 'VERIFIED' ? 'Document approved' : 'Document rejected'
      );
      setViewingDoc(null);
      setReviewNotes('');
      fetchDocuments();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to review document';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const openReviewDialog = (doc: Document) => {
    setViewingDoc(doc);
    setReviewNotes(doc.reviewNotes || '');
  };

  const pendingCount = documents.filter((d) => d.status === 'PENDING_REVIEW').length;
  const verifiedCount = documents.filter((d) => d.status === 'VERIFIED').length;
  const rejectedCount = documents.filter((d) => d.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load documents.</p>
        <Button variant="outline" className="mt-4" onClick={fetchDocuments}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-[#111827]">
          Document Review Center
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Review, approve, or reject submitted case documents.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="font-display text-2xl font-semibold text-[#111827]">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="font-display text-2xl font-semibold text-[#111827]">
                {verifiedCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="font-display text-2xl font-semibold text-[#111827]">
                {rejectedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
            <option value="UPLOADED">Uploaded</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No documents found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-[#111827]">{doc.name}</h3>
                        <Badge
                          className={cn(
                            'border',
                            statusColors[doc.status] ||
                              'bg-gray-100 text-gray-700 border-gray-200'
                          )}
                        >
                          {doc.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Type: {doc.type}
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          User:{' '}
                          {doc.user?.profile?.firstName || doc.user?.profile?.lastName
                            ? `${doc.user?.profile?.firstName || ''} ${doc.user?.profile?.lastName || ''}`.trim()
                            : doc.user?.email || 'N/A'}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(doc)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="bg-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              Review Document
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Examine the document and make a decision.
            </DialogDescription>
          </DialogHeader>

          {viewingDoc && (
            <div className="space-y-4 py-4">
              {/* Document Info */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="font-medium text-[#111827] mb-2">Document Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{viewingDoc.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">{viewingDoc.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <Badge className={cn('mt-1', statusColors[viewingDoc.status])}>
                      {viewingDoc.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Uploaded</p>
                    <p className="font-medium">
                      {new Date(viewingDoc.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-[#111827] mb-2">Document Preview</h4>
                {viewingDoc.fileUrl.match(/\.(jpg|jpeg|png|gif|pdf)$/i) ? (
                  viewingDoc.fileUrl.match(/\.pdf$/i) ? (
                    <iframe
                      src={viewingDoc.fileUrl}
                      className="w-full h-96 border rounded"
                      title="Document Preview"
                    />
                  ) : (
                    <img
                      src={viewingDoc.fileUrl}
                      alt={viewingDoc.name}
                      className="w-full h-auto max-h-96 object-contain rounded border"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded">
                    <FileText className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Preview not available</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      asChild
                    >
                      <a
                        href={viewingDoc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Tab
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* OCR Text */}
              {viewingDoc.ocrText && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-[#111827] mb-2">Extracted Text (OCR)</h4>
                  <div className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded text-sm font-mono">
                    {viewingDoc.ocrText}
                  </div>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium text-[#111827]">
                  Review Notes {viewingDoc.status === 'REJECTED' && <span className="text-red-500">*</span>}
                </label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  placeholder={
                    viewingDoc.status === 'REJECTED'
                      ? 'Required: Explain why this document is being rejected...'
                      : 'Add any notes about this document...'
                  }
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <DialogFooter className="gap-2 sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleReview(viewingDoc.id, 'REJECTED')}
                    disabled={processingId === viewingDoc.id}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    {processingId === viewingDoc.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleReview(viewingDoc.id, 'VERIFIED')}
                    disabled={processingId === viewingDoc.id}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {processingId === viewingDoc.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

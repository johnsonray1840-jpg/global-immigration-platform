'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';

export default function ConsultantDocumentsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const casesRes = await api.get('/consultant/cases');
      setCases(casesRes.data);

      const allDocs: any[] = [];
      for (const c of casesRes.data) {
        if (c.documents && Array.isArray(c.documents)) {
          c.documents.forEach((d: any) => allDocs.push({ ...d, caseInfo: c }));
        }
      }
      setDocuments(allDocs);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (docId: string, verified: boolean) => {
    try {
      setActionLoading(docId);
      await api.patch(`/consultant/documents/${docId}/verify`, { verified });
      toast.success(verified ? 'Document approved' : 'Document rejected');
      await fetchData();
    } catch (error) {
      toast.error('Verification update failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDocs = selectedCaseId === 'all'
    ? documents
    : documents.filter((d) => d.caseId === selectedCaseId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Verified</span>;
      case 'REJECTED':
        return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Rejected</span>;
      case 'EXPIRED':
        return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Expired</span>;
      default:
        return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Uploaded / Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-charcoal dark:text-white">Document Verification</h2>
          <p className="mt-1 text-sm text-ash-dark">Review, inspect OCR extractions, and verify client immigration documents.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="rounded-md border border-silver bg-white px-3 py-2 text-sm text-charcoal shadow-sm dark:bg-charcoal dark:text-white"
          >
            <option value="all">All Assigned Cases ({documents.length} docs)</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.user?.email} - {c.originCountry?.name} → {c.destinationCountry?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-ash-dark" />
          <p className="mt-4 text-lg font-medium text-charcoal dark:text-white">No documents found</p>
          <p className="mt-1 text-sm text-ash-dark">Documents uploaded by your clients will appear here for verification.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDocs.map((doc) => (
            <GlassCard key={doc.id} className="p-6 transition-shadow hover:shadow-md">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <h4 className="font-display text-lg font-semibold text-charcoal dark:text-white">{doc.name}</h4>
                    {getStatusBadge(doc.status)}
                  </div>
                  <p className="text-sm text-ash-dark">
                    Category: <span className="font-medium capitalize text-charcoal dark:text-white">{doc.type.replace(/_/g, ' ')}</span> • Client: <span className="font-medium text-charcoal dark:text-white">{doc.caseInfo?.user?.email || 'Client'}</span>
                  </p>
                  <p className="text-xs text-ash-dark">
                    Case: {doc.caseInfo?.originCountry?.name} → {doc.caseInfo?.destinationCountry?.name} ({doc.caseInfo?.visaRule?.visaType?.name || 'Visa'}) • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                  {doc.ocrText && (
                    <div className="mt-3 rounded-lg bg-ash-light/70 p-3 text-xs dark:bg-ash-dark/40">
                      <span className="font-semibold text-charcoal dark:text-white">OCR Extracted Data:</span>
                      <p className="mt-1 line-clamp-2 text-ash-dark">{doc.ocrText}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleVerify(doc.id, true)}
                    disabled={actionLoading === doc.id || doc.status === 'VERIFIED'}
                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="mr-1.5 h-4 w-4" /> Verify
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleVerify(doc.id, false)}
                    disabled={actionLoading === doc.id || doc.status === 'REJECTED'}
                    className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Save } from 'lucide-react';

export default function ConsultantCaseDetailPage() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      api.get(`/consultant/cases/${id}`).then((res) => {
        setCaseData(res.data);
        setNotes(res.data.notes || '');
        setDocuments(res.data.documents || []);
      }).catch(() => toast.error('Failed to load case'));
    }
  }, [id]);

  const verify = async (docId: string, verified: boolean) => {
    try {
      await api.patch(`/consultant/documents/${docId}/verify`, { verified });
      toast.success(verified ? 'Document verified' : 'Document rejected');
      setDocuments((prev) => prev.map((d) => d.id === docId ? { ...d, status: verified ? 'VERIFIED' : 'REJECTED' } : d));
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const bulkVerify = async (verified: boolean) => {
    for (const docId of selectedDocs) {
      await verify(docId, verified);
    }
    setSelectedDocs([]);
    toast.success(`Bulk ${verified ? 'verification' : 'rejection'} completed`);
  };

  const saveNotes = async () => {
    try {
      await api.patch(`/consultant/cases/${id}/notes`, { notes });
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const toggleSelect = (docId: string) => {
    setSelectedDocs((prev) => prev.includes(docId) ? prev.filter((d) => d !== docId) : [...prev, docId]);
  };

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-charcoal dark:text-white">Case Details</h2>

      {caseData && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="font-serif text-xl font-semibold">Case Information</h3>
            <p className="mt-2 text-sm">Client: {caseData.user?.email}</p>
            <p className="text-sm">{caseData.originCountry.name} → {caseData.destinationCountry.name}</p>
            <p className="text-sm">Visa: {caseData.visaRule?.visaType?.name}</p>
            <p className="text-sm">Status: {caseData.status}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-serif text-xl font-semibold">Internal Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-2"
            />
            <Button onClick={saveNotes} className="mt-4 bg-charcoal text-white dark:bg-white dark:text-charcoal">
              <Save className="mr-2 h-4 w-4" /> Save Notes
            </Button>
          </GlassCard>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-semibold text-charcoal dark:text-white">Documents</h3>
          {selectedDocs.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => bulkVerify(true)}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Verify Selected
              </Button>
              <Button variant="outline" onClick={() => bulkVerify(false)}>
                <XCircle className="mr-2 h-4 w-4 text-red-600" /> Reject Selected
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {documents.length === 0 ? (
            <p className="text-ash-dark">No documents.</p>
          ) : (
            documents.map((doc) => (
              <GlassCard key={doc.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal dark:text-white">{doc.name}</p>
                    <p className="text-sm text-ash-dark">Type: {doc.type} • Status: {doc.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                      className="h-5 w-5"
                    />
                    <Button variant="ghost" size="sm" onClick={() => verify(doc.id, true)}>
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Verify
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => verify(doc.id, false)}>
                      <XCircle className="h-4 w-4 mr-1 text-red-600" /> Reject
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
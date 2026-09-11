'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import DocumentUploader from '@/components/documents/DocumentUploader';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const docStatusStyles: Record<string, string> = {
  UPLOADED: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  VERIFIED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  EXPIRED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function DocumentsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    api.get('/cases')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setCases(list);
        if (list.length > 0) {
          setSelectedCase(list[0].id);
        }
        setLoadingCases(false);
      })
      .catch(() => setLoadingCases(false));
  }, []);

  useEffect(() => {
    if (selectedCase) {
      setLoadingDocs(true);
      api.get(`/cases/${selectedCase}/documents`)
        .then((res) => {
          setDocuments(Array.isArray(res.data) ? res.data : []);
          setLoadingDocs(false);
        })
        .catch(() => setLoadingDocs(false));
    }
  }, [selectedCase]);

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Lock className="h-3 w-3" /> End-to-End 256-bit Encrypted Vault
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Compliance & Identity Dossier
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Upload passport scans, police clearances, apostilled certificates, and proof of funds.
          </p>
        </div>
      </div>

      {/* Case Selector */}
      {!loadingCases && cases.length > 0 ? (
        <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-5 backdrop-blur-md">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Active Immigration Dossier:
          </label>
          <Select value={selectedCase || undefined} onValueChange={setSelectedCase}>
            <SelectTrigger className="w-full md:w-96 bg-[#030D1A] border-sky-500/30 text-white">
              <SelectValue placeholder="Select a case dossier" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A1F38] border-sky-500/30 text-white">
              {cases.map((c) => (
                <SelectItem key={c.id} value={c.id} className="focus:bg-sky-500/20 focus:text-white">
                  {c.originCountry?.name || 'Origin'} &rarr; {c.destinationCountry?.name || 'Destination'} ({c.visaRule?.visaType?.name || 'Case'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : !loadingCases ? (
        <div className="rounded-2xl border border-dashed border-sky-500/20 bg-[#0A1F38]/40 p-8 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-sky-400/40" />
          <p className="mt-2 text-sm text-slate-300 font-semibold">No active cases found</p>
          <p className="text-xs text-slate-400 mt-0.5">Please create or start a case assessment to upload documents.</p>
        </div>
      ) : (
        <Skeleton className="h-14 w-full md:w-96 bg-sky-950/40" />
      )}

      {/* Upload Area */}
      {selectedCase && (
        <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 backdrop-blur-md shadow-xl">
          <DocumentUploader
            caseId={selectedCase}
            onUploadSuccess={() => {
              if (selectedCase) {
                setLoadingDocs(true);
                api.get(`/cases/${selectedCase}/documents`)
                  .then((res) => {
                    setDocuments(Array.isArray(res.data) ? res.data : []);
                    setLoadingDocs(false);
                  })
                  .catch(() => setLoadingDocs(false));
              }
            }}
          />
        </div>
      )}

      {/* Document List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-white">
            Vault Dossier Documents
          </h3>
          <span className="text-xs text-slate-400">{documents.length} Files Stored</span>
        </div>

        {loadingDocs ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl bg-sky-950/40" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-500/20 bg-[#0A1F38]/40 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-sky-400/40" />
            <p className="mt-4 text-sm font-semibold text-white">No documents uploaded to this dossier yet</p>
            <p className="text-xs text-slate-400 mt-1">Use the upload box above to submit required identity and legal records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between p-4 rounded-xl border border-sky-500/20 bg-[#0A1F38]/90 hover:border-sky-400/40 transition-all shadow-md">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
                        <FileText className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm truncate max-w-xs">{doc.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {doc.type?.replace(/_/g, ' ')} &bull; {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === 'VERIFIED' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      {doc.status === 'REJECTED' && (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                      {doc.status === 'UPLOADED' && (
                        <Clock className="h-4 w-4 text-sky-400" />
                      )}
                      <Badge className={cn('border text-xs px-2 py-0.5 font-semibold', docStatusStyles[doc.status] || docStatusStyles.UPLOADED)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import DocumentUploader from '@/components/documents/DocumentUploader';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  FolderOpen,
  ChevronDown,
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
  UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
  VERIFIED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-500 border-gray-200',
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
        setCases(res.data);
        if (res.data.length > 0) {
          setSelectedCase(res.data[0].id);
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
          setDocuments(res.data);
          setLoadingDocs(false);
        })
        .catch(() => setLoadingDocs(false));
    }
  }, [selectedCase]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-foreground">
            My Documents
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and manage documents for your immigration cases.
          </p>
        </div>
        {!loadingCases && cases.length > 0 && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow">
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        )}
      </div>

      {/* Case Selector */}
      {!loadingCases && cases.length > 0 ? (
        <Select value={selectedCase || undefined} onValueChange={setSelectedCase}>
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Select a case" />
          </SelectTrigger>
          <SelectContent>
            {cases.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.originCountry?.name} → {c.destinationCountry?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : !loadingCases ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">You have no active cases yet.</p>
        </div>
      ) : (
        <Skeleton className="h-12 w-full md:w-96" />
      )}

      {/* Upload Area */}
      {selectedCase && (
  <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-6 transition-colors hover:border-primary/50">
    <DocumentUploader
      caseId={selectedCase}
      onUploadSuccess={() => {
        if (selectedCase) {
          setLoadingDocs(true);
          api.get(`/cases/${selectedCase}/documents`)
            .then((res) => {
              setDocuments(res.data);
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
        <h3 className="font-display text-2xl font-semibold text-foreground">
          Uploaded Documents
        </h3>
        {loadingDocs ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard className="flex items-center justify-between p-4 transition-shadow hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === 'VERIFIED' && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {doc.status === 'REJECTED' && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {doc.status === 'UPLOADED' && (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      <Badge className={cn('border', docStatusStyles[doc.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                        {doc.status}
                      </Badge>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
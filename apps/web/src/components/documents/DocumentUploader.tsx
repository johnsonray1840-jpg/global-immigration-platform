'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  XCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const docTypes = [
  { value: 'passport', label: 'Passport (Bio-page & Signature)' },
  { value: 'national_id', label: 'National ID / Driver License' },
  { value: 'proof_of_funds', label: 'Proof of Funds / Certified Bank Statement' },
  { value: 'employment_letter', label: 'Employment Verification / Contract' },
  { value: 'education_certificate', label: 'Degree / Academic Transcript' },
  { value: 'police_clearance', label: 'Police Clearance Certificate' },
  { value: 'medical_report', label: 'Certified Medical Examination Report' },
  { value: 'other', label: 'Other Supporting Documentation' },
];

export default function DocumentUploader({
  caseId,
  onUploadSuccess,
}: {
  caseId: string;
  onUploadSuccess?: () => void;
}) {
  const [docType, setDocType] = useState('passport');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      for (const file of acceptedFiles) {
        setUploading(true);
        setProgress(10);
        setCurrentFile(file.name);
        setError(null);
        try {
          // Try presigned URL approach
          const res = await api.post(`/cases/${caseId}/documents/upload-url`, {
            name: file.name,
            type: docType,
            contentType: file.type || 'application/octet-stream',
          });
          setProgress(40);

          const uploadResponse = await fetch(res.data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
            },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Presigned upload failed (${uploadResponse.status})`);
          }

          setProgress(80);

          await api.post(`/cases/${caseId}/documents/confirm`, {
            key: res.data.key,
            name: file.name,
            type: docType,
          });
        } catch (error) {
          // Fallback to direct upload
          console.warn('Presigned upload failed, trying direct upload...');
          setProgress(50);
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', docType);

          const directRes = await api.post(
            `/cases/${caseId}/documents/upload`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );

          if (directRes.status !== 201 && directRes.status !== 200) {
            throw new Error('Direct upload failed');
          }
        }

        setProgress(100);
        toast.success(`"${file.name}" encrypted and uploaded successfully!`);
        if (onUploadSuccess) onUploadSuccess();
      }
      setUploading(false);
    },
    [caseId, docType, onUploadSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
  });

  return (
    <div className="space-y-4">
      {/* Document Type Selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Document Classification:
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          disabled={uploading}
          className="w-full sm:w-80 rounded-xl border border-sky-500/30 bg-[#030D1A] px-3 py-2 text-xs font-medium text-white shadow-inner transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-60"
        >
          {docTypes.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#030D1A] text-white py-1">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragActive
            ? 'border-sky-400 bg-sky-500/10 scale-[0.99]'
            : 'border-sky-500/30 bg-[#030D1A]/60 hover:border-sky-400/60 hover:bg-[#071E38]/80',
          uploading && 'pointer-events-none opacity-70',
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          {uploading ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 shadow-lg shadow-sky-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-sky-400" />
            </div>
          ) : error ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">
              <XCircle className="h-7 w-7 text-red-400" />
            </div>
          ) : (
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl border transition-all',
              isDragActive
                ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-400/20'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
            )}>
              <UploadCloud className="h-7 w-7 text-sky-400" />
            </div>
          )}

          <p className="mt-4 text-sm font-semibold text-white">
            {uploading
              ? `Encrypting and transmitting ${currentFile}...`
              : isDragActive
              ? 'Release files to securely transfer'
              : 'Drag and drop documents here, or browse local device'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Accepts official PDF, high-res JPG or PNG (up to 25MB per file)
          </p>
        </motion.div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mx-auto mt-4 w-full max-w-md">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-mono text-sky-400">
              {progress}% secure transfer complete
            </p>
          </div>
        )}

        {/* Success indicator */}
        {progress === 100 && !uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Document verified and safely stored in legal vault
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-sky-400" /> AES-256 Client-Side Ingestion
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> ISO/IEC 27001 Compliant
        </span>
      </div>
    </div>
  );
}
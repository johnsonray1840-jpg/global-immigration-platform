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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const docTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID / Driver License' },
  { value: 'proof_of_funds', label: 'Proof of Funds / Bank Statement' },
  { value: 'employment_letter', label: 'Employment Letter / Contract' },
  { value: 'education_certificate', label: 'Degree / Academic Transcript' },
  { value: 'police_clearance', label: 'Police Clearance Certificate' },
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'other', label: 'Other Document' },
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
        toast.success(`"${file.name}" uploaded successfully!`);
        if (onUploadSuccess) onUploadSuccess();
      }
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
        <label className="text-sm font-medium text-foreground">
          Document Type:
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          disabled={uploading}
          className="w-full sm:w-64 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        >
          {docTypes.map((t) => (
            <option key={t.value} value={t.value}>
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
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          {uploading ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          ) : error ? (
            <XCircle className="h-12 w-12 text-red-500" />
          ) : (
            <UploadCloud
              className={cn(
                'h-12 w-12',
                isDragActive ? 'text-primary' : 'text-muted-foreground',
              )}
            />
          )}

          <p className="mt-4 text-sm font-medium text-foreground">
            {uploading
              ? `Uploading ${currentFile}...`
              : isDragActive
              ? 'Drop files here'
              : 'Drag & drop files here, or click to select'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, JPG, PNG up to 25MB
          </p>
        </motion.div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mx-auto mt-4 w-full max-w-md">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {progress}% completed
            </p>
          </div>
        )}

        {/* Success indicator */}
        {progress === 100 && !uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Upload complete
          </div>
        )}
      </div>

      {/* File constraints info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileText className="h-4 w-4" />
        Accepted formats: PDF, JPG, PNG. Max size 25MB.
      </div>
    </div>
  );
}
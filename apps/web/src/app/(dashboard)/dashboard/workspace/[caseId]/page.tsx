'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Loader2, ArrowLeft, Download, Save, ShieldCheck, Sparkles, FileText } from 'lucide-react';

export default function WorkspaceDetailPage() {
  const { caseId } = useParams();
  const router = useRouter();
  const [schema, setSchema] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (caseId) {
      api.get(`/workspace/case/${caseId}`)
        .then((res) => {
          setSchema(res.data.schema || {
            type: 'object',
            properties: {
              fullName: { type: 'string', title: 'Full Legal Name (as shown in passport)' },
              dateOfBirth: { type: 'string', format: 'date', title: 'Date of Birth' },
              passportNumber: { type: 'string', title: 'Passport Number' },
              address: { type: 'string', title: 'Current Residential Address' },
              employmentHistory: { type: 'string', title: 'Summary of Recent Employment / Executive Roles' },
            },
          });
          setFormData(res.data.data || {});
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load workspace');
          setLoading(false);
        });
    }
  }, [caseId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/workspace/case/${caseId}`, { formData });
      toast.success('Workspace progress saved successfully');
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get(`/workspace/case/${caseId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sovereign-filing-${caseId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Dossier questionnaire exported');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-400 mb-4" />
        <p className="text-sm font-semibold text-white">Loading Sovereign Government Questionnaire...</p>
        <p className="text-xs text-slate-400 mt-1">Decrypting schema and client profile mappings</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/workspace">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
                Form Studio • Dossier #{caseId ? String(caseId).slice(-6) : ''}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mt-0.5">
              Government Filing Questionnaire
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs rounded-xl"
          >
            <Download className="mr-2 h-3.5 w-3.5 text-sky-400" /> Export JSON
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl text-xs px-5 shadow-lg shadow-sky-500/20"
          >
            {saving ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Save Filing State
          </Button>
        </div>
      </div>

      {/* Notice Card */}
      <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-5 backdrop-blur-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-300">
            All entered information is auto-verified against target immigration department statutes before submission.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-sky-400 shrink-0 hidden md:block">
          Auto-Sync Enabled
        </span>
      </div>

      {/* Form Container */}
      <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl text-white workspace-form-container">
        <style jsx global>{`
          .workspace-form-container form label {
            color: #E2E8F0 !important;
            font-size: 0.8125rem !important;
            font-weight: 600 !important;
            letter-spacing: 0.025em !important;
            margin-bottom: 0.375rem !important;
            display: block !important;
          }
          .workspace-form-container form input,
          .workspace-form-container form textarea,
          .workspace-form-container form select {
            background-color: #030D1A !important;
            border: 1px solid rgba(56, 189, 248, 0.3) !important;
            color: #FFFFFF !important;
            border-radius: 0.75rem !important;
            padding: 0.625rem 0.875rem !important;
            font-size: 0.875rem !important;
            width: 100% !important;
            margin-bottom: 1rem !important;
            transition: all 0.2s ease !important;
          }
          .workspace-form-container form input:focus,
          .workspace-form-container form textarea:focus,
          .workspace-form-container form select:focus {
            outline: none !important;
            border-color: #38BDF8 !important;
            box-shadow: 0 0 0 1px #38BDF8 !important;
          }
          .workspace-form-container form .btn-info,
          .workspace-form-container form button[type="submit"] {
            background: linear-gradient(to right, #0ea5e9, #0284c7) !important;
            color: #ffffff !important;
            font-weight: 600 !important;
            font-size: 0.8125rem !important;
            padding: 0.625rem 1.25rem !important;
            border-radius: 0.75rem !important;
            border: 1px solid rgba(56, 189, 248, 0.4) !important;
            cursor: pointer !important;
            transition: opacity 0.2s ease !important;
          }
          .workspace-form-container form .btn-info:hover,
          .workspace-form-container form button[type="submit"]:hover {
            opacity: 0.9 !important;
          }
          .workspace-form-container form .control-label {
            color: #E2E8F0 !important;
          }
          .workspace-form-container form .panel {
            background: transparent !important;
            border: none !important;
          }
          .workspace-form-container form legend {
            color: #FFFFFF !important;
            font-size: 1.125rem !important;
            font-weight: 700 !important;
            border-bottom: 1px solid rgba(56, 189, 248, 0.15) !important;
            padding-bottom: 0.5rem !important;
            margin-bottom: 1rem !important;
          }
        `}</style>
        
        <Form
          schema={schema}
          formData={formData}
          onChange={(e) => setFormData(e.formData)}
          validator={validator}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
}

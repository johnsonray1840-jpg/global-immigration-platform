'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Loader2 } from 'lucide-react';

export default function WorkspacePage() {
  const { caseId } = useParams();
  const router = useRouter();
  const [schema, setSchema] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      api.get(`/workspace/case/${caseId}`)
        .then((res) => {
          setSchema(res.data.schema || {
            type: 'object',
            properties: {
              fullName: { type: 'string', title: 'Full Name' },
              dateOfBirth: { type: 'string', format: 'date', title: 'Date of Birth' },
              passportNumber: { type: 'string', title: 'Passport Number' },
              address: { type: 'string', title: 'Address' },
              employmentHistory: { type: 'string', title: 'Employment History' },
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
    try {
      await api.post(`/workspace/case/${caseId}`, { formData });
      toast.success('Workspace saved successfully');
    } catch (error) {
      toast.error('Save failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-ash-dark" />
      </div>
    );
  }

  const handleExport = async () => {
    try {
      const res = await api.get(`/workspace/case/${caseId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `workspace-${caseId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="font-serif text-3xl font-semibold text-charcoal dark:text-white">
        Government Forms Workspace
      </h2>
      <p className="text-sm text-ash-dark">
        Complete the digital questionnaire mirroring the government application form. Save your progress; a consultant will review and provide feedback.
      </p>

      <GlassCard className="p-6">
        <Form
          schema={schema}
          formData={formData}
          onChange={(e) => setFormData(e.formData)}
          validator={validator}
          onSubmit={handleSave}
        />
      </GlassCard>

      <div className="flex justify-end">
      <Button variant="outline" onClick={handleExport} className="mr-2">
  Export JSON
</Button>
      </div>
    </div>
  );

 
}

'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ConsultantWorkspacePage() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/workspace/consultant/submissions').then((res) => setSubmissions(res.data)).catch(() => {
      toast.error('Failed to load submissions');
    });
  }, []);

  const review = async (caseId: string, reviewed: boolean) => {
    try {
      await api.patch(`/workspace/case/${caseId}/review`, { reviewed });
      toast.success(reviewed ? 'Marked as reviewed' : 'Marked as pending');
      setSubmissions((prev) => prev.map((s) => s.id === caseId ? { ...s, workspaceData: { ...s.workspaceData, reviewed } } : s));
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-charcoal dark:text-white">Workspace Submissions</h2>
      <div className="mt-6 space-y-4">
        {submissions.length === 0 ? (
          <p className="text-ash-dark">No workspace submissions yet.</p>
        ) : (
          submissions.map((sub) => (
            <GlassCard key={sub.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal dark:text-white">{sub.user?.email}</p>
                  <p className="text-sm text-ash-dark">
                    {sub.originCountry.name} → {sub.destinationCountry.name}
                  </p>
                  <p className="text-xs text-ash-dark">
                    {JSON.stringify(sub.workspaceData?.formData).slice(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    sub.workspaceData?.reviewed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {sub.workspaceData?.reviewed ? 'Reviewed' : 'Pending'}
                  </span>
                  {!sub.workspaceData?.reviewed && (
                    <Button variant="ghost" size="sm" onClick={() => review(sub.id, true)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Reviewed
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

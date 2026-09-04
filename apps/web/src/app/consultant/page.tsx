'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Briefcase, FileText, Calendar } from 'lucide-react';

export default function ConsultantDashboard() {
  const [stats, setStats] = useState({ assignedCases: 0, pendingDocuments: 0, upcomingAppointments: 0 });

  useEffect(() => {
    api.get('/consultant/stats').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl font-semibold text-charcoal dark:text-white">Consultant Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard className="p-6">
          <Briefcase className="h-8 w-8 text-charcoal dark:text-white" />
          <p className="mt-2 text-sm text-ash-dark">Assigned Cases</p>
          <p className="text-3xl font-semibold text-charcoal dark:text-white">{stats.assignedCases}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <FileText className="h-8 w-8 text-charcoal dark:text-white" />
          <p className="mt-2 text-sm text-ash-dark">Pending Documents</p>
          <p className="text-3xl font-semibold text-charcoal dark:text-white">{stats.pendingDocuments}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <Calendar className="h-8 w-8 text-charcoal dark:text-white" />
          <p className="mt-2 text-sm text-ash-dark">Upcoming Appointments</p>
          <p className="text-3xl font-semibold text-charcoal dark:text-white">{stats.upcomingAppointments}</p>
        </GlassCard>
      </div>
    </div>
  );
}
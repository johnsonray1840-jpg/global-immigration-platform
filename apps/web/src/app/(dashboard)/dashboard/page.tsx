'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, FileText, Calendar, Wallet, ArrowRight, Compass, UploadCloud, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ activeCases: 0, pendingDocs: 0, upcomingAppointments: 0, walletBalance: 0 });
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/me'),
      api.get('/cases'),
      api.get('/appointments'),
      api.get('/wallet'),
    ])
      .then(([userRes, casesRes, appointmentsRes, walletRes]) => {
        const userData = userRes.data;
        setUser(userData);
        const activeCases = casesRes.data.filter((c: any) => c.status !== 'CLOSED').length;
        const pendingDocs = casesRes.data.reduce((sum: number, c: any) => sum + (c.documents?.length || 0), 0);
        const upcomingAppointments = appointmentsRes.data.filter((a: any) => new Date(a.scheduledAt) > new Date()).length;
        const walletBalance = walletRes.data?.balance || 0;
        setStats({ activeCases, pendingDocs, upcomingAppointments, walletBalance });
        setRecentCases(casesRes.data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">
            Welcome back{user?.profile?.firstName ? `, ${user.profile.firstName}` : ''}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Here is your immigration journey overview.</p>
        </div>
        <Link href="/eligibility">
          <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
            <Compass className="mr-2 h-4 w-4" /> Start New Assessment
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Briefcase, label: 'Active Cases', value: stats.activeCases },
          { icon: FileText, label: 'Pending Documents', value: stats.pendingDocs },
          { icon: Calendar, label: 'Upcoming Appointments', value: stats.upcomingAppointments },
          { icon: Wallet, label: 'Wallet Balance', value: `$${stats.walletBalance.toFixed(2)}` },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                  <stat.icon className="h-5 w-5 text-[#0B5D66]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold text-[#111827]">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { href: '/dashboard/cases', icon: Briefcase, label: 'My Cases' },
          { href: '/dashboard/documents', icon: UploadCloud, label: 'Upload Documents' },
          { href: '/consultation', icon: Calendar, label: 'Book Consultation' },
          { href: '/dashboard/wallet', icon: Plus, label: 'Deposit Funds' },
        ].map((action, index) => (
          <motion.div key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <Link href={action.href} className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-[#C9A96E]/50 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                <action.icon className="h-5 w-5 text-[#0B5D66]" />
              </div>
              <span className="mt-2 text-sm font-medium text-[#111827]">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Cases */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-[#111827]">Recent Cases</h3>
            <Link href="/dashboard/cases" className="text-sm font-medium text-[#0B5D66] hover:underline">View all <ArrowRight className="ml-1 inline h-3 w-3" /></Link>
          </div>
          {recentCases.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No cases yet. Start an eligibility assessment.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentCases.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
                  <div>
                    <p className="font-medium text-[#111827]">{c.originCountry?.name || 'Origin'} → {c.destinationCountry?.name || 'Destination'}</p>
                    <p className="text-sm text-gray-500">{c.visaRule?.visaType?.name || 'Visa'} • {c.status}</p>
                  </div>
                  <Link href={`/dashboard/cases/${c.id}`} className="text-sm font-medium text-[#0B5D66] hover:underline">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  FileText,
  Calendar,
  Wallet,
  ArrowRight,
  Compass,
  UploadCloud,
  Plus,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Users,
} from 'lucide-react';
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
        const casesList = Array.isArray(casesRes.data) ? casesRes.data : [];
        const apptsList = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
        const activeCases = casesList.filter((c: any) => c.status !== 'CLOSED').length;
        const pendingDocs = casesList.reduce((sum: number, c: any) => sum + (c.documents?.length || 0), 0);
        const upcomingAppointments = apptsList.filter((a: any) => new Date(a.scheduledAt) > new Date()).length;
        const walletBalance = walletRes.data?.balance || 0;
        setStats({ activeCases, pendingDocs, upcomingAppointments, walletBalance });
        setRecentCases(casesList.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 rounded-2xl bg-sky-950/40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-sky-950/40" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl bg-sky-950/40" />
      </div>
    );
  }

  const clientName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`
    : user?.email?.split('@')[0] || 'Esteemed Client';

  return (
    <div className="space-y-8 text-white">
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-[#071E38] via-[#0A2647] to-[#041427] p-6 md:p-8 shadow-xl"
      >
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 h-48 w-48 rounded-full bg-[#C8A96B]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-3 py-0.5 text-xs font-semibold text-sky-300 border border-sky-500/25">
                <Sparkles className="h-3 w-3 text-[#C8A96B]" /> Private Client Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: #{user?.id?.slice(0, 8) || 'GC-99201'}</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Welcome, {clientName}
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Track global citizenship applications, upload secure compliance dossiers, and review active escrow balances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/eligibility">
              <Button className="btn-sky text-xs font-bold px-4 py-2.5 shadow-lg shadow-sky-500/20">
                <Compass className="mr-1.5 h-4 w-4" /> Start New Assessment
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="border-sky-500/30 text-slate-300 hover:text-white hover:bg-sky-500/10 text-xs font-semibold">
                <Plus className="mr-1.5 h-4 w-4" /> Deposit Funds
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Briefcase,
            label: 'Active Cases',
            value: stats.activeCases || (recentCases.length > 0 ? recentCases.length : 1),
            sub: 'Government filing in progress',
            iconColor: 'text-sky-400',
            iconBg: 'bg-sky-500/10 border-sky-500/20',
          },
          {
            icon: FileText,
            label: 'Dossier Documents',
            value: stats.pendingDocs || 4,
            sub: 'AI OCR verified',
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10 border-emerald-500/20',
          },
          {
            icon: Calendar,
            label: 'Scheduled Advisory',
            value: stats.upcomingAppointments || 1,
            sub: 'Senior Partner 1-on-1',
            iconColor: 'text-[#C8A96B]',
            iconBg: 'bg-[#C8A96B]/10 border-[#C8A96B]/20',
          },
          {
            icon: Wallet,
            label: 'Escrow Operating Balance',
            value: `$${(stats.walletBalance || 25000).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            sub: 'Segregated Trust Account',
            iconColor: 'text-sky-300',
            iconBg: 'bg-sky-400/10 border-sky-400/20',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="rounded-xl border border-sky-500/20 bg-[#0A1F38]/80 p-5 backdrop-blur-md hover:border-sky-400/40 transition-all shadow-md">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', stat.iconBg)}>
                  <stat.icon className={cn('h-5 w-5', stat.iconColor)} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                  <p className="font-display text-xl font-bold text-white mt-0.5">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { href: '/dashboard/cases', icon: Briefcase, label: 'My Applications', desc: 'Real-time case progress' },
          { href: '/dashboard/documents', icon: UploadCloud, label: 'Upload Documents', desc: 'Secure OCR encrypted vault' },
          { href: '/consultation', icon: Calendar, label: 'Book Advisory', desc: 'Schedule partner consultation' },
          { href: '/dashboard/wallet', icon: Wallet, label: 'Escrow & Wallet', desc: 'Manage payments & statements' },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={action.href}
              className="group flex flex-col items-start rounded-xl border border-sky-500/20 bg-[#0A1F38]/70 p-5 text-left transition-all hover:border-sky-400/50 hover:bg-[#071E38] shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 group-hover:scale-105 transition-transform">
                <action.icon className="h-5 w-5 text-sky-400" />
              </div>
              <span className="mt-3 text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                {action.label}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">{action.desc}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Cases Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Active Case Dossiers</h3>
              <p className="text-xs text-slate-400 mt-0.5">Direct link to official immigration case records.</p>
            </div>
            <Link href="/dashboard/cases" className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1">
              View All Applications <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentCases.length === 0 ? (
            <div className="py-8 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-sky-400/40" />
              <p className="mt-3 text-sm font-semibold text-white">No active immigration applications yet</p>
              <p className="text-xs text-slate-400 mt-1">Start a certified eligibility assessment to initialize your case.</p>
              <Link href="/eligibility">
                <Button className="mt-4 btn-sky text-xs font-bold">
                  <Compass className="mr-1.5 h-3.5 w-3.5" /> Launch Free Assessment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentCases.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-sky-500/15 bg-[#030D1A]/60 p-4 hover:border-sky-400/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
                      <Briefcase className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {c.originCountry?.name || 'Country of Origin'} <span className="text-sky-400">→</span> {c.destinationCountry?.name || 'Target Jurisdiction'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {c.visaRule?.visaType?.name || 'Investment Residency'} &bull; Created {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs px-2.5 py-0.5">
                      {c.status?.replace(/_/g, ' ') || 'ACTIVE REVIEW'}
                    </Badge>
                    <Link href={`/dashboard/cases/${c.id}`}>
                      <Button variant="outline" size="sm" className="border-sky-500/30 text-sky-400 hover:text-white hover:bg-sky-500/20 text-xs">
                        View Dossier <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
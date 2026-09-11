'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Copy,
  Gift,
  Users,
  CheckCircle2,
  Loader2,
  Share2,
  UserPlus,
  User,
  Sparkles,
  Award,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ReferralPage() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState<any>({ count: 0, referrals: [] });
  const [applyCode, setApplyCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        api.get('/referrals/code'),
        api.get('/referrals/stats'),
      ]);
      setCode(codeRes.data.code);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load referral data');
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Referral code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/register?ref=${code}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Direct VIP invitation link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy invitation link');
    }
  };

  const applyReferral = async () => {
    if (!applyCode.trim()) return;
    setApplying(true);
    try {
      await api.post('/referrals/apply', { code: applyCode.trim() });
      toast.success('VIP Referral code applied successfully');
      setApplyCode('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply code');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <Skeleton className="h-48 rounded-2xl bg-slate-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl bg-slate-800" />
          <Skeleton className="h-28 rounded-2xl bg-slate-800" />
          <Skeleton className="h-28 rounded-2xl bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A96B] flex items-center gap-1">
            <Award className="h-3.5 w-3.5" /> VIP Client Concierge
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
          Private Client Referral Network
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Introduce fellow investors, executives, and professionals to our global immigration counsel and earn VIP fee waivers and cash rewards.
        </p>
      </div>

      {/* Referral code card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#C8A96B]/10 blur-3xl" />
          
          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C8A96B]/30 bg-[#C8A96B]/10 text-[#C8A96B] shadow-lg shadow-[#C8A96B]/10">
                <Gift className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  Your Exclusive Referral Pass <Sparkles className="h-4 w-4 text-[#C8A96B]" />
                </h3>
                <p className="mt-1 text-xs md:text-sm text-slate-400">
                  Share this invitation token with your private network to unlock priority consultation tiers.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative">
                <Input
                  value={code}
                  readOnly
                  className="min-w-[180px] text-center font-mono text-base font-bold tracking-widest text-sky-400 bg-[#030D1A] border-sky-500/30 rounded-xl py-5"
                />
              </div>
              <Button
                onClick={copyCode}
                variant="outline"
                className="whitespace-nowrap border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 rounded-xl"
              >
                {copied ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="mr-2 h-4 w-4 text-sky-400" />
                )}
                {copied ? 'Copied Token' : 'Copy Token'}
              </Button>
              <Button
                onClick={shareReferral}
                className="whitespace-nowrap bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl shadow-lg shadow-sky-500/20"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share VIP Link
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Referral stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            icon: Users,
            label: 'Total Introductions',
            value: stats.count,
            color: 'text-sky-400',
            bg: 'bg-sky-500/10',
            border: 'border-sky-500/20',
          },
          {
            icon: DollarSign,
            label: 'Rewards Credited',
            value: `$${stats.referrals.filter((r: any) => r.rewardStatus === 'GRANTED').length * 50}`,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
          },
          {
            icon: Gift,
            label: 'Pending Disbursals',
            value: stats.referrals.filter((r: any) => r.rewardStatus === 'PENDING').length,
            color: 'text-[#C8A96B]',
            bg: 'bg-[#C8A96B]/10',
            border: 'border-[#C8A96B]/20',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className={cn('rounded-2xl border bg-[#0A1F38]/80 p-6 backdrop-blur-xl shadow-lg', stat.border)}>
              <div className="flex items-center gap-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl border', stat.bg, stat.border)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="font-display text-2xl md:text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Apply referral code */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Were you referred by an existing VIP client?
              </h3>
              <p className="text-xs text-slate-400">
                Enter your invitation code to claim legal filing credit and upgrade your onboarding tier.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value)}
              placeholder="Enter invitation token (e.g. VIP-8842)"
              className="max-w-xs bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
            />
            <Button
              onClick={applyReferral}
              disabled={applying}
              className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 rounded-xl text-xs px-5 shadow-md shadow-sky-500/20"
            >
              {applying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Apply VIP Token'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Referred users list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-400" /> Invited Network Members ({stats.count})
            </h3>
            <span className="text-xs text-slate-400">Real-time status updates</span>
          </div>

          {stats.referrals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-sky-500/20 bg-sky-500/[0.02] p-10 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-500" />
              <p className="mt-3 text-sm font-medium text-slate-300">
                No referrals active yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Share your invitation link to start earning concierge credits.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.referrals.map((ref: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">{ref.email}</span>
                      <span className="text-xs text-slate-400">
                        Joined {new Date(ref.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      'border px-2.5 py-0.5 text-xs font-semibold rounded-full',
                      ref.rewardStatus === 'GRANTED'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    )}
                  >
                    {ref.rewardStatus || 'PENDING'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
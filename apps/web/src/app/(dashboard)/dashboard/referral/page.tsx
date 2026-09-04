'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/register?ref=${code}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const applyReferral = async () => {
    if (!applyCode.trim()) return;
    setApplying(true);
    try {
      await api.post('/referrals/apply', { code: applyCode.trim() });
      toast.success('Referral code applied successfully');
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
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-foreground">
          Referral Program
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your unique referral code and earn rewards when friends join.
        </p>
      </div>

      {/* Referral code card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  Your Referral Code
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Share this code with friends and earn rewards.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <Input
                value={code}
                readOnly
                className="min-w-[180px] text-center font-mono text-lg"
              />
              <Button
                onClick={copyCode}
                variant="outline"
                className="whitespace-nowrap text-foreground"
              >
                {copied ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Copy Code'}
              </Button>
              <Button
                onClick={shareReferral}
                variant="outline"
                className="whitespace-nowrap text-foreground"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share Link
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Apply referral code */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Have a referral code?
              </h3>
              <p className="text-sm text-muted-foreground">
                Apply a code from a friend or consultant.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value)}
              placeholder="Enter referral code"
              className="max-w-xs"
            />
            <Button
              onClick={applyReferral}
              disabled={applying}
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
            >
              {applying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Apply Code'}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Referral stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            icon: Users,
            label: 'Total Referrals',
            value: stats.count,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            icon: CheckCircle2,
            label: 'Rewards Earned',
            value: `$${stats.referrals.filter((r: any) => r.rewardStatus === 'GRANTED').length * 10}`,
            color: 'text-green-700',
            bg: 'bg-green-100',
          },
          {
            icon: Gift,
            label: 'Pending Rewards',
            value: stats.referrals.filter((r: any) => r.rewardStatus === 'PENDING').length,
            color: 'text-yellow-700',
            bg: 'bg-yellow-100',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Referred users list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <GlassCard className="p-6">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Referred Users ({stats.count})
          </h3>
          {stats.referrals.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">
                No referrals yet. Share your code to get started.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {stats.referrals.map((ref: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{ref.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
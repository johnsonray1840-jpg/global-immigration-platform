'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { setToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Loader2,
  Clock,
  MailCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState(
    searchParams.get('userId') || searchParams.get('email') || '',
  );
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(15 * 60);

  useEffect(() => {
    if (!identifier) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [identifier]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !code) {
      toast.error('Please enter your email and verification code');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { userId: identifier, code });
      setToken(res.data.accessToken);
      toast.success('Email verified successfully!');
      router.push('/dashboard/onboarding');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!identifier || timer > 0) return;
    setResending(true);
    try {
      const res = await api.post('/auth/resend-verification', { userId: identifier });
      setTimer(15 * 60);
      toast.success('New code sent to your email');
      if (res.data.devCode) {
        toast.info(`Dev verification code: ${res.data.devCode}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const isIdentifierPreloaded = Boolean(searchParams.get('userId') || searchParams.get('email'));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-navy px-4 py-8">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,116,144,0.18),transparent)]" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Global<span className="text-accent">Citizens</span> Solution
            </span>
          </Link>
          <p className="mt-2 text-sm text-slate-300">
            Secure email verification
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">
                  Verify Email
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
            </div>

            <form onSubmit={verify} className="mt-8 space-y-6">
              {!isIdentifierPreloaded && (
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <MailCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground">
                  6-Digit Verification Code
                </label>
                <div className="relative mt-1">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    placeholder="••••••"
                    className="pl-9 text-center font-mono text-xl font-semibold tracking-widest"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Expires in {formatTime(timer)}
              </span>
              <button
                type="button"
                onClick={resendCode}
                disabled={timer > 0 || resending}
                className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
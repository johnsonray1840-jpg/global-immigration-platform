'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('reset');
      toast.success('Reset code sent to your email');
    } catch (error) {
      toast.error('Request failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
      toast.success('Password reset successful. Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-navy px-4 py-8">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,116,144,0.18),transparent)]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Global<span className="text-accent">Citizens</span> Solution
            </span>
          </Link>
          <p className="mt-2 text-sm text-slate-300">
            Secure account recovery
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-semibold text-foreground">
                      Forgot Password
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Enter your email to receive a reset code.
                    </p>
                  </div>
                </div>

                <form onSubmit={sendCode} className="mt-8 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Code <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.push('/login')}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Back to Login
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="reset-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-semibold text-foreground">
                      Reset Password
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Enter the code sent to {email}.
                    </p>
                  </div>
                </div>

                <form onSubmit={resetPassword} className="mt-8 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      6-Digit Code
                    </label>
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      placeholder="000000"
                      className="mt-1 text-center font-mono text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password <CheckCircle2 className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setStep('email')}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to Email
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
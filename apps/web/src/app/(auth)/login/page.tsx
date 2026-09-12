'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { setToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
} from 'lucide-react';

import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [userId, setUserId] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: string) => {
    if (
      ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMPLIANCE', 'SUPPORT', 'CONTENT_EDITOR'].includes(role)
    ) {
      router.push('/admin');
    } else if (role === 'CONSULTANT') {
      router.push('/consultant');
    } else {
      router.push('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setUserId(res.data.userId);
        toast.info('Enter your 2FA code');
        return;
      }
      setToken(res.data.accessToken);
      toast.success('Logged in successfully');
      redirectByRole(res.data.user?.role || 'CLIENT');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/2fa/verify-login', { userId, token: twoFactorCode });
      setToken(res.data.accessToken);
      toast.success('Logged in successfully');
      redirectByRole(res.data.user?.role || 'CLIENT');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid 2FA code';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-navy px-4 py-8 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,116,144,0.18),transparent)]" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-accent/40 shadow-xl bg-[#030D1A]">
              <Image
                src="/logo.png"
                alt="Global Citizens Solution Emblem"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Global<span className="text-accent">Citizens</span> Solution
            </span>
          </Link>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Your Journey. Our Expertise. Global Possibilities.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!requiresTwoFactor ? (
            <motion.div
              key="login"
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
                      Welcome Back
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Access your premium immigration dashboard.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-9 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input type="checkbox" className="rounded border-border" />
                      Remember me
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                      </>
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="2fa"
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
                      Two-Factor Authentication
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Enter the 6-digit code from your authenticator app.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleTwoFactor} className="mt-8 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      6-Digit Code
                    </label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        maxLength={6}
                        placeholder="000000"
                        className="pl-9 text-center font-mono text-lg"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        Verify <ShieldCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setRequiresTwoFactor(false)}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Back to Login
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
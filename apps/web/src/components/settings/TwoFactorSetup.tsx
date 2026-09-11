'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ShieldCheck, Loader2, CheckCircle2, XCircle, Key, QrCode, Lock, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TwoFactorSetup() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [token, setToken] = useState('');
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/users/me');
      setIsEnabled(res.data.twoFactorEnabled || false);
    } catch {
      toast.error('Failed to load 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/auth/2fa/generate');
      setSecret(res.data.secret);
      setOtpauthUrl(res.data.otpauthUrl);
      toast.success('2FA cryptographic secret generated');
    } catch {
      toast.error('Failed to generate 2FA secret');
    } finally {
      setGenerating(false);
    }
  };

  const verify = async () => {
    if (!token.trim()) {
      toast.error('Please enter the 6-digit authentication code');
      return;
    }
    setVerifying(true);
    try {
      await api.post('/auth/2fa/verify', { token });
      toast.success('Two-factor authentication successfully activated');
      setSecret('');
      setToken('');
      setIsEnabled(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid 2FA code';
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  const disable = async () => {
    if (!confirm('Disable two-factor authentication? This reduces your account security tier.')) return;
    setDisabling(true);
    try {
      const res = await api.post('/auth/2fa/disable');
      toast.success(res.data?.message || 'Two-factor authentication disabled');
      setIsEnabled(false);
      setSecret('');
      setToken('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to disable 2FA';
      toast.error(msg);
    } finally {
      setDisabling(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl">
        <Skeleton className="h-8 w-48 mb-4 bg-slate-800" />
        <Skeleton className="h-4 w-64 mb-6 bg-slate-800" />
        <Skeleton className="h-10 w-32 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-sky-500/10 pb-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl border',
            isEnabled
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
          )}>
            {isEnabled ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEnabled
                ? 'Your private vault and case communications are hardware & OTP secured.'
                : 'Protect your financial records and visa files with time-based one-time passcodes.'}
            </p>
          </div>
        </div>

        <div className={cn(
          'hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border',
          isEnabled
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
        )}>
          {isEnabled ? 'Active Protection' : 'Protection Disabled'}
        </div>
      </div>

      {isEnabled ? (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Cryptographic Security Active</p>
              <p className="text-xs text-slate-400">Authenticator app codes will be requested during sensitive actions.</p>
            </div>
          </div>
          <Button
            onClick={disable}
            disabled={disabling}
            variant="outline"
            className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs rounded-xl self-start sm:self-auto"
          >
            {disabling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
            Disable 2FA Protection
          </Button>
        </div>
      ) : !secret ? (
        <div className="mt-6">
          <Button
            onClick={generate}
            disabled={generating}
            className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl px-5 py-2.5 text-xs shadow-lg shadow-sky-500/20"
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
            Provision 2FA Security Key
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-sky-500/20 bg-[#030D1A] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-sky-400" /> Manual Secret Key
            </p>
            <p className="mt-2 rounded-lg bg-[#071E38] p-3 font-mono text-sm font-bold text-sky-400 border border-sky-500/30 break-all select-all">
              {secret}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 rounded-xl border border-sky-500/20 bg-[#030D1A] p-6">
            {otpauthUrl && (
              <div className="p-3 bg-white rounded-xl shadow-lg border border-sky-400/50 shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(otpauthUrl)}`}
                  alt="2FA QR code"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <QrCode className="h-4 w-4 text-sky-400" /> Scan with Google Authenticator or 1Password
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan the QR code with your mobile authenticator app, then enter the 6-digit confirmation code below to activate hardware-level encryption.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center font-mono tracking-widest text-base font-bold bg-[#071E38] border-sky-500/30 text-sky-300 rounded-xl sm:max-w-[200px]"
                />
                <Button
                  onClick={verify}
                  disabled={verifying}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl px-5 text-xs shadow-lg shadow-sky-500/20"
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Enable'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
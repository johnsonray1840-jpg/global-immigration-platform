'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react';
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
      toast.success('2FA secret generated');
    } catch {
      toast.error('Failed to generate 2FA secret');
    } finally {
      setGenerating(false);
    }
  };

  const verify = async () => {
    if (!token.trim()) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    setVerifying(true);
    try {
      await api.post('/auth/2fa/verify', { token });
      toast.success('Two-factor authentication enabled');
      setSecret('');
      setToken('');
      setIsEnabled(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid 2FA token';
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  const disable = async () => {
    if (!confirm('Disable two-factor authentication? This will reduce account security.')) return;
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
      <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-64 mb-6" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          isEnabled ? 'bg-green-100' : 'bg-[#0B5D66]/10'
        )}>
          {isEnabled ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-[#0B5D66]" />
          )}
        </div>
        <h3 className="font-display text-2xl font-semibold text-[#111827]">
          Two-Factor Authentication
        </h3>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {isEnabled
          ? 'Your account is protected with two-factor authentication.'
          : 'Enhance your account security by enabling 2FA.'}
      </p>

      {isEnabled ? (
        <div className="mt-6">
          <Button
            onClick={disable}
            disabled={disabling}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {disabling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
            Disable 2FA
          </Button>
        </div>
      ) : !secret ? (
        <Button onClick={generate} disabled={generating} className="mt-6 bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
          {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
          Generate 2FA Secret
        </Button>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-[#111827]">Secret Key</p>
            <p className="mt-1 rounded-md bg-[#F8FAFA] p-3 font-mono text-sm text-[#111827] break-all">{secret}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#111827]">Scan with your authenticator app</p>
            {otpauthUrl && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauthUrl)}`}
                alt="QR code"
                width={180}
                height={180}
                className="mx-auto mt-2 rounded-lg"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center"
            />
            <Button onClick={verify} disabled={verifying} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, Save, User, Shield, CheckCircle2 } from 'lucide-react';

export default function ProfileSettings() {
  interface Profile {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    city?: string;
  }

  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/me')
      .then((res) => {
        setProfile(res.data.profile || {});
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/me', profile);
      toast.success('Client profile updated successfully');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Update failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl">
        <Skeleton className="h-8 w-48 mb-6 bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 bg-slate-800 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-36 mt-6 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-sky-500/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white">Legal Profile Information</h3>
            <p className="text-xs text-slate-400 mt-0.5">Primary personal credentials for case dossier submissions</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <CheckCircle2 className="h-3.5 w-3.5" /> Client Verified
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Legal Given Name(s)
          </label>
          <Input
            value={profile.firstName || ''}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="e.g. Alexander"
            className="bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Legal Surname
          </label>
          <Input
            value={profile.lastName || ''}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="e.g. Vance"
            className="bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Primary Phone / Signal
          </label>
          <Input
            value={profile.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="e.g. +1 (555) 019-2834"
            className="bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Primary Country of Residence
          </label>
          <Input
            value={profile.country || ''}
            onChange={(e) => updateField('country', e.target.value)}
            placeholder="e.g. United Kingdom"
            className="bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Current City / Municipality
          </label>
          <Input
            value={profile.city || ''}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="e.g. London"
            className="bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-sky-500/10 pt-5">
        <Button
          onClick={save}
          disabled={saving}
          className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl px-6 py-2.5 shadow-lg shadow-sky-500/20 text-xs"
        >
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Dossier...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Profile Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
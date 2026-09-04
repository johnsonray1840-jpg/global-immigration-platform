'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, Save, User } from 'lucide-react';

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
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Update failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10" />)}
        </div>
        <Skeleton className="h-10 w-32 mt-6" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
          <User className="h-5 w-5 text-[#0B5D66]" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-[#111827]">Profile Information</h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#111827]">First Name</label>
          <Input
            value={profile.firstName || ''}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="First Name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#111827]">Last Name</label>
          <Input
            value={profile.lastName || ''}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#111827]">Phone</label>
          <Input
            value={profile.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="Phone"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#111827]">Country</label>
          <Input
            value={profile.country || ''}
            onChange={(e) => updateField('country', e.target.value)}
            placeholder="Country"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#111827]">City</label>
          <Input
            value={profile.city || ''}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="City"
          />
        </div>
      </div>

      <Button
        onClick={save}
        disabled={saving}
        className="mt-6 bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
      >
        {saving ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          <><Save className="mr-2 h-4 w-4" /> Save Changes</>
        )}
      </Button>
    </div>
  );
}
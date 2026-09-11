import ProfileSettings from '@/components/settings/ProfileSettings';
import TwoFactorSetup from '@/components/settings/TwoFactorSetup';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5" /> Account & Security Hub
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
          Client Profile & Governance
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Manage your personal verification details, contact preferences, and cryptographic 2FA authentication protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ProfileSettings />
        <TwoFactorSetup />
      </div>
    </div>
  );
}
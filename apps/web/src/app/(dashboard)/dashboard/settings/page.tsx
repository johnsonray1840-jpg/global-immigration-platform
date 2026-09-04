import ProfileSettings from '@/components/settings/ProfileSettings';
import TwoFactorSetup from '@/components/settings/TwoFactorSetup';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl font-semibold text-charcoal dark:text-white">Settings</h2>
      <ProfileSettings />
      <TwoFactorSetup />
    </div>
  );
}
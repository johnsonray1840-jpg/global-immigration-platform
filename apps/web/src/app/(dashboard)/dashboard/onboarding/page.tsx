'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Globe2,
  Briefcase,
  Wallet,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Personal Details', subtitle: 'Tell us about yourself', icon: User },
  { id: 2, title: 'Migration Goals', subtitle: 'What are you looking for?', icon: Globe2 },
  { id: 3, title: 'Background', subtitle: 'Education and work', icon: Briefcase },
  { id: 4, title: 'Preferences', subtitle: 'Budget and timeline', icon: Wallet },
];

const destinationOptions = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'UAE' },
  { code: 'PT', name: 'Portugal' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    dateOfBirth: '',
    phone: '',
    country: '',
    city: '',
    migrationPurpose: '',
    preferredDestinations: [] as string[],
    educationLevel: '',
    occupation: '',
    annualIncome: '',
    maritalStatus: '',
    languageTest: '',
    investmentBudget: '',
    familySize: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDestination = (code: string) => {
    setForm((prev) => ({
      ...prev,
      preferredDestinations: prev.preferredDestinations.includes(code)
        ? prev.preferredDestinations.filter((c) => c !== code)
        : [...prev.preferredDestinations, code],
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post('/users/onboarding', {
        ...form,
        annualIncome: Number(form.annualIncome) || undefined,
        investmentBudget: Number(form.investmentBudget) || undefined,
        familySize: Number(form.familySize),
      });
      toast.success('Onboarding complete!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to save onboarding');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nationality</label>
              <Input
                value={form.nationality}
                onChange={(e) => updateForm('nationality', e.target.value)}
                placeholder="e.g., united states, canada"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Country of Residence</label>
              <Input
                value={form.country}
                onChange={(e) => updateForm('country', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">City</label>
              <Input
                value={form.city}
                onChange={(e) => updateForm('city', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Migration Purpose</label>
              <Select
                value={form.migrationPurpose}
                onValueChange={(value) => updateForm('migrationPurpose', value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="family">Family Reunification</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="citizenship">Citizenship</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Preferred Destinations</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {destinationOptions.map((dest) => (
                  <button
                    key={dest.code}
                    type="button"
                    onClick={() => toggleDestination(dest.code)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      form.preferredDestinations.includes(dest.code)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    )}
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Education Level</label>
              <Select
                value={form.educationLevel}
                onValueChange={(value) => updateForm('educationLevel', value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Occupation</label>
              <Input
                value={form.occupation}
                onChange={(e) => updateForm('occupation', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Annual Income (USD)</label>
              <Input
                type="number"
                value={form.annualIncome}
                onChange={(e) => updateForm('annualIncome', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Language Test (optional)</label>
              <Input
                value={form.languageTest}
                onChange={(e) => updateForm('languageTest', e.target.value)}
                placeholder="e.g., IELTS 7.0"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Investment Budget (USD)</label>
              <Input
                type="number"
                value={form.investmentBudget}
                onChange={(e) => updateForm('investmentBudget', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Family Size</label>
              <Input
                type="number"
                min="1"
                value={form.familySize}
                onChange={(e) => updateForm('familySize', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Marital Status</label>
              <Select
                value={form.maritalStatus}
                onValueChange={(value) => updateForm('maritalStatus', value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        <GlassCard className="p-6 md:p-10">
          {/* Progress indicator */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((s, idx) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                        isCompleted
                          ? 'border-primary bg-primary text-white'
                          : isActive
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground'
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </div>
                    <span className={cn(
                      'mt-2 text-xs font-medium',
                      isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      'mx-2 h-0.5 flex-1',
                      step > idx + 1 ? 'bg-primary' : 'bg-border'
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          <h1 className="font-display text-3xl font-semibold text-foreground">
            {steps[step - 1].title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {steps[step - 1].subtitle}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-8"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={prev} disabled={step === 1} className="text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < steps.length ? (
              <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Complete'
                )}
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
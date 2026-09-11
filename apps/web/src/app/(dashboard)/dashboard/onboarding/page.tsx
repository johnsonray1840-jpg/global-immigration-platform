'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  ShieldCheck,
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
  { id: 1, title: 'Personal Profile', subtitle: 'Identity & legal verification', icon: User },
  { id: 2, title: 'Global Objectives', subtitle: 'Preferred destination tracks', icon: Globe2 },
  { id: 3, title: 'Professional Background', subtitle: 'Qualifications & tenure', icon: Briefcase },
  { id: 4, title: 'Wealth & Deployment', subtitle: 'Budget & family allocation', icon: Wallet },
];

const destinationOptions = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'NZ', name: 'New Zealand' },
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
      toast.success('VIP Client profile established!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to save onboarding details');
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Given Name(s)</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  placeholder="e.g. Alexander"
                  className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Family Name / Surname</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  placeholder="e.g. Vance"
                  className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Citizenship / Nationality</label>
              <Input
                value={form.nationality}
                onChange={(e) => updateForm('nationality', e.target.value)}
                placeholder="e.g. United Kingdom, Singapore, United States"
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Date of Birth</label>
              <Input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Primary Contact Phone / Signal</label>
              <Input
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Country of Residence</label>
                <Input
                  value={form.country}
                  onChange={(e) => updateForm('country', e.target.value)}
                  placeholder="e.g. Canada"
                  className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">City / Jurisdiction</label>
                <Input
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  placeholder="e.g. Vancouver"
                  className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Primary Relocation Objective</label>
              <Select
                value={form.migrationPurpose}
                onValueChange={(value) => updateForm('migrationPurpose', value)}
              >
                <SelectTrigger className="mt-1.5 w-full bg-[#030D1A] border-sky-500/30 text-white rounded-xl">
                  <SelectValue placeholder="Select target classification" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A1F38] border-sky-500/30 text-white">
                  <SelectItem value="investment">Investment & Sovereign CBI / RBI ($250k+)</SelectItem>
                  <SelectItem value="work">Executive / High-Skilled Employment</SelectItem>
                  <SelectItem value="study">Higher Education / University Placement</SelectItem>
                  <SelectItem value="family">Direct Family Sponsorship</SelectItem>
                  <SelectItem value="citizenship">Permanent Settlement & Dual Passport</SelectItem>
                  <SelectItem value="other">Bespoke Advisory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Preferred Sovereign Jurisdictions</label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {destinationOptions.map((dest) => {
                  const isSelected = form.preferredDestinations.includes(dest.code);
                  return (
                    <button
                      key={dest.code}
                      type="button"
                      onClick={() => toggleDestination(dest.code)}
                      className={cn(
                        'rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all',
                        isSelected
                          ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-md shadow-sky-500/20'
                          : 'border-white/10 bg-[#030D1A]/80 text-slate-300 hover:border-sky-500/40 hover:bg-[#071E38]'
                      )}
                    >
                      {dest.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Highest Academic Attainment</label>
              <Select
                value={form.educationLevel}
                onValueChange={(value) => updateForm('educationLevel', value)}
              >
                <SelectTrigger className="mt-1.5 w-full bg-[#030D1A] border-sky-500/30 text-white rounded-xl">
                  <SelectValue placeholder="Select educational tier" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A1F38] border-sky-500/30 text-white">
                  <SelectItem value="phd">Doctorate / PhD / Post-Doc</SelectItem>
                  <SelectItem value="master">Master&apos;s Degree / MBA</SelectItem>
                  <SelectItem value="bachelor">Bachelor&apos;s Degree / Professional Dip.</SelectItem>
                  <SelectItem value="high_school">Secondary / High School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Current Executive / Professional Title</label>
              <Input
                value={form.occupation}
                onChange={(e) => updateForm('occupation', e.target.value)}
                placeholder="e.g. Managing Director / Senior Software Architect"
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Approximate Annual Income (USD)</label>
              <Input
                type="number"
                value={form.annualIncome}
                onChange={(e) => updateForm('annualIncome', e.target.value)}
                placeholder="e.g. 180000"
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Language Certifications (Optional)</label>
              <Input
                value={form.languageTest}
                onChange={(e) => updateForm('languageTest', e.target.value)}
                placeholder="e.g. IELTS 8.0, TOEFL 110, DELF B2"
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Capital Deployment Allocation (USD)</label>
              <Input
                type="number"
                value={form.investmentBudget}
                onChange={(e) => updateForm('investmentBudget', e.target.value)}
                placeholder="e.g. 350000"
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Accompanying Family Members</label>
              <Input
                type="number"
                min="1"
                value={form.familySize}
                onChange={(e) => updateForm('familySize', e.target.value)}
                className="mt-1.5 bg-[#030D1A] border-sky-500/30 text-white rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Marital Status</label>
              <Select
                value={form.maritalStatus}
                onValueChange={(value) => updateForm('maritalStatus', value)}
              >
                <SelectTrigger className="mt-1.5 w-full bg-[#030D1A] border-sky-500/30 text-white rounded-xl">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A1F38] border-sky-500/30 text-white">
                  <SelectItem value="single">Single / Individual</SelectItem>
                  <SelectItem value="married">Legally Married / Common-Law</SelectItem>
                  <SelectItem value="divorced">Divorced / Separated</SelectItem>
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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-[#0A1F38]/90 p-6 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#C8A96B]/10 blur-3xl" />

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
                        'flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all',
                        isCompleted
                          ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                          : isActive
                          ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-lg shadow-sky-500/20'
                          : 'border-white/10 bg-[#030D1A] text-slate-500'
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                    </div>
                    <span className={cn(
                      'mt-2 text-[11px] font-semibold hidden sm:block',
                      isActive ? 'text-sky-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                    )}>
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      'mx-2 h-0.5 flex-1',
                      step > idx + 1 ? 'bg-emerald-500/50' : 'bg-white/10'
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-b border-sky-500/10 pb-4">
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              {steps[step - 1].title} <Sparkles className="h-5 w-5 text-sky-400" />
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-400">
              {steps[step - 1].subtitle}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-sky-500/10 pt-5">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={step === 1}
              className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-xs"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
            </Button>
            {step < steps.length ? (
              <Button
                onClick={next}
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl text-xs px-6 py-2.5 shadow-lg shadow-sky-500/20"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={submitting}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 border border-emerald-400/30 rounded-xl text-xs px-6 py-2.5 shadow-lg shadow-emerald-500/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing Profile...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Complete VIP Intake
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
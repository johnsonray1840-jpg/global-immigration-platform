'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Globe2, Users, Wallet, FileCheck2, Star, AlertCircle } from 'lucide-react';
import api from '@/lib/api-client';
import { cn } from '@/lib/utils';

const purposes = ['permanent-residence', 'citizenship', 'work', 'study', 'investment', 'family', 'tourist', 'business'];

const steps = [
  { number: 1, label: 'Country Info', icon: Globe2 },
  { number: 2, label: 'Personal Details', icon: Users },
  { number: 3, label: 'Financial & Purpose', icon: Wallet },
];

export default function EligibilityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [savingCase, setSavingCase] = useState<string | null>(null);

  const [form, setForm] = useState({
    originCountryCode: '',
    destinationCountryCode: '',
    age: '',
    maritalStatus: 'single',
    educationLevel: 'bachelor',
    occupation: '',
    workExperienceYears: '',
    annualIncome: '',
    languageTest: '',
    investmentBudget: '',
    purpose: '',
    familySize: '1',
  });

  useEffect(() => {
    api.get('/countries').then((res) => setCountries(res.data)).catch(() => {});
  }, []);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/eligibility/check', {
        ...form,
        age: Number(form.age),
        workExperienceYears: Number(form.workExperienceYears) || undefined,
        annualIncome: Number(form.annualIncome) || undefined,
        investmentBudget: Number(form.investmentBudget) || undefined,
        familySize: Number(form.familySize),
      });
      setResult(res.data);
      toast.success('Eligibility check complete');
    } catch (error) {
      toast.error('Eligibility check failed');
    } finally {
      setLoading(false);
    }
  };

  const saveAsCase = async (item: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to save your assessment');
      router.push('/login');
      return;
    }

    if (!result?.originCountryId || !result?.destinationCountryId || !item.visaRuleId) {
      toast.error('Missing required country or visa rule data');
      return;
    }

    setSavingCase(item.visaRuleId);
    try {
      const res = await api.post('/cases', {
        originCountryId: result.originCountryId,
        destinationCountryId: result.destinationCountryId,
        visaRuleId: item.visaRuleId,
        eligibilityLabel: item.eligibilityLabel,
      });
      toast.success('Case created successfully');
      router.push(`/dashboard/cases/${res.data.id}`);
    } catch (error) {
      toast.error('Failed to create case');
    } finally {
      setSavingCase(null);
    }
  };

  const eligibilityBadge = (label: string) => {
    switch (label) {
      case 'LIKELY_ELIGIBLE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'POTENTIALLY_ELIGIBLE':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="container-premium relative z-10 text-center">
          <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <FileCheck2 className="h-4 w-4 text-[#C9A96E]" /> Smart Assessment
          </motion.span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-white">Find Your Immigration Pathway</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">Answer a few questions and discover the best visa options for your profile.</p>
        </div>
      </section>

      <div className="container-premium max-w-3xl py-12 md:py-16">
        {!result ? (
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              {/* Progress Steps */}
              <div className="mb-8 flex items-center justify-between">
                {steps.map((s, idx) => {
                  const isActive = step === s.number;
                  const isCompleted = step > s.number;
                  return (
                    <div key={s.number} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all', isCompleted ? 'bg-[#0B5D66] border-[#0B5D66] text-white' : isActive ? 'border-[#0B5D66] bg-[#0B5D66]/10 text-[#0B5D66]' : 'border-gray-300 bg-white text-gray-400')}>
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                        </div>
                        <span className={cn('mt-2 text-xs font-medium', isActive || isCompleted ? 'text-[#0B5D66]' : 'text-gray-400')}>{s.label}</span>
                      </div>
                      {idx < steps.length - 1 && <div className={cn('mx-2 h-0.5 flex-1', step > idx + 1 ? 'bg-[#0B5D66]' : 'bg-gray-200')} />}
                    </div>
                  );
                })}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                  <h3 className="font-display text-2xl font-semibold text-[#111827]">Country Information</h3>
                  <p className="mt-2 text-sm text-gray-500">Tell us where you're from and where you want to go.</p>
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[#111827]">I am from</label>
                      <select value={form.originCountryCode} onChange={(e) => updateForm('originCountryCode', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30" required>
                        <option value="">Select country</option>
                        {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">I want to go to</label>
                      <select value={form.destinationCountryCode} onChange={(e) => updateForm('destinationCountryCode', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30" required>
                        <option value="">Select country</option>
                        {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button onClick={next} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                  <h3 className="font-display text-2xl font-semibold text-[#111827]">Personal Details</h3>
                  <p className="mt-2 text-sm text-gray-500">Help us understand your background.</p>
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Age</label>
                      <input type="number" value={form.age} onChange={(e) => updateForm('age', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Marital Status</label>
                      <select value={form.maritalStatus} onChange={(e) => updateForm('maritalStatus', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]">
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Education Level</label>
                      <select value={form.educationLevel} onChange={(e) => updateForm('educationLevel', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]">
                        <option value="high_school">High School</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Occupation</label>
                      <input value={form.occupation} onChange={(e) => updateForm('occupation', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Work Experience (years)</label>
                      <input type="number" value={form.workExperienceYears} onChange={(e) => updateForm('workExperienceYears', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button variant="ghost" onClick={prev} className="text-gray-600"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button onClick={next} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                  <h3 className="font-display text-2xl font-semibold text-[#111827]">Financial & Purpose</h3>
                  <p className="mt-2 text-sm text-gray-500">Final step – your financial profile and migration goal.</p>
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Annual Income (USD)</label>
                      <input type="number" value={form.annualIncome} onChange={(e) => updateForm('annualIncome', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Investment Budget (USD)</label>
                      <input type="number" value={form.investmentBudget} onChange={(e) => updateForm('investmentBudget', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Language Test</label>
                      <input value={form.languageTest} onChange={(e) => updateForm('languageTest', e.target.value)} placeholder="e.g., IELTS 7.0" className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Purpose</label>
                      <select value={form.purpose} onChange={(e) => updateForm('purpose', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]">
                        <option value="">Select purpose</option>
                        {purposes.map((p) => <option key={p} value={p}>{p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#111827]">Family Size</label>
                      <input type="number" min="1" value={form.familySize} onChange={(e) => updateForm('familySize', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#111827]" />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button variant="ghost" onClick={prev} className="text-gray-600"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</> : 'Check Eligibility'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-display text-3xl font-semibold text-[#111827]">Your Results</h3>
              <p className="mt-2 text-gray-500">Based on your profile, we found the following pathways.</p>
            </div>
            {result.results.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">No visa pathways found. Please consult an advisor for personalized guidance.</p>
              </div>
            ) : (
              result.results.map((item: any) => (
                <motion.div
                  key={item.visaRuleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-[#C9A96E]" />
                          <h4 className="font-display text-xl font-semibold text-[#111827]">{item.visaName}</h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Government Fee: {item.governmentFee} {item.feeCurrency} • Processing: {item.processingTimeMin}-{item.processingTimeMax} days
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={cn('inline-block rounded-full border px-3 py-1 text-xs font-medium', eligibilityBadge(item.eligibilityLabel))}>
                            {item.eligibilityLabel.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-semibold text-[#111827]">Score: {item.score}%</span>
                        </div>
                        {/* Score progress bar */}
                        <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        {item.reasons?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-[#111827]">Feedback:</p>
                            <ul className="mt-1 space-y-1">
                              {item.reasons.map((reason: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => saveAsCase(item)}
                        disabled={savingCase === item.visaRuleId}
                        className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
                      >
                        {savingCase === item.visaRuleId ? 'Saving...' : 'Save as Case'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div className="text-center">
            <Button variant="ghost" onClick={() => { setResult(null); setStep(1); }} className="text-gray-600">
  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
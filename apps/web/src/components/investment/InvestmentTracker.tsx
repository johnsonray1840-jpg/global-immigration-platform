'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  Building2,
  Users,
  Coins,
  ArrowRight,
  CheckCircle2,
  Clock,
  Landmark,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProgramCostModel {
  id: string;
  name: string;
  country: string;
  flag: string;
  currency: string;
  symbol: string;
  baseInvestment: number;
  routes: Array<{
    name: string;
    amount: number;
    description: string;
  }>;
  govFeePrincipal: number;
  govFeeSpouse: number;
  govFeeChild: number;
  govFeeParent: number;
  dueDiligencePrincipal: number;
  dueDiligenceSpouse: number;
  dueDiligenceChild: number;
  legalAndProcessing: number;
  passportFees: number;
  processingMonths: string;
  visaFreeAccess: number;
}

const INVESTMENT_PROGRAMS: ProgramCostModel[] = [
  {
    id: 'st-kitts',
    name: 'St. Kitts & Nevis Citizenship by Investment',
    country: 'St. Kitts & Nevis',
    flag: '🇰🇳',
    currency: 'USD',
    symbol: '$',
    baseInvestment: 250000,
    routes: [
      { name: 'Sustainable Island State Contribution (SISC)', amount: 250000, description: 'Direct government fund contribution' },
      { name: 'Approved Developer Real Estate', amount: 400000, description: 'Qualifying luxury resort / condominium share' },
      { name: 'Approved Private Real Estate', amount: 800000, description: 'Full single-family residential title' },
    ],
    govFeePrincipal: 25000,
    govFeeSpouse: 15000,
    govFeeChild: 10000,
    govFeeParent: 10000,
    dueDiligencePrincipal: 10000,
    dueDiligenceSpouse: 7500,
    dueDiligenceChild: 4000,
    legalAndProcessing: 15000,
    passportFees: 1200,
    processingMonths: '4–6 Months',
    visaFreeAccess: 157,
  },
  {
    id: 'grenada',
    name: 'Grenada Citizenship by Investment (USA E-2 Treaty)',
    country: 'Grenada',
    flag: '🇬🇩',
    currency: 'USD',
    symbol: '$',
    baseInvestment: 150000,
    routes: [
      { name: 'National Transformation Fund (NTF)', amount: 150000, description: 'Government donation for single applicant / $200k for family' },
      { name: 'Approved Tourism Real Estate Share', amount: 220000, description: 'Government approved 5-star resort fractional deed' },
    ],
    govFeePrincipal: 25000,
    govFeeSpouse: 15000,
    govFeeChild: 10000,
    govFeeParent: 10000,
    dueDiligencePrincipal: 5000,
    dueDiligenceSpouse: 5000,
    dueDiligenceChild: 2000,
    legalAndProcessing: 14000,
    passportFees: 1000,
    processingMonths: '5–8 Months',
    visaFreeAccess: 148,
  },
  {
    id: 'dominica',
    name: 'Dominica Citizenship by Investment',
    country: 'Dominica',
    flag: '🇩🇲',
    currency: 'USD',
    symbol: '$',
    baseInvestment: 100000,
    routes: [
      { name: 'Economic Diversification Fund (EDF)', amount: 100000, description: 'Non-refundable direct state donation' },
      { name: 'Approved Real Estate Project', amount: 200000, description: 'Fractional luxury eco-resort investment' },
    ],
    govFeePrincipal: 25000,
    govFeeSpouse: 10000,
    govFeeChild: 10000,
    govFeeParent: 10000,
    dueDiligencePrincipal: 7500,
    dueDiligenceSpouse: 4000,
    dueDiligenceChild: 2000,
    legalAndProcessing: 12000,
    passportFees: 800,
    processingMonths: '3–5 Months',
    visaFreeAccess: 144,
  },
  {
    id: 'portugal',
    name: 'Portugal Golden Visa (Residency leading to EU Passport)',
    country: 'Portugal',
    flag: '🇵🇹',
    currency: 'EUR',
    symbol: '€',
    baseInvestment: 500000,
    routes: [
      { name: 'CMVM-Regulated Investment Fund', amount: 500000, description: 'Venture capital / private equity fund (No real estate)' },
      { name: 'Scientific Research / R&D Donation', amount: 500000, description: 'Accredited national scientific or technological project' },
      { name: 'Cultural Heritage / Arts Contribution', amount: 250000, description: 'Preservation of national cultural heritage' },
    ],
    govFeePrincipal: 6000,
    govFeeSpouse: 6000,
    govFeeChild: 3000,
    govFeeParent: 3000,
    dueDiligencePrincipal: 4500,
    dueDiligenceSpouse: 2500,
    dueDiligenceChild: 1000,
    legalAndProcessing: 18000,
    passportFees: 1500,
    processingMonths: '12–18 Months',
    visaFreeAccess: 189,
  },
  {
    id: 'greece',
    name: 'Greece Golden Visa (Permanent Residency)',
    country: 'Greece',
    flag: '🇬🇷',
    currency: 'EUR',
    symbol: '€',
    baseInvestment: 250000,
    routes: [
      { name: 'Commercial-to-Residential Conversion', amount: 250000, description: 'Industrial / commercial property conversion to residential' },
      { name: 'Listed Heritage Building Restoration', amount: 250000, description: 'Complete restoration of recognized historical property' },
      { name: 'Prime Tier 1 Real Estate (Athens / Islands)', amount: 800000, description: 'Direct acquisition of prime residential real estate' },
    ],
    govFeePrincipal: 2000,
    govFeeSpouse: 500,
    govFeeChild: 150,
    govFeeParent: 500,
    dueDiligencePrincipal: 2000,
    dueDiligenceSpouse: 1000,
    dueDiligenceChild: 500,
    legalAndProcessing: 12000,
    passportFees: 1000,
    processingMonths: '4–6 Months',
    visaFreeAccess: 188,
  },
  {
    id: 'malta-pr',
    name: 'Malta Permanent Residence Programme (MPRP)',
    country: 'Malta',
    flag: '🇲🇹',
    currency: 'EUR',
    symbol: '€',
    baseInvestment: 150000,
    routes: [
      { name: 'Property Lease + Government Contribution', amount: 150000, description: '5-year property lease (€10k–€12k/yr) + €98k direct contribution' },
      { name: 'Property Purchase + Contribution', amount: 350000, description: 'Real estate purchase (€300k–€350k) + €68k direct contribution' },
    ],
    govFeePrincipal: 40000,
    govFeeSpouse: 10000,
    govFeeChild: 7500,
    govFeeParent: 7500,
    dueDiligencePrincipal: 7500,
    dueDiligenceSpouse: 5000,
    dueDiligenceChild: 2500,
    legalAndProcessing: 25000,
    passportFees: 1500,
    processingMonths: '6–9 Months',
    visaFreeAccess: 187,
  },
  {
    id: 'uae',
    name: 'UAE Golden Visa (10-Year Renewable Residency)',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'USD',
    symbol: '$',
    baseInvestment: 545000,
    routes: [
      { name: 'Freehold Real Estate Investment (2M AED)', amount: 545000, description: 'Single or combined off-plan / completed properties' },
      { name: 'Public Investment Fund Deposit (2M AED)', amount: 545000, description: 'Fixed deposit in licensed UAE commercial bank for 2 years' },
    ],
    govFeePrincipal: 4500,
    govFeeSpouse: 3000,
    govFeeChild: 2000,
    govFeeParent: 2500,
    dueDiligencePrincipal: 2000,
    dueDiligenceSpouse: 1000,
    dueDiligenceChild: 500,
    legalAndProcessing: 9500,
    passportFees: 1000,
    processingMonths: '1–2 Months',
    visaFreeAccess: 183,
  },
  {
    id: 'usa-eb5',
    name: 'USA EB-5 Immigrant Investor Green Card',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    baseInvestment: 800000,
    routes: [
      { name: 'Targeted Employment Area (TEA) Regional Center', amount: 800000, description: 'USCIS-approved job-creating rural or high-unemployment project' },
      { name: 'Direct Non-TEA Enterprise', amount: 1050000, description: 'Direct commercial enterprise creating 10 full-time US jobs' },
    ],
    govFeePrincipal: 11160,
    govFeeSpouse: 3750,
    govFeeChild: 3750,
    govFeeParent: 0,
    dueDiligencePrincipal: 15000,
    dueDiligenceSpouse: 5000,
    dueDiligenceChild: 2500,
    legalAndProcessing: 35000,
    passportFees: 2000,
    processingMonths: '24–36 Months',
    visaFreeAccess: 186,
  },
];

export default function InvestmentTracker() {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('st-kitts');
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);
  const [hasSpouse, setHasSpouse] = useState<boolean>(true);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [parentsCount, setParentsCount] = useState<number>(0);

  const activeProgram = useMemo(() => {
    return INVESTMENT_PROGRAMS.find((p) => p.id === selectedProgramId) || INVESTMENT_PROGRAMS[0];
  }, [selectedProgramId]);

  const activeRoute = useMemo(() => {
    return activeProgram.routes[selectedRouteIdx] || activeProgram.routes[0];
  }, [activeProgram, selectedRouteIdx]);

  // Calculate itemized financial breakdown
  const calculations = useMemo(() => {
    const capitalInvestment = activeRoute.amount;
    
    // Government fees
    const govFees =
      activeProgram.govFeePrincipal +
      (hasSpouse ? activeProgram.govFeeSpouse : 0) +
      childrenCount * activeProgram.govFeeChild +
      parentsCount * activeProgram.govFeeParent;

    // Due diligence fees
    const dueDiligence =
      activeProgram.dueDiligencePrincipal +
      (hasSpouse ? activeProgram.dueDiligenceSpouse : 0) +
      childrenCount * activeProgram.dueDiligenceChild;

    // Professional legal & escrow admin
    const legalAndAdmin = activeProgram.legalAndProcessing;

    // Passports & biometric issuance
    const passportCosts = activeProgram.passportFees * (1 + (hasSpouse ? 1 : 0) + childrenCount + parentsCount);

    const totalEstimatedOutlay = capitalInvestment + govFees + dueDiligence + legalAndAdmin + passportCosts;

    // Milestone Tranches Schedule
    const tranche1Retainer = Math.round(legalAndAdmin * 0.5 + dueDiligence);
    const tranche2GovernmentDeposit = Math.round(govFees * 0.5 + 10000);
    const tranche3CapitalFunding = capitalInvestment;
    const tranche4FinalClosing = totalEstimatedOutlay - (tranche1Retainer + tranche2GovernmentDeposit + tranche3CapitalFunding);

    return {
      capitalInvestment,
      govFees,
      dueDiligence,
      legalAndAdmin,
      passportCosts,
      totalEstimatedOutlay,
      tranche1Retainer,
      tranche2GovernmentDeposit,
      tranche3CapitalFunding,
      tranche4FinalClosing,
      familyMembersCount: 1 + (hasSpouse ? 1 : 0) + childrenCount + parentsCount,
    };
  }, [activeProgram, activeRoute, hasSpouse, childrenCount, parentsCount]);

  const handleDownloadSummary = () => {
    toast.success('Official Investment Cost Statement generated! Download started.');
  };

  return (
    <div className="w-full rounded-3xl border border-sky-500/20 bg-[#030D1A]/90 backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-sky-950/60 text-foreground">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-sky-500/15">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3.5 py-1 text-xs font-semibold text-sky-300 border border-sky-500/30 mb-3">
            <Calculator className="h-3.5 w-3.5 text-accent" />
            INSTITUTIONAL WEALTH & CBI CALCULATOR
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Investment Capital & Expense Tracker
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
            Real-time fee schedule calculator for Citizenship & Residency by Investment. Accurately model qualifying capital requirements, government surcharges, and legal escrow milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={handleDownloadSummary}
            variant="outline"
            className="border-sky-500/30 text-sky-200 hover:bg-sky-500/10 hover:border-sky-400 font-medium"
          >
            <Download className="mr-2 h-4 w-4 text-accent" /> Export Statement
          </Button>
          <Link href="/consultation">
            <Button className="btn-gold font-semibold shadow-md">
              Speak with Advisor
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Selector on Left, Real-time Ledger on Right */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Country & Program */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              1. Select Destination Program
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {INVESTMENT_PROGRAMS.map((prog) => {
                const isSelected = prog.id === selectedProgramId;
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setSelectedProgramId(prog.id);
                      setSelectedRouteIdx(0);
                    }}
                    className={cn(
                      'flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer',
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-900/30 ring-1 ring-sky-400/50'
                        : 'bg-[#0A1F38]/70 border-sky-500/15 text-slate-300 hover:bg-white/5 hover:border-sky-500/30'
                    )}
                  >
                    <span className="text-2xl">{prog.flag}</span>
                    <span className="mt-2 text-xs font-semibold line-clamp-1">{prog.country}</span>
                    <span className="text-[10px] text-accent font-medium mt-0.5">
                      From {prog.symbol}{prog.baseInvestment.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Investment Route */}
          <div className="pt-4 border-t border-sky-500/15">
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              2. Qualifying Investment Route
            </label>
            <div className="space-y-2.5">
              {activeProgram.routes.map((route, idx) => {
                const isSelected = idx === selectedRouteIdx;
                return (
                  <button
                    key={route.name}
                    onClick={() => setSelectedRouteIdx(idx)}
                    className={cn(
                      'flex w-full items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer',
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-md'
                        : 'bg-[#0A1F38]/60 border-sky-500/15 text-slate-300 hover:bg-white/5'
                    )}
                  >
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        {route.name}
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-sky-400" />}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{route.description}</p>
                    </div>
                    <div className="text-right shrink-0 pl-4">
                      <span className="font-display text-base sm:text-lg font-bold text-accent">
                        {activeProgram.symbol}{route.amount.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Family Member Composition */}
          <div className="pt-4 border-t border-sky-500/15">
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              3. Family Composition (Dependents)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Spouse toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-500/15 bg-[#0A1F38]/60">
                <div>
                  <p className="text-xs font-semibold text-white">Include Spouse</p>
                  <p className="text-[10px] text-slate-400">Marriage Certificate</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasSpouse(!hasSpouse)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative cursor-pointer',
                    hasSpouse ? 'bg-sky-500' : 'bg-slate-700'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform',
                      hasSpouse ? 'translate-x-6' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Children counter */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-500/15 bg-[#0A1F38]/60">
                <div>
                  <p className="text-xs font-semibold text-white">Children (&lt;28)</p>
                  <p className="text-[10px] text-slate-400">{childrenCount} Dependent(s)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold hover:bg-sky-500/30 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white w-4 text-center">{childrenCount}</span>
                  <button
                    onClick={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                    className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold hover:bg-sky-500/30 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Parents counter */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-500/15 bg-[#0A1F38]/60">
                <div>
                  <p className="text-xs font-semibold text-white">Parents (&gt;55)</p>
                  <p className="text-[10px] text-slate-400">{parentsCount} Dependent(s)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setParentsCount(Math.max(0, parentsCount - 1))}
                    className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold hover:bg-sky-500/30 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white w-4 text-center">{parentsCount}</span>
                  <button
                    onClick={() => setParentsCount(Math.min(4, parentsCount + 1))}
                    className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold hover:bg-sky-500/30 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Itemized Real-Time Spending Ledger */}
        <div className="lg:col-span-5 rounded-3xl border border-sky-500/30 bg-gradient-to-b from-[#0A2548] to-[#041324] p-6 sm:p-7 shadow-2xl space-y-6">
          {/* Program Overview Snapshot */}
          <div className="flex items-center justify-between pb-5 border-b border-sky-500/20">
            <div>
              <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                {activeProgram.country}
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                Financial Outlay Model
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                <Clock className="h-3 w-3 text-sky-400" /> {activeProgram.processingMonths}
              </span>
              <span className="text-xs text-accent font-semibold block mt-0.5">
                {activeProgram.visaFreeAccess} Visa-Free Countries
              </span>
            </div>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-sky-400" /> Qualifying Capital Outlay
              </span>
              <span className="font-bold text-white font-mono">
                {activeProgram.symbol}{calculations.capitalInvestment.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-sky-400" /> Government Application Dues
              </span>
              <span className="font-bold text-white font-mono">
                {activeProgram.symbol}{calculations.govFees.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" /> Due Diligence & Background Checks
              </span>
              <span className="font-bold text-white font-mono">
                {activeProgram.symbol}{calculations.dueDiligence.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-sky-400" /> Legal Advisory & Escrow Management
              </span>
              <span className="font-bold text-white font-mono">
                {activeProgram.symbol}{calculations.legalAndAdmin.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-sky-400" /> Passport Issuance & Biometrics ({calculations.familyMembersCount} Pax)
              </span>
              <span className="font-bold text-white font-mono">
                {activeProgram.symbol}{calculations.passportCosts.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-sky-300">
              Total Estimated All-Inclusive Outlay
            </p>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {activeProgram.symbol}{calculations.totalEstimatedOutlay.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-300">{activeProgram.currency}</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              For {calculations.familyMembersCount} applicant(s) • Locked-in transparent pricing
            </p>
          </div>

          {/* Tranche Escrow Payment Timeline */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-2.5">
              Payment Tranches & Escrow Schedule
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-semibold text-white">Stage 1: Retainer & Due Diligence</p>
                  <p className="text-[10px] text-slate-400">Upon engagement agreement</p>
                </div>
                <span className="font-mono font-bold text-sky-300">
                  {activeProgram.symbol}{calculations.tranche1Retainer.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-semibold text-white">Stage 2: Official Filing & Gov Deposit</p>
                  <p className="text-[10px] text-slate-400">Upon government dossier lodgement</p>
                </div>
                <span className="font-mono font-bold text-sky-300">
                  {activeProgram.symbol}{calculations.tranche2GovernmentDeposit.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-semibold text-white">Stage 3: Capital Investment Funding</p>
                  <p className="text-[10px] text-slate-400">Released only on Approval in Principle</p>
                </div>
                <span className="font-mono font-bold text-accent">
                  {activeProgram.symbol}{calculations.tranche3CapitalFunding.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link href="/consultation">
            <Button className="w-full btn-gold h-12 text-sm sm:text-base font-bold shadow-lg">
              Start Application & Secure Slot <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

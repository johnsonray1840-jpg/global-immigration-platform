'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import api from '@/lib/api-client';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

// Dynamic import for 3D globe with loading fallback
const GlobeMap = dynamic(() => import('@/components/map/GlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#071A2B]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  ),
});

const purposes = [
  'permanent-residence',
  'citizenship',
  'work',
  'study',
  'investment',
  'family',
  'tourist',
  'business',
];

export default function PremiumHero() {
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    api.get('/countries')
      .then((res) => setCountries(res.data))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (purpose) params.set('purpose', purpose);
    window.location.href = `/eligibility?${params.toString()}`;
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-gradient-to-br from-[#030D1A] via-[#071E38] to-[#0A3258]">
      {/* Interactive 3D Globe background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <GlobeMap className="h-full w-full" />
      </div>

      {/* Futuristic glowing sky-blue overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#030D1A]/95 via-[#071E38]/85 to-[#0284C7]/25" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#030D1A] via-transparent to-transparent" />

      {/* Content */}
      <div className="container-premium relative z-10 flex h-full flex-col justify-center items-start text-left max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-4 py-2 text-xs sm:text-sm font-semibold text-sky-300 backdrop-blur-md border border-sky-400/30">
            <ShieldCheck className="h-4 w-4 text-accent" />
            GLOBAL IMMIGRATION & WEALTH MOBILITY
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white tracking-tight hero-text-shadow"
        >
          Your Journey <span className="bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">Beyond Borders</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed"
        >
          Licensed global immigration, residency by investment, and second citizenship solutions for high-net-worth individuals, executives, and families worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col w-full sm:w-auto sm:flex-row gap-3.5"
        >
          <Link href="/programs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto btn-gold px-8 py-3.5 text-base font-bold rounded-xl shadow-lg">
              Explore Immigration Pathways
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/eligibility" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-sky-500/40 text-sky-200 hover:bg-sky-500/15 hover:border-sky-300 px-8 py-3.5 text-base font-semibold rounded-xl backdrop-blur-md">
              Check Points & Eligibility
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 w-full"
        >
          <div className="text-left text-white border-l border-accent/40 pl-3">
            <p className="font-display text-2xl md:text-3xl font-semibold">
              <AnimatedCounter end={50} suffix="+" />
            </p>
            <p className="mt-1 text-xs md:text-sm text-white/80">Destinations</p>
          </div>
          <div className="text-left text-white border-l border-accent/40 pl-3">
            <p className="font-display text-2xl md:text-3xl font-semibold">
              <AnimatedCounter end={15000} suffix="+" />
            </p>
            <p className="mt-1 text-xs md:text-sm text-white/80">Clients Advised</p>
          </div>
          <div className="text-left text-white border-l border-accent/40 pl-3">
            <p className="font-display text-2xl md:text-3xl font-semibold">
              <AnimatedCounter end={25} suffix="+" />
            </p>
            <p className="mt-1 text-xs md:text-sm text-white/80">Legal Specialists</p>
          </div>
          <div className="text-left text-white border-l border-accent/40 pl-3">
            <p className="font-display text-2xl md:text-3xl font-semibold">
              24/7
            </p>
            <p className="mt-1 text-xs md:text-sm text-white/80">Global Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
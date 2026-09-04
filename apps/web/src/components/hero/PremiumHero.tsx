'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GlassCard } from '@/components/shared/glass-card';
import { ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import api from '@/lib/api-client';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

const GlobeMap = dynamic(() => import('@/components/map/GlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0B5D66]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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

export function SectionHeading({
  title,
  subtitle,
  className,
  titleClassName,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn('mb-10 md:mb-12 text-center', className)}>
      <h2 className={cn('font-display text-3xl md:text-4xl font-semibold tracking-tight text-[#111827]', titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-[#6B7280]">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto h-0.5 w-16 bg-[#C9A96E]" />
    </div>
  );
}

export default function PremiumHero() {
  const router = useRouter();
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    api.get('/countries').then((res) => setCountries(res.data)).catch(() => {});
  }, []);

  const handleSearch = () => {
    router.push(`/eligibility?from=${from}&to=${to}&purpose=${purpose}`);
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#0B5D66]">
      {/* Globe background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <GlobeMap className="h-full w-full" />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0B5D66]/95 via-[#0B5D66]/80 to-[#0B5D66]/40" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0B5D66]/60 to-transparent" />

      {/* Content */}
      <div className="container-premium relative z-10 flex h-full flex-col justify-center items-start text-left max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-[#C9A96E]" />
            {t('hero.badge')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-semibold leading-tight text-white hero-text-shadow"
        >
          {t('hero.journeyTitle')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl"
        >
          {t('hero.journeySubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/programs">
            <Button className="bg-[#C9A96E] text-[#111827] hover:bg-[#b8955c] px-8 py-3 text-base font-semibold rounded-md">
              {t('hero.exploreOptions')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/eligibility">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-base rounded-md">
              {t('hero.checkEligibility')}
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center text-white">
            <p className="font-display text-3xl font-semibold">
              <AnimatedCounter end={50} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-white/80">{t('stats.countries')}</p>
          </div>
          <div className="text-center text-white">
            <p className="font-display text-3xl font-semibold">
              <AnimatedCounter end={15000} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-white/80">{t('stats.cases')}</p>
          </div>
          <div className="text-center text-white">
            <p className="font-display text-3xl font-semibold">
              <AnimatedCounter end={98} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-white/80">{t('stats.approval')}</p>
          </div>
          <div className="text-center text-white">
            <p className="font-display text-3xl font-semibold">
              <AnimatedCounter end={50} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-white/80">{t('stats.years')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
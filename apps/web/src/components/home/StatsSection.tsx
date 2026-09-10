'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { ShieldCheck, Users, TrendingUp, Globe2 } from 'lucide-react';

const stats = [
  { icon: Globe2, end: 50, suffix: '+', label: 'Global Destinations' },
  { icon: Users, end: 15000, suffix: '+', label: 'Consultations Guided' },
  { icon: ShieldCheck, end: 25, suffix: '+', label: 'Legal & Immigration Partners' },
  { icon: TrendingUp, end: 100, suffix: '%', label: 'Transparent Case Management' },
];

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-[#071A2B] to-[#0A2540] py-16 text-white border-y border-border/20">
      <div className="container-premium grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
              <stat.icon className="h-6 w-6 text-accent" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-sm text-white/80">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
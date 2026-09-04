'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { ShieldCheck, Users, TrendingUp, Globe2 } from 'lucide-react';

const stats = [
  { icon: Globe2, end: 50, suffix: '+', label: 'Countries Served' },
  { icon: Users, end: 15000, suffix: '+', label: 'Successful Cases' },
  { icon: TrendingUp, end: 98, suffix: '%', label: 'Approval Rate' },
  { icon: ShieldCheck, end: 50, suffix: '+', label: 'Years Experience' },
];

export default function StatsSection() {
  return (
    <section className="bg-[#0B5D66] py-16">
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96E]/20">
              <stat.icon className="h-6 w-6 text-[#C9A96E]" />
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
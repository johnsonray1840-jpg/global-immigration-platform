'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarClock } from 'lucide-react';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-[#0B5D66] py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
      <div className="container-premium relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <CalendarClock className="h-4 w-4 text-[#C9A96E]" />
            Limited Availability
          </div>
          <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Book a Consultation
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Speak with a licensed immigration advisor today and take the first step toward your global future.
          </p>
          <Button
            onClick={() => router.push('/consultation')}
            className="mt-8 bg-[#C9A96E] px-8 py-3 text-[#111827] hover:bg-[#b8955c]"
          >
            Schedule Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
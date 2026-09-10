'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarClock } from 'lucide-react';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#071A2B] to-[#0A2540] py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
      <div className="container-premium relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <CalendarClock className="h-4 w-4 text-accent" />
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
            className="mt-8 btn-gold px-8 py-3 text-foreground hover:bg-accent/90"
          >
            Schedule Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
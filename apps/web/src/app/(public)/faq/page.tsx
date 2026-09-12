'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import {
  Search,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  X,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    api.get('/faqs')
      .then((res) => setFaqs(res.data))
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [faqs]);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchesSearch =
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, search, activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10"
          >
            <HelpCircle className="h-4 w-4 text-accent" />
            Support Center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Find detailed answers about visas, residency, citizenship, and our process.
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="container-premium max-w-3xl py-10 md:py-14">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-10 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 min-h-[46px] shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all min-h-[38px]',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              )}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card">
              <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground/40" />
              <p className="mt-4 text-lg text-muted-foreground">
                No questions found. Try different keywords.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <Accordion type="single" collapsible className="space-y-3">
                {filtered.map((faq, i) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <AccordionItem
                      value={faq.id}
                      className={cn(
                        'group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md',
                        'data-[state=open]:border-accent/50 data-[state=open]:shadow-md'
                      )}
                    >
                      {/* Left accent line */}
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent transition-colors group-data-[state=open]:bg-accent" />
                      <div className="pl-1">
                        <AccordionTrigger className="flex w-full items-center justify-between gap-4 py-4 pr-4 pl-4 text-left hover:no-underline">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <HelpCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                {faq.question}
                              </p>
                              {faq.category && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                  <Tag className="h-3 w-3" />
                                  {faq.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-primary" />
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-5 pb-5">
                        <div className="rounded-lg bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </AnimatePresence>
          )}
        </div>

        {/* Still need help? */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
              Still have questions?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Our licensed advisors are ready to guide you through every step.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/12565858538?text=Hello%20Global%20Citizens%20Solution%2C%20I%20have%20questions%20regarding%20immigration%20and%20visa%20options."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-emerald-500 hover:to-emerald-400 transition-all border border-emerald-400/30"
              >
                <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp: +1 (256) 585-8538</span>
              </a>
              <a href="/consultation">
                <Button className="btn-gold px-6 py-3 font-semibold shadow-md">
                  Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(77,168,255,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-glass"
          >
            <HelpCircle className="h-4 w-4 text-primary" />
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
            Find detailed answers about visas, residency, citizenship, and more.
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="container-premium max-w-3xl py-8 md:py-10">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full rounded-lg border border-input bg-card py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
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
            <div className="py-16 text-center">
              <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground" />
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
                        'data-[state=open]:border-primary/50 data-[state=open]:shadow-lg'
                      )}
                    >
                      {/* Left accent line */}
                      <span className="absolute left-0 top-0 h-full w-1 bg-transparent transition-colors group-data-[state=open]:bg-primary" />
                      <div className="pl-1">
                        <AccordionTrigger className="flex w-full items-center justify-between gap-4 py-4 pr-4 text-left">
                          <div className="flex items-start gap-3">
                            {/* Question icon based on category or default */}
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <HelpCircle className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                                {faq.question}
                              </p>
                              {faq.category && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                  <Tag className="h-3 w-3" />
                                  {faq.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-primary" />
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="pl-12 pr-4 pb-5">
                        <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-foreground/80">
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
          <GlassCard className="p-8">
            <MessageCircle className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
              Still have questions?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Our licensed advisors are ready to help you.
            </p>
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 btn-glow">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
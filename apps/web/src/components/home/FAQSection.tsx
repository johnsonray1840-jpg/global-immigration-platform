'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/shared/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  { category: 'Visas & Processing', q: 'What is the processing time for a US tourist visa?', a: 'The typical processing time for a US tourist visa (B-2) ranges from 15 to 30 days, but this can vary significantly based on the embassy location, current workload, and the applicant’s individual profile. We provide real‑time tracking and expedited appointment services for eligible clients.' },
  { category: 'Guarantees & Approval', q: 'Do you guarantee visa approval?', a: 'No consultancy can ethically guarantee visa approval, as the final decision lies solely with government authorities. However, we maximize your chances through expert preparation, thorough document review, and personalized guidance. Our success rate is above 98% for clients who follow our recommendations.' },
  { category: 'Permanent Residence', q: 'Can I apply for permanent residence from my home country?', a: 'Yes, most countries allow you to apply for permanent residence from your home country, provided you meet the eligibility criteria (e.g., Express Entry, skilled migration, or family sponsorship). We assist with the entire remote application process, including document notarization and consulate interviews.' },
  { category: 'Fees & Payments', q: 'What fees do you charge?', a: 'Our service fees are transparent and separate from government fees. We offer three packages – Essential, Premium, and Concierge – ranging from $1,200 to $3,000. Government fees are paid directly to the relevant authorities. A detailed breakdown is provided before you commit.' },
  { category: 'Documents', q: 'What documents are typically required?', a: 'Common documents include a valid passport, proof of funds, educational certificates, police clearance, medical report, and employment letters. The exact checklist depends on your destination and visa type. Our platform generates a customized checklist for your case.' },
  { category: 'Family & Dependents', q: 'Can I include my family members in my application?', a: 'Yes, most visa categories allow you to include your spouse and dependent children. We handle the dependent applications as part of your case, ensuring all forms and supporting documents meet the specific requirements of the destination country.' },
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container-premium max-w-3xl">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Comprehensive answers to help you navigate your immigration journey."
        />
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <AccordionItem
                value={`item-${i}`}
                className={cn(
                  'group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md',
                  'data-[state=open]:border-accent/50 data-[state=open]:shadow-lg'
                )}
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-transparent transition-colors group-data-[state=open]:bg-accent" />
                <div className="pl-1">
                  <AccordionTrigger className="flex w-full items-center justify-between gap-4 py-4 pr-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                          {faq.q}
                        </span>
                        <p className="mt-0.5 text-xs text-gray-500">{faq.category}</p>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-accent" />
                  </AccordionTrigger>
                </div>
                <AccordionContent className="pl-12 pr-4 pb-5">
                  <div className="rounded-lg bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
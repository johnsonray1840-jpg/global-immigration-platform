'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/shared/section-heading';
import { Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api-client';

const fallbackPartners = [
  { name: 'Worldwide Visas', category: 'Immigration Law', description: 'Full-service visa processing' },
  { name: 'Global Mobility Alliance', category: 'Relocation Services', description: 'Corporate relocation experts' },
  { name: 'Immigration Law Partners', category: 'Legal Advisory', description: 'Trusted immigration attorneys' },
  { name: 'Study Abroad Network', category: 'Education', description: 'University placement specialists' },
  { name: 'International Relocation Experts', category: 'Logistics', description: 'Door-to-door moving solutions' },
  { name: 'VisaFirst', category: 'Visa Services', description: 'Fast-track visa applications' },
];

const partnerGradients = [
  'from-primary to-primary/90',
  'from-[#C9A96E] to-[#B8955C]',
  'from-[#111827] to-[#374151]',
  'from-primary to-[#C9A96E]',
];

function getInitials(name: string) {
  return name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
}

export default function PartnersSection() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/partners')
      .then((res) => {
        setPartners(res.data);
        setLoading(false);
      })
      .catch(() => {
        setPartners(fallbackPartners);
        setLoading(false);
      });
  }, []);

  const displayPartners = partners.length > 0 ? partners : fallbackPartners;

  return (
    <section className="py-16 bg-background">
      <div className="container-premium">
        <SectionHeading
          title="Trusted Partners"
          subtitle="We collaborate with leading global organizations to provide seamless immigration support."
        />
        {loading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-24 w-48 rounded-xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayPartners.map((partner, i) => {
              const gradient = partnerGradients[i % partnerGradients.length];
              return (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group"
                >
                  <div className="relative h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-bold text-white shadow-lg', gradient)}>
                        {getInitials(partner.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-lg font-semibold text-foreground">{partner.name}</h3>
                        <p className="text-xs text-gray-500">{partner.category || 'Partner'}</p>
                      </div>
                    </div>
                    {partner.description && (
                      <p className="mt-3 text-sm text-muted-foreground">{partner.description}</p>
                    )}
                    <Handshake className="absolute bottom-4 right-4 h-5 w-5 text-gray-200 transition-colors group-hover:text-accent" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
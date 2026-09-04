'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { GlassCard } from '@/components/shared/glass-card';
import { ExternalLink } from 'lucide-react';

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    api.get('/partners').then((res) => setPartners(res.data)).catch(() => {});
  }, []);

  return (
    <div className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeading title="Our Partners" subtitle="We collaborate with trusted organizations worldwide." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <GlassCard key={partner.id} className="p-6 text-center">
              {partner.logoUrl && (
                <img src={partner.logoUrl} alt={partner.name} className="mx-auto h-16 w-16 rounded-full object-cover" />
              )}
              <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal dark:text-white">{partner.name}</h3>
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-ash-dark hover:text-charcoal">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

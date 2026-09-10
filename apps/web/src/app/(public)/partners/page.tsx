'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">Our Partners</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            We collaborate with accredited institutions, universities, and legal associations worldwide.
          </p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        {partners.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card">
            <p className="text-muted-foreground">No partners listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <div key={partner.id} className="rounded-2xl border border-border bg-card text-card-foreground p-6 text-center shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                {partner.logoUrl && (
                  <div className="mx-auto h-16 w-16 relative rounded-full overflow-hidden ring-2 ring-primary/20">
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{partner.name}</h3>
                {partner.website && (
                  <a href={partner.website} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Visit Website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

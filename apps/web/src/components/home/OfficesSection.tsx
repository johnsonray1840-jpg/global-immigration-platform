'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import api from '@/lib/api-client';

const fallbackOffices = [
  { id: 'nyc', country: { name: 'United States' }, address: '123 Liberty Street, Suite 400, New York, NY 10005', phone: '+1 (212) 555-0147', email: 'nyc@globalimmigration.com', hours: 'Mon-Fri, 9am-6pm' },
  { id: 'lon', country: { name: 'United Kingdom' }, address: '45 Kingsway, London WC2B 6DW', phone: '+44 20 7946 0958', email: 'london@globalimmigration.com', hours: 'Mon-Fri, 9am-5:30pm' },
  { id: 'doha', country: { name: 'Qatar' }, address: 'West Bay, Tornado Tower, Floor 22, Doha', phone: '+974 4455 6677', email: 'doha@globalimmigration.com', hours: 'Sun-Thu, 8am-4pm' },
];

export default function OfficesSection() {
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/offices')
      .then((res) => {
        setOffices(res.data.length > 0 ? res.data : fallbackOffices);
        setLoading(false);
      })
      .catch(() => {
        setOffices(fallbackOffices);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-card">
      <div className="container-premium">
        <SectionHeading
          title="Global Offices"
          subtitle="Our worldwide presence ensures local support wherever you are."
          className="text-foreground"
        />
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-56 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offices.map((office, i) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-foreground">{office.country?.name || 'Office'}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{office.address}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-accent" /> {office.phone}</p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-accent" /> {office.email}</p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-accent" /> {office.hours || 'Mon-Fri, 9am-6pm'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Globe2,
  Shield,
  DollarSign,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const metricConfig = {
  passportRank: { label: 'Passport Rank', icon: Globe2, reverse: true },
  safetyIndex: { label: 'Safety Index', icon: Shield },
  livingCostIndex: { label: 'Living Cost', icon: DollarSign, reverse: true },
  healthcareIndex: { label: 'Healthcare', icon: HeartPulse },
  educationIndex: { label: 'Education', icon: GraduationCap },
  taxRate: { label: 'Tax Rate', icon: TrendingUp, reverse: true },
};

export default function ComparePage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/countries')
      .then((res) => setCountries(res.data))
      .catch(() => {});
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [countries, search]);

  const toggle = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code].slice(0, 3)
    );
  };

  const clearAll = () => setSelectedCodes([]);

  const selectedData = countries.filter((c) =>
    selectedCodes.includes(c.code)
  );

  // Compute max value for each metric among selected countries to scale bars
  const maxValues = useMemo(() => {
    const maxima: Record<string, number> = {};
    Object.keys(metricConfig).forEach((metric) => {
      const values = selectedData.map((c) => c[metric]).filter((v) => typeof v === 'number');
      maxima[metric] = values.length > 0 ? Math.max(...values) : 0;
    });
    return maxima;
  }, [selectedData]);

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
            <Globe2 className="h-4 w-4 text-accent" />
            Side-by-Side Comparison
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white"
          >
            Compare Countries
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Select up to 3 countries to evaluate passport strength, safety, healthcare, and cost of living.
          </motion.p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        {/* Search and Clear */}
        <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 min-h-[44px]"
            />
          </div>
          {selectedCodes.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAll}
              className="shrink-0 border-border text-muted-foreground hover:text-foreground h-11"
            >
              <X className="mr-2 h-4 w-4" />
              Clear All ({selectedCodes.length})
            </Button>
          )}
        </div>

        {/* Country Selection Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {filteredCountries.slice(0, 30).map((c) => {
            const isSelected = selectedCodes.includes(c.code);
            return (
              <motion.button
                key={c.code}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(c.code)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-all min-h-[40px]',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                )}
              >
                <span className="mr-1.5">{getFlagEmoji(c.code)}</span> {c.name}
              </motion.button>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selectedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm p-6"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-border p-4 text-left text-sm font-semibold text-muted-foreground">
                    Metric
                  </th>
                  {selectedData.map((c) => (
                    <th key={c.id} className="border-b border-border p-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFlagEmoji(c.code)}</span>
                        <span className="font-display text-lg font-semibold text-foreground">{c.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(metricConfig).map(([metric, config]) => (
                  <tr key={metric} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{config.label}</span>
                      </div>
                    </td>
                    {selectedData.map((c) => {
                      const value = c[metric];
                      const isMax = value === maxValues[metric];
                      return (
                        <td key={c.id} className="p-4">
                          <div className="flex flex-col gap-1.5">
                            <span className={cn(
                              'font-semibold text-base',
                              isMax ? 'text-primary' : 'text-foreground'
                            )}>
                              {value ?? '—'}
                            </span>
                            {typeof value === 'number' && maxValues[metric] > 0 && (
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all duration-500',
                                    isMax ? 'bg-primary' : 'bg-primary/40'
                                  )}
                                  style={{ width: `${(value / maxValues[metric]) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Empty state when no selection */}
        {selectedData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 text-center py-12 rounded-2xl border border-dashed border-border bg-card"
          >
            <Globe2 className="mx-auto h-16 w-16 text-muted-foreground/40" />
            <p className="mt-4 text-lg text-muted-foreground">
              Select up to 3 countries above to begin comparison.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper to convert country code to flag emoji
function getFlagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
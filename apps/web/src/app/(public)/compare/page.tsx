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
    <div className="bg-background py-16 md:py-20">
      <div className="container-premium">
        <SectionHeading
          title="Compare Countries"
          subtitle="Select up to 3 countries to see side‑by‑side immigration metrics."
        />

        {/* Search and Clear */}
        <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {selectedCodes.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAll}
              className="shrink-0"
            >
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Country Selection Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {filteredCountries.slice(0, 30).map((c) => {
            const isSelected = selectedCodes.includes(c.code);
            return (
              <motion.button
                key={c.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(c.code)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                )}
              >
                {c.name}
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
            className="mt-12 overflow-x-auto"
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
                        <span className="text-xl">{getFlagEmoji(c.code)}</span>
                        <span className="font-display text-lg text-foreground">{c.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(metricConfig).map(([metric, config]) => (
                  <tr key={metric} className="border-b border-border last:border-0">
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
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              'font-semibold',
                              isMax ? 'text-primary' : 'text-foreground'
                            )}>
                              {value ?? '—'}
                            </span>
                            {typeof value === 'number' && (
                              <div className="h-1.5 w-full rounded-full bg-muted">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                    isMax ? 'bg-primary' : 'bg-primary/30'
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
            className="mt-16 text-center"
          >
            <Globe2 className="mx-auto h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">
              Select at least one country to begin comparison.
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
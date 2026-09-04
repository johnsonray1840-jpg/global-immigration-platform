'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, ArrowRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const fallbackPackages = [
  { id: 'family-relocation', name: 'Family Relocation', includes: ['Eligibility Assessment', 'Dependent Applications', 'Document Preparation'], serviceFee: 2500 },
  { id: 'student-success', name: 'Student Success', includes: ['University Matching', 'Scholarship Search', 'Admission Assistance'], serviceFee: 1200 },
  { id: 'skilled-worker', name: 'Skilled Worker', includes: ['Job Matching', 'Work Permit Application', 'Document Review'], serviceFee: 3000 },
];

const packageImages: Record<string, string> = {
  'family-relocation': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop',
  'student-success': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
  'skilled-worker': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop',
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get('/packages')
      .then((res) => {
        setPackages(res.data.length > 0 ? res.data : fallbackPackages);
        setLoading(false);
      })
      .catch(() => {
        setPackages(fallbackPackages);
        setLoading(false);
      });
  }, []);

  const handleImageError = (pkgId: string) => {
    setImageErrors((prev) => ({ ...prev, [pkgId]: true }));
  };

  const getPackageImage = (pkg: any) => {
    const key = pkg.id || pkg.name?.toLowerCase().replace(/\s+/g, '-');
    return packageImages[key] || packageImages['family-relocation'];
  };

  return (
    <div className="bg-[#F8FAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
          >
            <Package className="h-4 w-4 text-[#C9A96E]" />
            Premium Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white"
          >
            Service Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Transparent professional service fees. Government fees are separate and paid directly to authorities.
          </motion.p>
        </div>
      </section>

      {/* Packages Grid */}
      <div className="container-premium py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1,2,3].map((i) => (
              <div key={i} className="skeleton h-96 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {packages.map((pkg, i) => {
              const imageUrl = getPackageImage(pkg);
              const hasError = imageErrors[pkg.id] || imageErrors[pkg.name];
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
                    <div className="relative h-52 w-full overflow-hidden">
                      {!hasError ? (
                        <img
                          src={imageUrl}
                          alt={pkg.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={() => handleImageError(pkg.id || pkg.name)}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#0B5D66] to-[#0A4E56]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D66]/80 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-lg">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#C9A96E] px-3 py-1 text-xs font-semibold text-white">
                        <Star className="h-3 w-3 fill-white" /> Premium
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl font-semibold text-[#111827]">{pkg.name}</h3>
                      <ul className="mt-4 space-y-2">
                        {pkg.includes?.map((item: string) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#0B5D66]" /> {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="font-display text-2xl font-semibold text-[#111827]">
                          ${pkg.serviceFee?.toLocaleString()}
                        </span>
                        <Button variant="ghost" className="text-[#0B5D66] hover:text-[#0A4E56]">
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
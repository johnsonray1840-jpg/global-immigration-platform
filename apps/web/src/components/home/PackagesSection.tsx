'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import api from '@/lib/api-client';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  Briefcase,
  Sparkles,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const packageIcons: Record<string, any> = {
  'family-relocation': Users,
  'student-success': GraduationCap,
  'skilled-worker': Briefcase,
  default: Sparkles,
};

const packageImages: Record<string, string> = {
  'family-relocation': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop',
  'student-success': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
  'skilled-worker': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop',
};

function getKey(pkg: any) {
  return pkg.id || pkg.name?.toLowerCase().replace(/\s+/g, '-');
}

function getPackageIcon(pkg: any) {
  return packageIcons[getKey(pkg)] || packageIcons.default;
}

function getPackageImage(pkg: any) {
  return packageImages[getKey(pkg)] || packageImages['family-relocation'];
}

export default function PackagesSection() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get('/packages')
      .then((res) => {
        setPackages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fallbackPackages = [
    { id: 'family-relocation', name: 'Family Relocation', includes: ['Eligibility Assessment', 'Dependent Applications', 'Document Preparation'], serviceFee: 2500 },
    { id: 'student-success', name: 'Student Success', includes: ['University Matching', 'Scholarship Search', 'Admission Assistance'], serviceFee: 1200 },
    { id: 'skilled-worker', name: 'Skilled Worker', includes: ['Job Matching', 'Work Permit Application', 'Document Review'], serviceFee: 3000 },
  ];

  const displayPackages = packages.length > 0 ? packages : fallbackPackages;

  const handleImageError = (pkgId: string) => {
    setImageErrors((prev) => ({ ...prev, [pkgId]: true }));
  };

  return (
    <section className="bg-white py-20">
      <div className="container-premium">
        <SectionHeading
          title="Premium Service Packages"
          subtitle="Transparent service fees, government fees shown separately."
        />
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-96 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {displayPackages.map((pkg, i) => {
              const PackageIcon = getPackageIcon(pkg);
              const imageUrl = getPackageImage(pkg);
              const hasImageError = imageErrors[pkg.id] || imageErrors[getKey(pkg)];

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
                    <div className="relative h-52 w-full overflow-hidden">
                      {!hasImageError ? (
                        <img
                          src={imageUrl}
                          alt={pkg.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={() => handleImageError(pkg.id)}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#0B5D66] to-[#0A4E56]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D66]/80 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-lg">
                        <PackageIcon className="h-6 w-6 text-white" />
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
                        <Link
  href={`/packages/${pkg.id}`}
  className="inline-flex items-center text-sm font-medium text-[#0B5D66] hover:text-[#0A4E56]"
>
  Learn More <ArrowRight className="ml-1 h-4 w-4" />
</Link>
                      </div>
                    </div>
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
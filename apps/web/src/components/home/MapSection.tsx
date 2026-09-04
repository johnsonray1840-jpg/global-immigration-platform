'use client';

import { SectionHeading } from '@/components/shared/section-heading';
import dynamic from 'next/dynamic';

const GlobeMap = dynamic(() => import('@/components/map/GlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] md:h-[600px] items-center justify-center rounded-3xl bg-[#E8EEEE]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5D66]"></div>
    </div>
  ),
});

export default function MapSection() {
  return (
    <section className="py-20 bg-[#F8FAFA]">
      <div className="container-premium">
        <SectionHeading
          title="Global Reach"
          subtitle="Explore immigration pathways for over 50 countries. Click on a country to learn more."
        />
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <GlobeMap className="h-[500px] md:h-[600px] w-full" />
        </div>
      </div>
    </section>
  );
}
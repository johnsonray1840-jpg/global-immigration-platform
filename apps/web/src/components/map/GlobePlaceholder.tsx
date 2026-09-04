'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Globe2 } from 'lucide-react';

const GlobeMap = dynamic(() => import('./GlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-3xl bg-charcoal text-white">
      Loading interactive globe...
    </div>
  ),
});

export default function GlobePlaceholder() {
  const [showGlobe, setShowGlobe] = useState(false);

  if (showGlobe) {
    return <GlobeMap />;
  }

  return (
    <div className="relative mx-auto flex h-[500px] max-w-4xl items-center justify-center overflow-hidden rounded-3xl bg-charcoal">
      <img
        src="https://images.unsplash.com/photo-1589519160732-57fc4980a4e5?q=80&w=1200&auto=format&fit=crop"
        alt="World map"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        loading="lazy"
      />
      <div className="relative z-10 text-center text-white">
        <Globe2 className="mx-auto h-16 w-16" />
        <h3 className="mt-4 font-serif text-2xl font-semibold">Interactive World Map</h3>
        <p className="mt-2 text-sm text-white/80">Explore countries, time zones, and immigration pathways.</p>
        <Button
          onClick={() => setShowGlobe(true)}
          className="mt-6 bg-white text-charcoal hover:bg-ash-light"
        >
          Explore Interactive Globe
        </Button>
      </div>
    </div>
  );
}

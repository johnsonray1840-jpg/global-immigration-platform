'use client';

import dynamic from 'next/dynamic';

const GlobeMap = dynamic(() => import('./GlobeMap'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex max-w-4xl items-center justify-center rounded-3xl bg-ash-light p-12 text-center">
      <p className="text-ash-dark">Loading interactive 3D globe…</p>
    </div>
  ),
});

export default GlobeMap;

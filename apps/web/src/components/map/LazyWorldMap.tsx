'use client';

import dynamic from 'next/dynamic';

const InteractiveWorldMap = dynamic(
  () => import('./InteractiveWorldMap'),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex max-w-5xl items-center justify-center rounded-2xl bg-ash-light p-12 text-center">
        <p className="text-ash-dark">Loading interactive map…</p>
      </div>
    ),
  }
);

export default InteractiveWorldMap;

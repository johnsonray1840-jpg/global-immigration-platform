'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { AlertTriangle, RotateCcw, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError =
    error?.name === 'ChunkLoadError' ||
    /Loading chunk [\d]+ failed/i.test(error?.message || '') ||
    /Loading CSS chunk/i.test(error?.message || '') ||
    /Failed to fetch dynamically imported module/i.test(error?.message || '');

  useEffect(() => {
    // If it's a chunk mismatch from a new deployment, auto-reload once to fetch fresh assets
    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'gcs_chunk_reload_' + (error?.digest || 'auto');
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }, [error, isChunkError]);

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030D1A] px-4 py-8 text-white">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#C8A96B]/10 blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        <GlassCard className="p-8 md:p-10 border border-sky-500/20 bg-[#0A1F38]/90 backdrop-blur-2xl shadow-2xl rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-6">
            {isChunkError ? <RefreshCw className="h-7 w-7 animate-spin text-sky-400" /> : <AlertTriangle className="h-7 w-7 text-amber-400" />}
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            {isChunkError ? 'Updating Application...' : 'System Notice'}
          </h1>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {isChunkError
              ? 'A new version of Global Citizens Solution has been deployed. Refreshing to load the latest secure assets.'
              : error.message || 'We encountered a momentary issue while loading this module. Please try again.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleReload}
              className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl px-5 py-2.5 text-xs shadow-lg shadow-sky-500/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> {isChunkError ? 'Refresh Now' : 'Try Again'}
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 rounded-xl text-xs"
              >
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

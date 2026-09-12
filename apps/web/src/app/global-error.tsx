'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'gcs_global_chunk_reload_' + (error?.digest || 'auto');
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }, [error, isChunkError]);

  return (
    <html lang="en">
      <body className="bg-[#030D1A] text-white flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-sky-500/20 bg-[#0A1F38]/90 p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-5">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isChunkError ? 'Application Update Available' : 'Application Notice'}
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {isChunkError
              ? 'A fresh build has been deployed. Please reload to sync the latest secure updates.'
              : error.message || 'An unexpected error occurred.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.location.reload();
                else reset();
              }}
              className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-2.5 rounded-xl text-xs font-semibold text-white hover:from-sky-400 hover:to-sky-500 transition-all border border-sky-400/30 shadow-lg shadow-sky-500/20"
            >
              Refresh Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}


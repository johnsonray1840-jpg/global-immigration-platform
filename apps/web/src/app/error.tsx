'use client';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.1),transparent)]" />
      <div className="relative w-full max-w-md text-center">
        <GlassCard className="p-8 md:p-10 border border-border">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            System Notice
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {error.message || 'We encountered an unexpected issue while loading this page. Our team has been notified.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="btn-gold font-semibold shadow-xs">
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-muted">
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

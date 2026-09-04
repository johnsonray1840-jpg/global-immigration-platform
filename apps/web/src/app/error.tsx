'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-charcoal">
      <h1 className="font-serif text-4xl font-semibold text-charcoal dark:text-white">Something went wrong</h1>
      <p className="mt-4 text-ash-dark">{error.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset} className="mt-8 bg-charcoal text-white dark:bg-white dark:text-charcoal">
        Try Again
      </Button>
    </div>
  );
}

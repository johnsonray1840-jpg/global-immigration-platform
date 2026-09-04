import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark px-4 py-8">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(77,168,255,0.15),transparent)]" />

      <div className="relative w-full max-w-md text-center">
        <GlassCard className="p-8 md:p-10">
          <h1 className="font-display text-7xl font-bold text-primary">404</h1>
          <p className="mt-4 text-xl font-medium text-foreground">
            Page not found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/countries">
              <Button variant="outline" className="w-full text-foreground">
                <Compass className="mr-2 h-4 w-4" />
                Explore Countries
              </Button>
            </Link>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
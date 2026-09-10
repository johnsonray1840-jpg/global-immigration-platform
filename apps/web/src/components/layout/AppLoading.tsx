'use client';

export default function AppLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-navy"
    >
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight animate-pulse drop-shadow-[0_0_20px_rgba(200,169,107,0.6)]">
          Global<span className="text-accent">Citizens</span> Solution
        </h1>
        <p className="mt-4 text-slate-300 font-medium text-sm md:text-base">
          Preparing your global journey...
        </p>
        <span className="sr-only">Loading application...</span>
      </div>
    </div>
  );
}
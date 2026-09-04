'use client';

export default function AppLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B5D66]">
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white animate-pulse drop-shadow-[0_0_15px_rgba(201,169,110,0.8)]">
          Global<span className="text-[#C9A96E]">Immigration</span>
        </h1>
        <p className="mt-4 text-white/80">Preparing your journey...</p>
      </div>
    </div>
  );
}
'use client';

export default function AppLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B5D66]">
      {/* Static 2D map background */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <image
          // Actually we need a static image, not geojson. We'll use a public map image.
          // Replace with a static world map PNG/SVG
          href="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          width="800"
          height="600"
        />
      </svg>

      {/* Glowing site name */}
      <div className="relative z-10 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white animate-pulse drop-shadow-[0_0_15px_rgba(201,169,110,0.8)]">
          Global<span className="text-[#C9A96E]">Immigration</span>
        </h1>
        <p className="mt-4 text-white/80">Preparing your journey...</p>
      </div>
    </div>
  );
}
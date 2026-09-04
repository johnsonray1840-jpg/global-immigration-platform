'use client';

import { useEffect, useMemo, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { useRouter } from 'next/navigation';

const GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

export default function SimpleWorldMap({ className = '' }: { className?: string }) {
  const [geoData, setGeoData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch(GEOJSON_URL).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/countries`).then((res) => res.json()),
    ])
      .then(([geojson, countryList]) => {
        setGeoData(geojson);
        setCountries(countryList);
      })
      .catch((err) => console.error('2D map data load error:', err));
  }, []);

  const projection = useMemo(() => geoMercator().scale(140).translate([400, 300]), []);
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  const handleMouseEnter = (feature: any, event: React.MouseEvent) => {
    setHovered(feature.properties.name);
    setTooltip({ x: event.clientX, y: event.clientY, name: feature.properties.name });
  };

  const handleMouseLeave = () => {
    setHovered(null);
    setTooltip(null);
  };

  const handleClick = (feature: any) => {
    const country = countries.find((c) => c.name === feature.properties.name);
    if (country) router.push(`/countries/${country.code.toLowerCase()}`);
  };

  return (
    <div className={`relative w-full ${className}`} style={{ touchAction: 'pan-y' }}>
      <svg viewBox="0 0 800 600" className="h-full w-full" onMouseLeave={handleMouseLeave}>
        {geoData &&
          geoData.features.map((feature: any, i: number) => {
            const path = pathGenerator(feature);
            const isHovered = hovered === feature.properties.name;
            return (
              <path
                key={i}
                d={path || ''}
                fill={isHovered ? '#C9A96E' : '#E8EEEE'}   // Gold hover, light ash default
                stroke="#FFFFFF"
                strokeWidth="0.5"
                style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                onMouseEnter={(e) => handleMouseEnter(feature, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(feature)}
              />
            );
          })}
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg bg-[#0B5D66] px-3 py-1.5 text-sm text-white shadow-lg"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrls = [
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json',
];

export default function InteractiveWorldMap() {
  const [hovered, setHovered] = useState('');
  const [geoUrl, setGeoUrl] = useState(geoUrls[0]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setGeoUrl(geoUrls[0]);
    setError(false);
  }, []);

  const handleGeographyError = () => {
    if (geoUrl === geoUrls[0]) {
      setGeoUrl(geoUrls[1]);
    } else {
      setError(true);
    }
  };

  if (error) {
    return (
      <div className="mx-auto flex max-w-5xl items-center justify-center rounded-2xl bg-ash-light p-12 text-center">
        <p className="text-ash-dark">Interactive map is temporarily unavailable. Please explore countries via the directory.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
      <Geographies geography={geoUrl} onError={handleGeographyError}>
  {({ geographies }: { geographies: any[] }) =>
    geographies.map((geo: any) => (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        onMouseEnter={() => setHovered(geo.properties?.name || geo.properties?.NAME || '')}
        onMouseLeave={() => setHovered('')}
        style={{
          default: { fill: '#E0E0E0', outline: 'none', transition: 'all 0.3s' },
          hover: { fill: '#8A8A8A', outline: 'none', cursor: 'pointer' },
          pressed: { fill: '#2D2D2D', outline: 'none' },
        }}
      />
    ))
  }
</Geographies>
      </ComposableMap>
      {hovered && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-charcoal px-4 py-2 text-sm text-white shadow-lg">
          {hovered}
        </div>
      )}
    </div>
  );
}
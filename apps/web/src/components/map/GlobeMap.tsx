'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Globe from 'react-globe.gl';
import { isWebGLAvailable } from '@/lib/webgl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

const SimpleWorldMap = dynamic(() => import('./SimpleWorldMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function GlobeMap({ className = '' }: { className?: string }) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [hovered, setHovered] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [globeError, setGlobeError] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const router = useRouter();

  // Check WebGL support
  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  // Observe container size, with fallback
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    };

    updateDimensions();

    // Fallback if ResizeObserver fails or rect is zero initially
    const timeout = setTimeout(() => {
      if (dimensions.width === 0 || dimensions.height === 0) {
        // Set default dimensions
        setDimensions({ width: 800, height: 600 });
      }
    }, 1000);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateDimensions);
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeout);
      observer?.disconnect();
    };
  }, []);

  // Load data only if WebGL is supported
  useEffect(() => {
    if (!webglSupported) return;
    let mounted = true;
    Promise.all([
      fetch(GEOJSON_URL).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/countries`).then((res) => res.json()),
    ])
      .then(([geojson, countryList]) => {
        if (!mounted) return;
        const countryMap = new Map(countryList.map((c: any) => [c.name, c]));
        const features = geojson.features.map((feature: any) => {
          const country = countryMap.get(feature.properties.name);
          if (country) feature.properties = { ...feature.properties, ...country };
          return feature;
        });
        setCountries(features);
      })
      .catch((err) => {
        console.error('Globe data load error:', err);
        if (mounted) setGlobeError(true);
      });
    return () => {
      mounted = false;
    };
  }, [webglSupported]);

  // Auto-rotate and set ready when globe initializes
  const handleGlobeReady = useCallback(() => {
    setGlobeReady(true);
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = true;
      controls.enablePan = false;       // prevent page scroll conflict
      controls.zoomSpeed = 0.8;
      controls.rotateSpeed = 0.5;
      controls.touchRotate = true;
      controls.touchZoom = true;
      controls.touchPan = false;        // allow vertical page scroll
    }
  }, []);

  // Safety timeout: if globe hasn't become ready within 5 seconds after WebGL confirmed, force fallback
  useEffect(() => {
    if (webglSupported === true && !globeReady && !globeError) {
      const timer = setTimeout(() => {
        if (!globeReady) {
          console.warn('Globe did not initialize in time; falling back to 2D map.');
          setGlobeError(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [webglSupported, globeReady, globeError]);

  const handlePolygonClick = (polygon: any) => {
    const countryCode = polygon?.properties?.code;
    if (countryCode) router.push(`/countries/${countryCode.toLowerCase()}`);
  };

  // While checking WebGL
  if (webglSupported === null) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback to 2D map if WebGL not supported or 3D globe fails/times out
  if (!webglSupported || globeError) {
    return <SimpleWorldMap className={className} />;
  }

  // Wait for dimensions before rendering globe
  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div className={`bg-muted ${className}`} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries}
        polygonCapColor={() => 'rgba(255, 255, 255, 0.3)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
        polygonStrokeColor={() => '#4DA8FF'}
        polygonAltitude={0.01}
        polygonLabel={({ properties }: any) =>
          properties.name
            ? `<b>${properties.name}</b><br/>${properties.continent || ''}`
            : ''
        }
        onPolygonHover={setHovered}
        onPolygonClick={handlePolygonClick}
        onGlobeReady={handleGlobeReady}
        polygonsTransitionDuration={300}
      />
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg"
        >
          {hovered.properties.name} ({hovered.properties.code || ''})
        </motion.div>
      )}
    </div>
  );
}
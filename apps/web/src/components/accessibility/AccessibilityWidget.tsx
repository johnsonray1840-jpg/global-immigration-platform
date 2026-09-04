'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility,
  Minus,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AccessibilityWidget() {
  const [fontSize, setFontSize] = useState(16);
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(20, Math.max(14, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const resetFontSize = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-64 rounded-xl bg-dark p-5 shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-white">
                Accessibility
              </h3>
            </div>

            {/* Font Size Control */}
            <div className="mt-4">
              <p className="text-xs font-medium text-white/70">Font Size</p>
              <div className="mt-2 flex items-center justify-between rounded-lg bg-white/10 p-2">
                <button
                  onClick={() => adjustFontSize(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-primary hover:text-white"
                  aria-label="Decrease font size"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-white">{fontSize}px</span>
                <button
                  onClick={() => adjustFontSize(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-primary hover:text-white"
                  aria-label="Increase font size"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-4 space-y-2">
              <button
                onClick={resetFontSize}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Font Size
              </button>
              <button
                onClick={toggleHighContrast}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  highContrast
                    ? 'bg-primary text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <ZoomIn className="h-4 w-4" />
                High Contrast {highContrast ? 'On' : 'Off'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl btn-glow"
        aria-label="Toggle accessibility options"
      >
        <Accessibility className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
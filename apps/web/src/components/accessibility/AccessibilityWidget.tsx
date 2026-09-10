'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Minus, Plus, RotateCcw } from 'lucide-react';

export default function AccessibilityWidget() {
  const [fontSize, setFontSize] = useState(16);
  const [open, setOpen] = useState(false);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(20, Math.max(14, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const resetFontSize = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            role="region"
            aria-label="Accessibility options"
            className="mb-4 w-56 rounded-2xl bg-card text-card-foreground p-5 shadow-2xl border border-border"
          >
            <p className="text-sm font-semibold text-foreground">Font Scaling</p>
            <div className="mt-3 flex items-center justify-between bg-muted/60 p-1.5 rounded-xl border border-border">
              <button
                onClick={() => adjustFontSize(-1)}
                aria-label="Decrease font size"
                className="rounded-lg p-2 text-foreground hover:bg-card hover:text-primary transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-foreground" aria-live="polite">{fontSize}px</span>
              <button
                onClick={() => adjustFontSize(1)}
                aria-label="Increase font size"
                className="rounded-lg p-2 text-foreground hover:bg-card hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={resetFontSize}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Default
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle accessibility controls"
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-atlantic to-royal text-white shadow-2xl border border-accent/40"
      >
        <Accessibility className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
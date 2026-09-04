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
            className="mb-4 w-56 rounded-xl bg-white p-5 shadow-2xl ring-1 ring-gray-200"
          >
            <p className="text-sm font-medium text-[#111827]">Font Size</p>
            <div className="mt-2 flex items-center justify-between">
              <button onClick={() => adjustFontSize(-1)} className="rounded-md p-2 hover:bg-gray-100"><Minus className="h-4 w-4" /></button>
              <span className="text-sm text-gray-600">{fontSize}px</span>
              <button onClick={() => adjustFontSize(1)} className="rounded-md p-2 hover:bg-gray-100"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={resetFontSize} className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-[#0B5D66]">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B5D66] text-white shadow-2xl"
      >
        <Accessibility className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
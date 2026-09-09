'use client';

import { useState, useEffect } from 'react';
import AIChatWidget from './AIChatWidget';

export default function GlobalAIChat() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <AIChatWidget />;
}

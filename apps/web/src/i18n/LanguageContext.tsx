'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const RTL_LANGUAGES = ['ar', 'ur', 'he', 'fa'];

/**
 * Actively purge any legacy or third-party googtrans cookies from all domains & paths
 * to prevent external Google Translate engines from auto-translating the page.
 */
function clearAllGoogleTranslateCookies() {
  if (typeof document === 'undefined') return;
  try {
    const hostname = window.location.hostname;
    const paths = ['/', '/en', '/es', '/fr', ''];
    const domains = [
      '',
      hostname,
      `.${hostname}`,
      hostname.replace(/^www\./, ''),
      `.${hostname.replace(/^www\./, '')}`,
    ];

    paths.forEach((path) => {
      domains.forEach((domain) => {
        const domainPart = domain ? `; domain=${domain}` : '';
        const pathPart = path ? `; path=${path}` : '; path=/';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathPart}${domainPart};`;
      });
    });
  } catch (err) {
    console.warn('Cookie cleanup error:', err);
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // 1. Immediately purge any leftover Google Translate cookies
    clearAllGoogleTranslateCookies();

    // 2. Remove any previously injected Google Translate scripts if present
    const existingScript = document.getElementById('google-translate-script');
    if (existingScript) {
      existingScript.remove();
    }
    const existingFrame = document.querySelector('.goog-te-banner-frame');
    if (existingFrame) {
      existingFrame.remove();
    }

    // 3. Restore user-selected language if explicitly saved
    const saved = localStorage.getItem('app_language') as Language | null;
    if (saved && translations[saved]) {
      setLanguageState(saved);
      const isRTL = RTL_LANGUAGES.includes(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    } else {
      setLanguageState('en');
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', lang);
      clearAllGoogleTranslateCookies();

      const isRTL = RTL_LANGUAGES.includes(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
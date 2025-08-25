'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale, defaultLocale } from '@/i18n/config';

interface LanguageContextType {
  currentLocale: Locale;
  setLanguage: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get locale from pathname on initial load
    const segments = pathname.split('/');
    const locale = segments[1] as Locale;
    if (locales.includes(locale)) {
      setCurrentLocale(locale);
    }
  }, [pathname]);

  const setLanguage = (locale: Locale) => {
    setCurrentLocale(locale);
    
    // Update URL to include new locale
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const t = (key: string): string => {
    // Simple translation function - in production, use a proper i18n library
    // This is a placeholder implementation
    return key;
  };

  return (
    <LanguageContext.Provider value={{ currentLocale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

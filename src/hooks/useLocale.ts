import { startTransition, useEffect, useState } from 'react';
import type { Locale } from '../types';

const STORAGE_KEY = 'east-meridian-locale';
const LEGACY_STORAGE_KEY = 'north-meridian-locale';

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'zh';
}

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const candidates = [navigator.language, ...navigator.languages];
  return candidates.some((language) => language.toLowerCase().startsWith('zh')) ? 'zh' : 'en';
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(storedLocale)) {
      return storedLocale;
    }

    const legacyLocale = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isLocale(legacyLocale)) {
      return legacyLocale;
    }
  } catch {
    return detectBrowserLocale();
  }

  return detectBrowserLocale();
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      return;
    }
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    startTransition(() => {
      setLocaleState(nextLocale);
    });
  };

  return { locale, setLocale };
}

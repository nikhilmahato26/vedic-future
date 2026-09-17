"use client";

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Language for astrology text returned by the API (predictions, sign names, remedies).
 * The API translates natively; UI chrome stays bilingual-friendly English.
 */
export const ASTRO_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

const STORAGE_KEY = 'vf:astro-lang';
const AstroLangContext = createContext({ lang: 'en', setLang: () => {} });

export function AstroLangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // private mode — preference just won't persist
    }
  }, [lang]);

  return <AstroLangContext.Provider value={{ lang, setLang }}>{children}</AstroLangContext.Provider>;
}

export const useAstroLang = () => useContext(AstroLangContext);

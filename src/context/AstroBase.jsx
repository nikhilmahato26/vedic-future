"use client";

import { createContext, useCallback, useContext } from 'react';

/**
 * Route prefix for the astrology tools. Empty on the public site; the admin
 * dashboard mounts the same pages under `/admin/generate` (no checkout), so
 * cross-links between tools must stay inside that prefix.
 */
const AstroBaseContext = createContext('');

export function AstroBaseProvider({ base, children }) {
  return <AstroBaseContext.Provider value={base}>{children}</AstroBaseContext.Provider>;
}

export function useAstroBase() {
  return useContext(AstroBaseContext);
}

/** Maps a public tool path ('/kundali?tab=pdf', '/astrology') to the current base. */
export function useAstroHref() {
  const base = useContext(AstroBaseContext);
  return useCallback((path) => {
    if (!base) return path;
    if (path.startsWith('/astrology')) return base + path.slice('/astrology'.length);
    return base + path;
  }, [base]);
}

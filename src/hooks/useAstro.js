"use client";
import { useEffect, useState } from 'react';
import { astro } from '../lib/astro';
import { useAstroLang } from '../context/AstroLang';

/**
 * Fetch one astrology endpoint. Re-fetches when params change; results are cached
 * by the client so switching tabs back and forth is free.
 *
 * @param {string} endpoint
 * @param {object|null} params  pass null to skip the request
 * @param {{ localized?: boolean }} options  localized=false omits the lang param
 */
export default function useAstro(endpoint, params, { localized = true } = {}) {
  const { lang } = useAstroLang();
  const finalParams = params && (localized && lang !== 'en' ? { ...params, lang } : params);
  const key = finalParams ? `${endpoint}?${JSON.stringify(finalParams)}` : null;

  const [state, setState] = useState({ data: null, error: null, loading: Boolean(key) });

  useEffect(() => {
    if (!key) {
      setState({ data: null, error: null, loading: false });
      return;
    }
    let cancelled = false;
    setState((prev) => ({ data: prev.data, error: null, loading: true }));
    astro(endpoint, finalParams)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => {
      cancelled = true;
    };
    // `key` fully captures endpoint + params
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

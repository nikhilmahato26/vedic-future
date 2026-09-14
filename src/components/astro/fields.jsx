import { useEffect, useId, useRef, useState } from 'react';
import { MapPin, Loader2, Search } from '../../utils/icons';
import { searchPlaces } from '../../lib/astro';

export const inputCls =
  'w-full rounded-xl border border-navy-900/20 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-900/40 outline-none transition focus:border-coral/60 focus:ring-1 focus:ring-coral/30 [color-scheme:light]';

export const selectCls =
  'w-full rounded-xl border border-navy-900/20 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-coral/60 focus:ring-1 focus:ring-coral/30';

export function Field({ label, children, className = '', htmlFor }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-900/65">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * City autocomplete backed by the geo-search endpoint. Resolving a city gives us the
 * exact latitude, longitude and timezone the charts need — typing "Delhi" isn't enough.
 */
export function PlaceSearch({ value, onChange, id, placeholder = 'Search birth city…' }) {
  const [query, setQuery] = useState(value?.label || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlight, setHighlight] = useState(0);
  const listId = useId();
  const boxRef = useRef(null);

  useEffect(() => {
    setQuery(value?.label || '');
  }, [value?.label]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3 || q === value?.label) {
      setResults([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const found = await searchPlaces(q);
        setResults(found);
        setHighlight(0);
        setOpen(true);
        if (!found.length) setError('No matching city found. Try the nearest larger city.');
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [query, value?.label]);

  useEffect(() => {
    const close = (e) => !boxRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const choose = (place) => {
    onChange(place);
    setQuery(place.label);
    setOpen(false);
    setResults([]);
  };

  const onKeyDown = (e) => {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value && e.target.value !== value.label) onChange(null);
        }}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKeyDown}
        className={`${inputCls} pr-10`}
      />
      <span className="pointer-events-none absolute right-3.5 top-3.5 text-coral/70">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value ? <MapPin className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </span>

      {value && (
        <p className="mt-1.5 text-[11px] text-navy-900/45">
          {value.lat.toFixed(2)}°, {value.lon.toFixed(2)}° · UTC{value.tz >= 0 ? '+' : ''}{value.tz}
        </p>
      )}
      {error && !loading && <p className="mt-1.5 text-xs text-amber-200/80">{error}</p>}

      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-coral/25 bg-white py-1 shadow-glass">
          {results.map((place, i) => (
            <li
              key={`${place.label}-${place.lat}`}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(place);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm ${i === highlight ? 'bg-coral/15 text-coral' : 'text-navy-900/80'}`}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {place.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

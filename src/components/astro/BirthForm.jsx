"use client";
import { useId, useState } from 'react';
import { Sparkles, Loader2 } from '../../utils/icons';
import { Field, PlaceSearch, inputCls, selectCls } from './fields';

export const emptyBirth = { name: '', gender: 'male', date: '', time: '', place: null };

/** Name / gender / date / time / place inputs. Controlled: `value` + `onChange(birth)`. */
export function BirthFields({ value, onChange, showName = true, showGender = true, compact = false }) {
  const uid = useId();
  const set = (patch) => onChange({ ...value, ...patch });
  const grid = compact ? 'grid gap-4' : 'grid gap-5 sm:grid-cols-2';

  return (
    <div className={grid}>
      {showName && (
        <Field label="Full name" htmlFor={`${uid}-name`} className={compact ? '' : showGender ? '' : 'sm:col-span-2'}>
          <input id={`${uid}-name`} className={inputCls} placeholder="e.g. Rahul Sharma" value={value.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
      )}
      {showGender && (
        <Field label="Gender" htmlFor={`${uid}-gender`}>
          <select id={`${uid}-gender`} className={selectCls} value={value.gender} onChange={(e) => set({ gender: e.target.value })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
      )}
      <Field label="Date of birth" htmlFor={`${uid}-date`}>
        <input id={`${uid}-date`} type="date" required max="2100-12-31" min="1900-01-01" className={inputCls} value={value.date} onChange={(e) => set({ date: e.target.value })} />
      </Field>
      <Field label="Time of birth" htmlFor={`${uid}-time`}>
        <input id={`${uid}-time`} type="time" required className={inputCls} value={value.time} onChange={(e) => set({ time: e.target.value })} />
      </Field>
      <Field label="Place of birth" htmlFor={`${uid}-place`} className={compact ? '' : 'sm:col-span-2'}>
        <PlaceSearch id={`${uid}-place`} value={value.place} onChange={(place) => set({ place })} />
      </Field>
    </div>
  );
}

export function birthIsComplete(birth, { requireName = false } = {}) {
  return Boolean(birth.date && birth.time && birth.place && (!requireName || birth.name.trim()));
}

/** Stand-alone form with submit button. */
export default function BirthForm({ initial = emptyBirth, onSubmit, submitLabel = 'Generate', busy = false, requireName = false }) {
  const [birth, setBirth] = useState(initial);
  const [touched, setTouched] = useState(false);
  const complete = birthIsComplete(birth, { requireName });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (complete) onSubmit(birth);
      }}
      className="space-y-6"
    >
      <BirthFields value={birth} onChange={setBirth} />
      {touched && !complete && (
        <p role="alert" className="text-sm text-amber-200/90">
          {!birth.place ? 'Please pick your birth city from the suggestions list.' : 'Please fill in all the birth details.'}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-coral-gradient px-7 py-4 font-medium text-navy-950 shadow-glow transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
        {submitLabel}
      </button>
      <p className="text-center text-xs text-navy-900/45">
        Calculated with Swiss Ephemeris · Lahiri ayanamsa · Your details are not stored.
      </p>
    </form>
  );
}

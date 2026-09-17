"use client";
import { useEffect, useRef, useState } from 'react';
import { astro, AstroError } from '../lib/astro';

const POLL_MS = 8000;
const MAX_WAIT_MS = 8 * 60 * 1000; // reports/generate says 90-300s; give real headroom

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function fetchAndSave(jobId, filename) {
  const res = await fetch(`/api/astro/reports/download?job_id=${encodeURIComponent(jobId)}`);
  const type = res.headers.get('content-type') || '';

  if (type.includes('json')) {
    const body = await res.json();
    if (!res.ok || body.error) throw new AstroError(body.error || 'Download failed', res.status);
    const payload = body.response ?? body;
    const url = payload.url || payload.download_url || payload.pdf_url || payload.signed_url;
    if (url) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    const b64 = payload.pdf_base64 || payload.pdf || payload.base64 || payload.file;
    if (!b64) throw new AstroError('The report file was not included in the response.', 500);
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    saveBlob(new Blob([bytes], { type: 'application/pdf' }), filename);
    return;
  }

  if (!res.ok) throw new AstroError(`Download failed (${res.status})`, res.status);
  saveBlob(await res.blob(), filename);
}

/**
 * Generate → poll → download state machine for the async PDF report job
 * (reports/generate → reports/status → reports/download). Shared by the
 * single-chart PDF tab and the Kundli Milan compatibility PDF, which only
 * differ in which params they send and what UI they show around it.
 */
export default function usePdfReport() {
  const [job, setJob] = useState(null); // { id, status, startedAt } | null
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const poll = (id, startedAt) => {
    timer.current = setTimeout(async () => {
      try {
        const res = await astro('reports/status', { job_id: id }, { cache: false });
        const status = String(res?.status || res?.state || '').toLowerCase();
        if (status === 'done' || status === 'completed') {
          setJob({ id, status: 'done', startedAt });
        } else if (status === 'failed' || status === 'error') {
          setJob(null);
          setError(new AstroError(res?.error || 'Report generation failed. Please try again.', 500));
        } else if (Date.now() - startedAt > MAX_WAIT_MS) {
          setJob(null);
          setError(new AstroError('The report is taking unusually long. Please try again later.', 504));
        } else {
          setJob({ id, status: status || 'processing', startedAt });
          poll(id, startedAt);
        }
      } catch (e) {
        setJob(null);
        setError(e);
      }
    }, POLL_MS);
  };

  const generate = async (params) => {
    setError(null);
    setJob({ id: null, status: 'queuing', startedAt: Date.now() });
    try {
      const res = await astro('reports/generate', params, { cache: false });
      const id = res?.job_id;
      if (!id) throw new AstroError('Could not start the report. Please try again.', 500);
      const startedAt = Date.now();
      setJob({ id, status: 'pending', startedAt });
      poll(id, startedAt);
    } catch (e) {
      setJob(null);
      setError(e);
    }
  };

  const download = async (filename) => {
    setDownloading(true);
    setError(null);
    try {
      await fetchAndSave(job.id, filename);
    } catch (e) {
      setError(e);
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    clearTimeout(timer.current);
    setJob(null);
    setError(null);
  };

  return { job, error, downloading, generate, download, reset };
}

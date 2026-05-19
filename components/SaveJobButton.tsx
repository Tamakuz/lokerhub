"use client";

import { useEffect, useState } from "react";

export const savedJobsStorageKey = "lokerhub:saved-jobs";
export const savedJobsChangedEvent = "lokerhub:saved-jobs-changed";

function readSavedJobIds() {
  try {
    const value = window.localStorage.getItem(savedJobsStorageKey);
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string" && id.length > 0))) : [];
  } catch {
    return [];
  }
}

function writeSavedJobIds(ids: string[]) {
  window.localStorage.setItem(savedJobsStorageKey, JSON.stringify(Array.from(new Set(ids))));
  window.dispatchEvent(new Event(savedJobsChangedEvent));
}

export function getSavedJobIds() {
  return readSavedJobIds();
}

export function replaceSavedJobIds(ids: string[]) {
  writeSavedJobIds(ids);
}

export function SaveJobButton({ jobId, variant = "card" }: { jobId: string; variant?: "card" | "detail" }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    function syncSavedState() {
      setIsSaved(readSavedJobIds().includes(jobId));
    }

    syncSavedState();
    window.addEventListener(savedJobsChangedEvent, syncSavedState);
    window.addEventListener("storage", syncSavedState);

    return () => {
      window.removeEventListener(savedJobsChangedEvent, syncSavedState);
      window.removeEventListener("storage", syncSavedState);
    };
  }, [jobId]);

  function toggleSaved() {
    const ids = readSavedJobIds();
    writeSavedJobIds(isSaved ? ids.filter((id) => id !== jobId) : [...ids, jobId]);
  }

  const sizeClass = variant === "detail" ? "px-5 py-3 text-sm font-black" : "px-4 py-2 text-sm font-bold";
  const stateClass = isSaved ? "border border-leaf/20 bg-leaf/10 text-leaf" : "border border-ink/10 text-ink/70 hover:border-leaf/40 hover:text-leaf";

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Hapus dari lowongan tersimpan" : "Simpan lowongan"}
      className={`rounded-full text-center transition ${sizeClass} ${stateClass}`}
    >
      {isSaved ? "Tersimpan" : "Simpan"}
    </button>
  );
}

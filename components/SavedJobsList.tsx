"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { getSavedJobIds, replaceSavedJobIds, savedJobsChangedEvent } from "@/components/SaveJobButton";
import type { JobPost } from "@/lib/jobs";

export function SavedJobsList({ jobs }: { jobs: JobPost[] }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    function syncSavedJobs() {
      const ids = getSavedJobIds();
      const availableIds = new Set(jobs.map((job) => job.id));
      const validIds = ids.filter((id) => availableIds.has(id));

      if (validIds.length !== ids.length) {
        replaceSavedJobIds(validIds);
      }

      setSavedIds(validIds);
      setHasLoaded(true);
    }

    syncSavedJobs();
    window.addEventListener(savedJobsChangedEvent, syncSavedJobs);
    window.addEventListener("storage", syncSavedJobs);

    return () => {
      window.removeEventListener(savedJobsChangedEvent, syncSavedJobs);
      window.removeEventListener("storage", syncSavedJobs);
    };
  }, [jobs]);

  const savedJobs = savedIds.map((id) => jobs.find((job) => job.id === id)).filter((job): job is JobPost => Boolean(job));

  if (!hasLoaded) {
    return <p className="mt-8 rounded-3xl bg-white p-6 text-sm font-semibold text-ink/60">Memuat lowongan tersimpan...</p>;
  }

  if (savedJobs.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border border-dashed border-ink/20 bg-white p-8 text-center sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Shortlist kosong</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Belum ada lowongan tersimpan</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65">Simpan lowongan dari halaman browse atau detail untuk membandingkan peluang sebelum melamar di sumber asli.</p>
        <Link href="/jobs" className="mt-6 inline-flex rounded-full bg-leaf px-5 py-3 text-sm font-bold text-white hover:bg-leaf/90">Cari lowongan</Link>
      </section>
    );
  }

  return (
    <section className="mt-8 grid gap-4">
      {savedJobs.map((job) => <JobCard key={job.id} job={job} />)}
    </section>
  );
}

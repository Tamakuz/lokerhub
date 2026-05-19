"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { JobPost } from "@/lib/jobs";

const stopWords = new Set([
  "yang",
  "dan",
  "atau",
  "untuk",
  "dengan",
  "dari",
  "pada",
  "dalam",
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function scoreJob(job: JobPost, cvText: string) {
  const cvTokens = new Set(tokenize(cvText));
  const jobTokens = new Set(tokenize(`${job.title} ${job.company} ${job.category} ${job.location} ${job.employmentType} ${job.description}`));
  const matched = Array.from(jobTokens).filter((token) => cvTokens.has(token));
  const score = jobTokens.size > 0 ? Math.round((matched.length / Math.min(jobTokens.size, 18)) * 100) : 0;

  return {
    job,
    matched: matched.slice(0, 8),
    score: Math.min(score, 100),
  };
}

export function CvMatcher({ jobs }: { jobs: JobPost[] }) {
  const [cvText, setCvText] = useState("");
  const matches = useMemo(
    () => jobs.map((job) => scoreJob(job, cvText)).filter((match) => match.score > 0).sort((a, b) => b.score - a.score).slice(0, 3),
    [cvText, jobs],
  );

  return (
    <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">CV matcher</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Cari lowongan paling cocok dari teks CV kamu</h2>
        </div>
        <p className="text-sm font-semibold text-ink/55">Diproses di browser, tidak disimpan.</p>
      </div>
      <textarea
        value={cvText}
        onChange={(event) => setCvText(event.target.value)}
        rows={5}
        placeholder="Tempel ringkasan CV, skill, pengalaman, atau target role kamu..."
        className="mt-5 w-full rounded-2xl border border-ink/10 px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
      />
      {cvText.trim() ? (
        matches.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {matches.map(({ job, matched, score }) => (
              <article key={job.id} className="rounded-2xl bg-cream p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-leaf">{score}% match</p>
                    <h3 className="mt-1 font-black text-ink"><Link href={`/jobs/${job.id}`} className="hover:text-leaf">{job.title}</Link></h3>
                    <p className="mt-1 text-sm text-ink/65">{job.company} · {job.location}</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-ink/60">{job.category}</span>
                </div>
                {matched.length > 0 ? <p className="mt-3 text-xs font-semibold text-ink/55">Matched: {matched.join(", ")}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold text-ink/65">Belum ada match. Tambahkan skill, role, atau pengalaman yang lebih spesifik.</p>
        )
      ) : null}
    </section>
  );
}

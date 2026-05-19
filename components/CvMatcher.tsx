"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getLocalCvMatches, type CvMatchResult } from "@/lib/cvMatch";
import type { JobPost } from "@/lib/jobs";

const supportedTextTypes = new Set(["text/plain", "text/markdown", "text/csv", "application/json"]);

export function CvMatcher({ jobs }: { jobs: JobPost[] }) {
  const [cvText, setCvText] = useState("");
  const [aiMatches, setAiMatches] = useState<CvMatchResult[] | null>(null);
  const [matchSource, setMatchSource] = useState<"ai" | "local" | null>(null);
  const [message, setMessage] = useState("Diproses lokal di browser, tidak disimpan.");
  const [isMatching, setIsMatching] = useState(false);
  const localMatches = useMemo(
    () => getLocalCvMatches(jobs, cvText),
    [cvText, jobs],
  );
  const matches = (aiMatches ?? localMatches).map((match) => ({
    ...match,
    job: jobs.find((job) => job.id === match.jobId),
  })).filter((match): match is CvMatchResult & { job: JobPost } => Boolean(match.job));

  async function handleFileUpload(file: File | undefined) {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const isSupported = supportedTextTypes.has(file.type) || ["txt", "md", "csv", "json"].includes(extension ?? "");

    if (!isSupported) {
      setMessage("Untuk MVP, upload CV mendukung file teks: .txt, .md, .csv, atau .json. PDF/DOCX perlu parser tambahan.");
      return;
    }

    const text = await file.text();
    setCvText(text.slice(0, 20_000));
    setAiMatches(null);
    setMatchSource(null);
    setMessage(`File ${file.name} berhasil dimuat. Klik AI match untuk analisis 9router.`);
  }

  async function runAiMatch() {
    if (cvText.trim().length < 20) {
      setMessage("Tambahkan isi CV minimal 20 karakter sebelum menjalankan AI match.");
      return;
    }

    setIsMatching(true);

    try {
      const response = await fetch("/api/cv/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobs: jobs.slice(0, 30) }),
      });

      if (!response.ok) {
        throw new Error("Gagal menjalankan AI match");
      }

      const data = await response.json() as { source: "ai" | "local"; matches: CvMatchResult[] };
      setAiMatches(data.matches);
      setMatchSource(data.source);
      setMessage(data.source === "ai" ? "AI match selesai via 9router. CV tidak disimpan." : "9router belum tersedia atau gagal, hasil memakai fallback lokal.");
    } catch {
      setAiMatches(null);
      setMatchSource("local");
      setMessage("AI match gagal. Menampilkan hasil lokal di browser.");
    } finally {
      setIsMatching(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">CV matcher</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Upload CV dan cari lowongan paling cocok</h2>
        </div>
        <p className="text-sm font-semibold text-ink/55">{message}</p>
      </div>
      <div className="mt-5 grid gap-3 rounded-2xl bg-cream p-4 md:grid-cols-[1fr_auto] md:items-center">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Upload CV teks</span>
          <input
            type="file"
            accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
            onChange={(event) => handleFileUpload(event.target.files?.[0])}
            className="mt-2 block w-full text-sm text-ink/65 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-leaf"
          />
        </label>
        <button
          type="button"
          onClick={runAiMatch}
          disabled={isMatching}
          className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isMatching ? "Menganalisis..." : "AI match via 9router"}
        </button>
      </div>
      <textarea
        value={cvText}
        onChange={(event) => {
          setCvText(event.target.value);
          setAiMatches(null);
          setMatchSource(null);
        }}
        rows={5}
        placeholder="Tempel ringkasan CV, skill, pengalaman, atau target role kamu..."
        className="mt-5 w-full rounded-2xl border border-ink/10 px-4 py-3 text-sm text-ink outline-none focus:border-leaf"
      />
      {matchSource ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-leaf">Sumber hasil: {matchSource === "ai" ? "9router AI" : "local fallback"}</p> : null}
      {cvText.trim() ? (
        matches.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {matches.map(({ job, matched, score, reason }) => (
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
                {reason ? <p className="mt-2 text-xs font-semibold leading-5 text-ink/60">{reason}</p> : null}
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
